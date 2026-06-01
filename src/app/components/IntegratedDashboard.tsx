import React, { useState, useRef, useCallback } from 'react';
import { TooltipProvider } from './TooltipProvider';
import { InteractivityEnhancer } from './InteractivityEnhancer';
import { HelpOverlay } from './HelpOverlay';
import './InteractiveStyles.css';
import Frame from '../../imports/Frame/Frame';
import Frame2 from '../../imports/Frame2/Frame2';
import Frame3 from '../../imports/Frame3/Frame3';

type Flow = 'F1' | 'F2' | 'F3';

interface SectionDef {
  label: string;
  searchText: string;
}

const FLOW_SECTIONS: Record<Flow, SectionDef[]> = {
  F1: [
    { label: 'KPIs',            searchText: 'KPIs' },
    { label: 'Funnel',          searchText: 'Funnel de' },
    { label: 'Funcionamiento',  searchText: 'Funcionamiento' },
    { label: 'Cruces internos', searchText: 'Cruces internos' },
    { label: 'Cruce externo',   searchText: 'Cruce externo' },
  ],
  F2: [
    { label: 'KPIs',         searchText: 'KPIs' },
    { label: 'Funnel',       searchText: 'Funnel de' },
    { label: 'Adopción',     searchText: 'adopción' },
    { label: 'Fricción',     searchText: 'fricción' },
    { label: 'Cruces',       searchText: 'Cruces entre' },
    { label: 'Intervención', searchText: 'Intervención' },
  ],
  F3: [
    { label: 'KPIs',         searchText: 'KPIs' },
    { label: 'Funnel',       searchText: 'Funnel de' },
    { label: 'Adopción',     searchText: 'adopción' },
    { label: 'Fricción',     searchText: 'fricción' },
    { label: 'Cruces',       searchText: 'Cruces entre' },
    { label: 'Intervención', searchText: 'Intervención' },
  ],
};

function findAndScroll(scrollContainer: HTMLElement, searchText: string): boolean {
  const containerRect = scrollContainer.getBoundingClientRect();

  // Primary: look for Playfair Display Bold headings (section titles in main content)
  const headings = scrollContainer.querySelectorAll<HTMLElement>('[class*="Playfair_Display:Bold"]');
  for (const heading of headings) {
    const text = heading.textContent || '';
    if (text.toLowerCase().includes(searchText.toLowerCase())) {
      const rect = heading.getBoundingClientRect();
      // Skip elements that belong to the original frame sidebar (off-screen to the left)
      if (rect.right < containerRect.left + 30) continue;
      const scrollTop = scrollContainer.scrollTop + rect.top - containerRect.top - 56;
      scrollContainer.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
      return true;
    }
  }

  // Fallback: broad text search across all elements
  const walker = document.createTreeWalker(scrollContainer, NodeFilter.SHOW_TEXT, null);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim() || '';
    if (text.toLowerCase().includes(searchText.toLowerCase())) {
      const el = node.parentElement;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.right < containerRect.left + 30) continue;
      const scrollTop = scrollContainer.scrollTop + rect.top - containerRect.top - 56;
      scrollContainer.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
      return true;
    }
  }

  return false;
}

export function IntegratedDashboard() {
  const [activeFlow, setActiveFlow] = useState<Flow>('F1');
  const [activeSection, setActiveSection] = useState<string>('KPIs');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFlowChange = useCallback((flow: Flow) => {
    setActiveFlow(flow);
    setActiveSection('KPIs');
    // Scroll to top when switching flows
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSectionClick = useCallback((section: SectionDef) => {
    setActiveSection(section.label);
    if (scrollRef.current) {
      findAndScroll(scrollRef.current, section.searchText);
    }
  }, []);

  return (
    <TooltipProvider>
      <div
        className="flex relative overflow-hidden"
        style={{
          height: '100vh',
          width: '100vw',
          backgroundImage: 'linear-gradient(90deg, rgb(240, 242, 238) 0%, rgb(240, 242, 238) 100%)',
        }}
      >
        {/* Unified Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 z-50">
          <Sidebar
            activeFlow={activeFlow}
            activeSection={activeSection}
            sections={FLOW_SECTIONS[activeFlow]}
            onFlowChange={handleFlowChange}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Scrollable main content */}
        <div
          ref={scrollRef}
          className="overflow-y-auto overflow-x-hidden bg-white"
          style={{ marginLeft: 196, flex: 1, height: '100vh' }}
        >
          <div key={activeFlow} className="animate-fade-in">
            {activeFlow === 'F1' && <FrameWrapper height={1756}><Frame /></FrameWrapper>}
            {activeFlow === 'F2' && <FrameWrapper height={2640}><Frame2 /></FrameWrapper>}
            {activeFlow === 'F3' && <FrameWrapper height={2968}><Frame3 /></FrameWrapper>}
          </div>
        </div>

        <InteractivityEnhancer key={activeFlow} />
        <HelpOverlay />
      </div>
    </TooltipProvider>
  );
}

// ─── Frame content wrapper ─────────────────────────────────────────────────

function FrameWrapper({ children, height }: { children: React.ReactNode; height: number }) {
  // Shift left 196px to hide the embedded sidebar of each Figma frame.
  // Explicit height so the frame's size-full resolves to the correct pixel height.
  return (
    <div style={{ marginLeft: -196, width: 'calc(100% + 196px)', height }}>
      {children}
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────

interface SidebarProps {
  activeFlow: Flow;
  activeSection: string;
  sections: SectionDef[];
  onFlowChange: (flow: Flow) => void;
  onSectionClick: (section: SectionDef) => void;
}

function Sidebar({ activeFlow, activeSection, sections, onFlowChange, onSectionClick }: SidebarProps) {
  const flows: { id: Flow; label: string }[] = [
    { id: 'F1', label: 'F1 · Reviews' },
    { id: 'F2', label: 'F2 · Clubes' },
    { id: 'F3', label: 'F3 · TV Shows' },
  ];

  return (
    <div className="bg-[#051e18] relative shrink-0 w-[196px] flex flex-col overflow-hidden" style={{ height: '100vh' }}>
      <div aria-hidden className="absolute border-[rgba(202,255,78,0.12)] border-r border-solid inset-0 pointer-events-none" />

      <div className="flex flex-col items-start flex-1 overflow-y-auto pr-px">
        {/* Header */}
        <div className="relative shrink-0 w-full">
          <div aria-hidden className="absolute border-[rgba(202,255,78,0.12)] border-b border-solid inset-0 pointer-events-none" />
          <div className="flex flex-col gap-[2px] items-start pb-[17px] pt-[20px] px-[18px]">
            <div className="[word-break:break-word] font-['Playfair_Display:Black',sans-serif] font-black text-[#caff4e] text-[19px] tracking-[-0.3px] leading-normal">
              fable
            </div>
            <div
              className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal text-[8.5px] text-white tracking-[1.53px] uppercase leading-normal"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Analytics · TP3
            </div>
          </div>
        </div>

        {/* Flujos label */}
        <div className="relative shrink-0 w-full">
          <div
            className="[word-break:break-word] font-['DM_Sans:Bold',sans-serif] font-bold text-[8px] text-white tracking-[1.44px] uppercase leading-normal pb-[6px] pt-[16px] px-[18px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Flujos
          </div>
        </div>

        {/* Flow buttons */}
        {flows.map(({ id, label }) => (
          <FlowButton
            key={id}
            label={label}
            active={activeFlow === id}
            onClick={() => onFlowChange(id)}
          />
        ))}

        {/* Secciones label */}
        <div className="relative shrink-0 w-full mt-2">
          <div
            className="[word-break:break-word] font-['DM_Sans:Bold',sans-serif] font-bold text-[8px] text-white tracking-[1.44px] uppercase leading-normal pb-[6px] pt-[16px] px-[18px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Secciones
          </div>
        </div>

        {/* Section links */}
        {sections.map((section) => (
          <SectionLink
            key={section.label}
            label={section.label}
            active={activeSection === section.label}
            onClick={() => onSectionClick(section)}
          />
        ))}

        {/* Color semantics — directly below sections */}
        <div className="relative shrink-0 w-full mt-2">
          <div aria-hidden className="absolute border-[rgba(202,255,78,0.12)] border-t border-solid inset-0 pointer-events-none" />
          <div className="flex flex-col gap-[7px] pb-[14px] pt-[15px] px-[18px]">
            <div
              className="[word-break:break-word] font-['DM_Sans:Bold',sans-serif] font-bold text-[8px] text-[rgba(255,255,255,0.18)] tracking-[1.28px] uppercase leading-normal pb-[2px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Semántica del color
            </div>
            {[
              { color: '#1a7a4a', label: 'Positivo · en umbral' },
              { color: '#c47c00', label: 'Requiere atención' },
              { color: '#c43030', label: 'Crítico · fuera de umbral' },
              { color: '#2a6abf', label: 'Neutral · informativo' },
            ].map(({ color, label }) => (
              <div key={label} className="flex gap-[7px] items-center">
                <div className="rounded-[2px] shrink-0 size-[9px]" style={{ backgroundColor: color }} />
                <div
                  className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal text-[10.5px] text-[rgba(255,255,255,0.4)] whitespace-nowrap leading-normal"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${active ? 'bg-[rgba(202,255,78,0.06)]' : ''} relative shrink-0 w-full cursor-pointer transition-colors hover:bg-[rgba(202,255,78,0.03)] text-left`}
    >
      <div
        aria-hidden
        className={`absolute ${active ? 'border-[#caff4e]' : 'border-[rgba(0,0,0,0)]'} border-l-2 border-solid inset-0 pointer-events-none`}
      />
      <div className="flex items-center gap-[8px] pl-[20px] pr-[18px] py-[8px]">
        <div className={`${active ? 'bg-[#caff4e]' : 'bg-white opacity-50'} rounded-[2.5px] shrink-0 size-[5px]`} />
        <div
          className={`[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium text-[12px] whitespace-nowrap leading-normal ${active ? 'text-[#caff4e]' : 'text-white'}`}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {label}
        </div>
      </div>
    </button>
  );
}

function SectionLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${active ? 'bg-[rgba(202,255,78,0.04)]' : ''} relative shrink-0 w-full cursor-pointer transition-colors hover:bg-[rgba(202,255,78,0.03)] text-left`}
    >
      <div
        aria-hidden
        className={`absolute ${active ? 'border-[rgba(202,255,78,0.5)]' : 'border-[rgba(0,0,0,0)]'} border-l-2 border-solid inset-0 pointer-events-none`}
      />
      <div className="flex items-center gap-[8px] pl-[20px] pr-[18px] py-[8px]">
        <div className={`${active ? 'bg-[#caff4e] opacity-60' : 'bg-white opacity-30'} rounded-[2.5px] shrink-0 size-[5px]`} />
        <div
          className={`[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium text-[12px] whitespace-nowrap leading-normal ${active ? 'text-[rgba(202,255,78,0.9)]' : 'text-[rgba(255,255,255,0.6)]'}`}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {label}
        </div>
      </div>
    </button>
  );
}
