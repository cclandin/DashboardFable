import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface TooltipData {
  content: React.ReactNode;
  x: number;
  y: number;
}

interface TooltipContextType {
  showTooltip: (content: React.ReactNode, x: number, y: number) => void;
  hideTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const showTooltip = (content: React.ReactNode, x: number, y: number) => {
    setTooltip({ content, x, y });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none tooltip-container"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -120%)',
          }}
        >
          <div className="bg-[#051e18] text-white px-4 py-3 rounded-lg shadow-2xl border border-[rgba(202,255,78,0.3)] max-w-[340px]">
            <div className="text-[11px] leading-relaxed font-['DM_Sans:Regular',sans-serif]" style={{ fontVariationSettings: "'opsz' 14" }}>
              {tooltip.content}
            </div>
          </div>
          {/* Arrow */}
          <div
            className="absolute left-1/2 bottom-0 w-0 h-0"
            style={{
              transform: 'translate(-50%, 100%)',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #051e18',
            }}
          />
        </div>
      )}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within TooltipProvider');
  }
  return context;
}

// Enhanced Interactive Wrapper Component for KPIs, Charts, etc.
export function InteractiveElement({
  children,
  tooltipContent,
  className = '',
}: {
  children: ReactNode;
  tooltipContent: React.ReactNode;
  className?: string;
}) {
  const { showTooltip, hideTooltip } = useTooltip();

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    showTooltip(tooltipContent, rect.left + rect.width / 2, rect.top);
  };

  return (
    <div
      className={`relative cursor-help transition-opacity hover:opacity-90 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hideTooltip}
    >
      {children}
    </div>
  );
}