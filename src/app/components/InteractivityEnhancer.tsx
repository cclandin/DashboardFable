import { useEffect } from 'react';

/**
 * This component enhances the existing Figma frames with interactive tooltips
 * It runs after the DOM is loaded and adds event listeners to KPI cards, charts, etc.
 */
export function InteractivityEnhancer() {
  useEffect(() => {
    // Function to create and show tooltip
    const showTooltip = (element: HTMLElement, content: string) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'interactive-tooltip';
      tooltip.innerHTML = `
        <div class="bg-[#051e18] text-white px-4 py-3 rounded-lg shadow-2xl border border-[rgba(202,255,78,0.3)] max-w-[340px] text-[11px] leading-relaxed font-['DM_Sans:Regular',sans-serif]" style="font-variation-settings: 'opsz' 14">
          ${content}
        </div>
      `;
      tooltip.style.position = 'fixed';
      tooltip.style.zIndex = '10000';
      tooltip.style.pointerEvents = 'none';
      
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 10}px`;
      tooltip.style.transform = 'translate(-50%, -100%)';
      tooltip.style.opacity = '0';
      tooltip.style.transition = 'opacity 0.2s ease';
      
      document.body.appendChild(tooltip);
      
      // Fade in
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });
      
      return tooltip;
    };

    // Function to hide tooltip
    const hideTooltip = (tooltip: HTMLElement | null) => {
      if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          tooltip.remove();
        }, 200);
      }
    };

    // Add tooltips to KPI cards by detecting them via data attributes or class patterns
    const enhanceKPIs = () => {
      // Look for KPI containers - they typically have large numbers and labels
      const potentialKPIs = document.querySelectorAll('[class*="Card"], [class*="card"], [data-name*="Card"]');
      
      potentialKPIs.forEach((el) => {
        const element = el as HTMLElement;
        const textContent = element.textContent || '';
        
        // Check if it contains a percentage or large number (KPI indicators)
        if (textContent.match(/\d+[.,]\d+%?/) || textContent.match(/\d{2,}/)) {
          let activeTooltip: HTMLElement | null = null;
          
          element.style.cursor = 'help';
          element.style.transition = 'opacity 0.2s ease';
          
          element.addEventListener('mouseenter', () => {
            element.style.opacity = '0.9';
            
            // Extract KPI value from text content
            const value = textContent.match(/\d+[.,]\d+%?|\d{2,}/)?.[0] || 'N/A';
            
            const tooltipContent = `
              <div class="space-y-2">
                <div class="font-bold text-[#caff4e]">Valor: ${value}</div>
                <div class="text-[10px] opacity-80">Métrica clave de rendimiento</div>
                <div class="text-[9px] opacity-60 mt-1 pt-1 border-t border-[rgba(202,255,78,0.2)]">
                  Hover para más detalles
                </div>
              </div>
            `;
            
            activeTooltip = showTooltip(element, tooltipContent);
          });
          
          element.addEventListener('mouseleave', () => {
            element.style.opacity = '1';
            hideTooltip(activeTooltip);
            activeTooltip = null;
          });
        }
      });
    };

    // Enhance funnel stages
    const enhanceFunnels = () => {
      // Look for funnel-related elements
      const funnelElements = document.querySelectorAll('[class*="Funnel"], [class*="funnel"], [data-name*="Funnel"]');
      
      funnelElements.forEach((el) => {
        const element = el as HTMLElement;
        let activeTooltip: HTMLElement | null = null;
        
        element.style.cursor = 'help';
        element.style.transition = 'all 0.2s ease';
        
        element.addEventListener('mouseenter', () => {
          element.style.transform = 'translateX(2px)';
          
          const tooltipContent = `
            <div class="space-y-2">
              <div class="font-bold text-[#caff4e]">Etapa del Funnel</div>
              <div class="text-[10px] opacity-80">Conversión y drop-off</div>
              <div class="text-[9px] opacity-60 mt-1 pt-1 border-t border-[rgba(202,255,78,0.2)]">
                Click para análisis detallado
              </div>
            </div>
          `;
          
          activeTooltip = showTooltip(element, tooltipContent);
        });
        
        element.addEventListener('mouseleave', () => {
          element.style.transform = 'translateX(0)';
          hideTooltip(activeTooltip);
          activeTooltip = null;
        });
      });
    };

    // Run enhancements after a short delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      enhanceKPIs();
      enhanceFunnels();
    }, 500);

    return () => {
      clearTimeout(timeout);
      // Clean up any remaining tooltips
      document.querySelectorAll('.interactive-tooltip').forEach(el => el.remove());
    };
  }, []);

  return null; // This component doesn't render anything
}
