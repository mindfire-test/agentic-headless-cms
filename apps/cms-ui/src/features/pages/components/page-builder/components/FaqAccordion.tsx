import { forwardRef, useState, useLayoutEffect } from 'react';
import { usePageBuilderStore, FAQ_DEFAULTS } from '../stores/pageBuilderStore';

interface FaqAccordionProps {
  componentId: string;
}

const FaqAccordion = forwardRef<HTMLDivElement, FaqAccordionProps>(
  (props, ref) => {
    const id = props.componentId ?? 'default';
    const s = usePageBuilderStore((state) => state.faq[id] ?? FAQ_DEFAULTS);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const saved = el.getAttribute('data-pb-settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          usePageBuilderStore.getState().setFaq(id, parsed);
        } catch {
          /* ignore */
        }
      }
    }, [id]);

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      el?.setAttribute('data-pb-settings', JSON.stringify(s));
    });

    const toggleItem = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div
        ref={ref}
        id={id}
        data-pb-settings={JSON.stringify(s)}
        style={{
          backgroundColor: s.backgroundColor,
          padding: '64px 24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: s.titleColor,
                margin: '0 0 12px',
              }}
            >
              {s.title}
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: s.subtitleColor,
                margin: 0,
              }}
            >
              {s.subtitle}
            </p>
          </div>

          {/* Accordion */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {s.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  style={{
                    border: `1px solid ${isOpen ? s.activeColor : s.borderColor}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: isOpen
                        ? `${s.activeColor}08`
                        : '#ffffff',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: isOpen ? s.activeColor : s.questionColor,
                      }}
                    >
                      {item.question}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isOpen ? s.activeColor : '#a0aec0'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease',
                    }}
                  >
                    <p
                      style={{
                        padding: '0 20px 16px',
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        color: s.answerColor,
                        margin: 0,
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

FaqAccordion.displayName = 'FaqAccordion';
export default FaqAccordion;
