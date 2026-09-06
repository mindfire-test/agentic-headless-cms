import { forwardRef, useLayoutEffect } from 'react';
import {
  usePageBuilderStore,
  PRICING_TABLE_DEFAULTS,
} from '../stores/pageBuilderStore';

interface PricingTableProps {
  componentId: string;
}

const PricingTable = forwardRef<HTMLDivElement, PricingTableProps>(
  (props, ref) => {
    const id = props.componentId ?? 'default';
    const s = usePageBuilderStore(
      (state) => state.pricingTable[id] ?? PRICING_TABLE_DEFAULTS,
    );

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const saved = el.getAttribute('data-pb-settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          usePageBuilderStore.getState().setPricingTable(id, parsed);
        } catch {
          /* ignore */
        }
      }
    }, [id]);

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      el?.setAttribute('data-pb-settings', JSON.stringify(s));
    });

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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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

          {/* Plans */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${s.plans.length}, 1fr)`,
              gap: '24px',
              alignItems: 'start',
            }}
          >
            {s.plans.map((plan, index) => (
              <div
                key={index}
                style={{
                  border: plan.highlighted
                    ? `2px solid ${s.highlightedPlanColor}`
                    : '1px solid #e2e8f0',
                  borderRadius: `${s.cardBorderRadius}px`,
                  padding: '32px 24px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: plan.highlighted
                    ? '0 8px 32px rgba(102, 126, 234, 0.2)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {plan.highlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: s.highlightedPlanColor,
                      color: '#ffffff',
                      padding: '4px 16px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: s.titleColor,
                    margin: '0 0 8px',
                  }}
                >
                  {plan.name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px',
                    marginBottom: '24px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: plan.highlighted
                        ? s.highlightedPlanColor
                        : s.titleColor,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{ fontSize: '0.875rem', color: s.subtitleColor }}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px',
                  }}
                >
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      style={{
                        padding: '8px 0',
                        borderBottom:
                          fIndex < plan.features.length - 1
                            ? '1px solid #f0f0f0'
                            : 'none',
                        fontSize: '0.9375rem',
                        color: '#4a5568',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#48bb78', fontWeight: 600 }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: plan.highlighted
                      ? s.highlightedPlanColor
                      : 'transparent',
                    color: plan.highlighted
                      ? '#ffffff'
                      : s.highlightedPlanColor,
                    border: plan.highlighted
                      ? 'none'
                      : `2px solid ${s.highlightedPlanColor}`,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.highlighted) {
                      e.currentTarget.style.backgroundColor =
                        s.highlightedPlanColor;
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.highlighted) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = s.highlightedPlanColor;
                    }
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

PricingTable.displayName = 'PricingTable';
export default PricingTable;
