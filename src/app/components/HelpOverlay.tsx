import { useState, useEffect } from 'react';

export function HelpOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for '?' key to toggle help
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' || e.key === 'h') {
        setIsVisible((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-[100] bg-[#051e18] text-[#caff4e] w-10 h-10 rounded-full shadow-2xl border border-[rgba(202,255,78,0.3)] hover:bg-[#0a3020] transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Show help"
      >
        <span className="text-lg font-['DM_Sans:Bold',sans-serif]" style={{ fontVariationSettings: "'opsz' 14" }}>
          ?
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#051e18] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-['Playfair_Display:Black',sans-serif] text-[#caff4e]">
              Guía Interactiva
            </h2>
            <p className="text-[11px] font-['DM_Sans:Regular',sans-serif] text-white/70 mt-1" style={{ fontVariationSettings: "'opsz' 14" }}>
              Explora todas las funciones disponibles
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-[#caff4e] transition-colors"
            aria-label="Close help"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Navigation Section */}
          <section>
            <h3 className="text-sm font-['DM_Sans:Bold',sans-serif] text-[#051e18] mb-3 flex items-center gap-2" style={{ fontVariationSettings: "'opsz' 14" }}>
              <div className="w-1 h-4 bg-[#caff4e] rounded-full" />
              Navegación de Flujos
            </h3>
            <div className="space-y-2 ml-3">
              <FeatureItem
                icon="📊"
                title="F1 · Reviews"
                description="Análisis del flujo de reviews de libros - adopción y fricción"
              />
              <FeatureItem
                icon="👥"
                title="F2 · Clubes"
                description="Análisis de ingreso en detalle a clubes de lectura"
              />
              <FeatureItem
                icon="📺"
                title="F3 · TV Shows"
                description="Análisis de descubrimiento de contenido en TV News"
              />
            </div>
          </section>

          {/* Interactive Features */}
          <section>
            <h3 className="text-sm font-['DM_Sans:Bold',sans-serif] text-[#051e18] mb-3 flex items-center gap-2" style={{ fontVariationSettings: "'opsz' 14" }}>
              <div className="w-1 h-4 bg-[#caff4e] rounded-full" />
              Funciones Interactivas
            </h3>
            <div className="space-y-2 ml-3">
              <FeatureItem
                icon="💡"
                title="Tooltips en KPIs"
                description="Pasa el cursor sobre cualquier métrica para ver detalles: valor absoluto, fórmula y notas metodológicas"
              />
              <FeatureItem
                icon="🎯"
                title="Etapas de Funnel"
                description="Hover sobre las etapas del funnel para ver conversiones, drop-off y análisis de caída"
              />
              <FeatureItem
                icon="📈"
                title="Gráficos Interactivos"
                description="Los elementos de gráficos responden al hover con información contextual"
              />
              <FeatureItem
                icon="🔄"
                title="Selectores de Segmento"
                description="Alterna entre usuarios activos y ex-usuarios para comparar comportamientos"
              />
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-sm font-['DM_Sans:Bold',sans-serif] text-[#051e18] mb-3 flex items-center gap-2" style={{ fontVariationSettings: "'opsz' 14" }}>
              <div className="w-1 h-4 bg-[#caff4e] rounded-full" />
              Atajos de Teclado
            </h3>
            <div className="space-y-2 ml-3">
              <ShortcutItem shortcut="?" description="Mostrar/ocultar esta ayuda" />
              <ShortcutItem shortcut="ESC" description="Cerrar esta ventana" />
            </div>
          </section>

          {/* Tips */}
          <section className="bg-[#caff4e]/10 rounded-lg p-4 border border-[#caff4e]/30">
            <h3 className="text-sm font-['DM_Sans:Bold',sans-serif] text-[#051e18] mb-2" style={{ fontVariationSettings: "'opsz' 14" }}>
              💡 Consejos Útiles
            </h3>
            <ul className="space-y-1.5 text-[11px] font-['DM_Sans:Regular',sans-serif] text-gray-700" style={{ fontVariationSettings: "'opsz' 14" }}>
              <li>• Las transiciones entre flujos son instantáneas para una navegación fluida</li>
              <li>• Los tooltips aparecen automáticamente al pasar el cursor sobre elementos clave</li>
              <li>• El header sticky muestra siempre el flujo activo actual</li>
              <li>• Scroll suave implementado en todas las áreas de contenido</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <p className="text-[10px] font-['DM_Sans:Regular',sans-serif] text-gray-500 text-center" style={{ fontVariationSettings: "'opsz' 14" }}>
            Dashboard de Analytics Fable · TP3 · Versión 1.0
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <h4 className="text-[12px] font-['DM_Sans:Medium',sans-serif] text-[#051e18]" style={{ fontVariationSettings: "'opsz' 14" }}>
          {title}
        </h4>
        <p className="text-[11px] font-['DM_Sans:Regular',sans-serif] text-gray-600 mt-0.5" style={{ fontVariationSettings: "'opsz' 14" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function ShortcutItem({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex items-center gap-3">
      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[11px] font-['DM_Sans:Medium',sans-serif] text-gray-700 min-w-[40px] text-center" style={{ fontVariationSettings: "'opsz' 14" }}>
        {shortcut}
      </kbd>
      <span className="text-[11px] font-['DM_Sans:Regular',sans-serif] text-gray-600" style={{ fontVariationSettings: "'opsz' 14" }}>
        {description}
      </span>
    </div>
  );
}
