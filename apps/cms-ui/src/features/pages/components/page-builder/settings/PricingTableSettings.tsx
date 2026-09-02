import {
  usePageBuilderStore,
  PRICING_TABLE_DEFAULTS,
  type PricingPlan,
} from '../stores/pageBuilderStore';

interface PricingTableSettingsProps {
  targetComponentId: string;
}

export default function PricingTableSettings({
  targetComponentId,
}: PricingTableSettingsProps) {
  const s = usePageBuilderStore(
    (state) => state.pricingTable[targetComponentId] ?? PRICING_TABLE_DEFAULTS,
  );
  const set = usePageBuilderStore((state) => state.setPricingTable);
  const u = (patch: Partial<typeof s>) => set(targetComponentId, patch);

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#ffffff',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#4a5568',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const sectionStyle = {
    marginBottom: '16px',
  };

  const updatePlan = (index: number, patch: Partial<PricingPlan>) => {
    const newPlans = [...s.plans];
    newPlans[index] = { ...newPlans[index], ...patch } as PricingPlan;
    u({ plans: newPlans });
  };

  const updatePlanFeatures = (
    planIndex: number,
    featureIndex: number,
    value: string,
  ) => {
    const newPlans = [...s.plans];
    const plan = newPlans[planIndex];
    if (!plan) return;
    const newFeatures = [...plan.features];
    newFeatures[featureIndex] = value;
    newPlans[planIndex] = { ...plan, features: newFeatures };
    u({ plans: newPlans });
  };

  const addPlan = () => {
    if (s.plans.length >= 4) return;
    u({
      plans: [
        ...s.plans,
        {
          name: 'New Plan',
          price: '$19',
          period: '/month',
          features: ['Feature 1'],
          highlighted: false,
        },
      ],
    });
  };

  const removePlan = (index: number) => {
    if (s.plans.length <= 1) return;
    const newPlans = s.plans.filter((_, i) => i !== index);
    u({ plans: newPlans });
  };

  const addFeatureToPlan = (planIndex: number) => {
    const newPlans = [...s.plans];
    const plan = newPlans[planIndex];
    if (!plan) return;
    newPlans[planIndex] = {
      ...plan,
      features: [...plan.features, 'New Feature'],
    };
    u({ plans: newPlans });
  };

  const removeFeatureFromPlan = (planIndex: number, featureIndex: number) => {
    const newPlans = [...s.plans];
    const plan = newPlans[planIndex];
    if (!plan) return;
    newPlans[planIndex] = {
      ...plan,
      features: plan.features.filter((_, i) => i !== featureIndex),
    };
    u({ plans: newPlans });
  };

  return (
    <div
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={sectionStyle}>
        <label style={labelStyle}>Section Title</label>
        <input
          style={inputStyle}
          value={s.title}
          onChange={(e) => u({ title: e.target.value })}
          placeholder="Pricing title"
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Subtitle</label>
        <input
          style={inputStyle}
          value={s.subtitle}
          onChange={(e) => u({ subtitle: e.target.value })}
          placeholder="Pricing subtitle"
        />
      </div>

      {/* Plans */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <label style={labelStyle}>Plans ({s.plans.length})</label>
          <button
            onClick={addPlan}
            disabled={s.plans.length >= 4}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              backgroundColor: '#667eea',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: s.plans.length >= 4 ? 'not-allowed' : 'pointer',
              opacity: s.plans.length >= 4 ? 0.5 : 1,
            }}
          >
            + Add Plan
          </button>
        </div>

        {s.plans.map((plan, planIndex) => (
          <div
            key={planIndex}
            style={{
              border: plan.highlighted
                ? '2px solid #667eea'
                : '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: plan.highlighted ? '#f7fafc' : '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  ...labelStyle,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <input
                  type="checkbox"
                  checked={plan.highlighted}
                  onChange={(e) =>
                    updatePlan(planIndex, { highlighted: e.target.checked })
                  }
                />
                Highlighted
              </label>
              {s.plans.length > 1 && (
                <button
                  onClick={() => removePlan(planIndex)}
                  style={{
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    backgroundColor: '#fed7d7',
                    color: '#c53030',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                  Name
                </label>
                <input
                  style={inputStyle}
                  value={plan.name}
                  onChange={(e) =>
                    updatePlan(planIndex, { name: e.target.value })
                  }
                  placeholder="Plan name"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                  Price
                </label>
                <input
                  style={inputStyle}
                  value={plan.price}
                  onChange={(e) =>
                    updatePlan(planIndex, { price: e.target.value })
                  }
                  placeholder="$29"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                  Period
                </label>
                <input
                  style={inputStyle}
                  value={plan.period}
                  onChange={(e) =>
                    updatePlan(planIndex, { period: e.target.value })
                  }
                  placeholder="/month"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}
              >
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                  Features
                </label>
                <button
                  onClick={() => addFeatureToPlan(planIndex)}
                  style={{
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  + Feature
                </button>
              </div>
              {plan.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}
                >
                  <input
                    style={{ ...inputStyle, flex: 1, fontSize: '0.8rem' }}
                    value={feature}
                    onChange={(e) =>
                      updatePlanFeatures(
                        planIndex,
                        featureIndex,
                        e.target.value,
                      )
                    }
                    placeholder="Feature"
                  />
                  {plan.features.length > 1 && (
                    <button
                      onClick={() =>
                        removeFeatureFromPlan(planIndex, featureIndex)
                      }
                      style={{
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        backgroundColor: '#fed7d7',
                        color: '#c53030',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Colors */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
        <label style={labelStyle}>Colors</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          <div>
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
              Background
            </label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.backgroundColor}
              onChange={(e) => u({ backgroundColor: e.target.value })}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
              Highlight
            </label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.highlightedPlanColor}
              onChange={(e) => u({ highlightedPlanColor: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Card Radius: {s.cardBorderRadius}px</label>
        <input
          type="range"
          min={0}
          max={32}
          value={s.cardBorderRadius}
          onChange={(e) => u({ cardBorderRadius: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
