import {
  usePageBuilderStore,
  FAQ_DEFAULTS,
  type FaqItem,
} from '../stores/pageBuilderStore';

interface FaqAccordionSettingsProps {
  targetComponentId: string;
}

export default function FaqAccordionSettings({
  targetComponentId,
}: FaqAccordionSettingsProps) {
  const s = usePageBuilderStore(
    (state) => state.faq[targetComponentId] ?? FAQ_DEFAULTS,
  );
  const set = usePageBuilderStore((state) => state.setFaq);
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

  const updateItem = (index: number, patch: Partial<FaqItem>) => {
    const newItems = [...s.items];
    newItems[index] = { ...newItems[index], ...patch } as FaqItem;
    u({ items: newItems });
  };

  const addItem = () => {
    if (s.items.length >= 10) return;
    u({
      items: [
        ...s.items,
        { question: 'New Question?', answer: 'Answer goes here.' },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (s.items.length <= 1) return;
    const newItems = s.items.filter((_, i) => i !== index);
    u({ items: newItems });
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
          placeholder="FAQ title"
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Subtitle</label>
        <input
          style={inputStyle}
          value={s.subtitle}
          onChange={(e) => u({ subtitle: e.target.value })}
          placeholder="FAQ subtitle"
        />
      </div>

      {/* FAQ Items */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <label style={labelStyle}>Questions ({s.items.length})</label>
          <button
            onClick={addItem}
            disabled={s.items.length >= 10}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              backgroundColor: '#667eea',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: s.items.length >= 10 ? 'not-allowed' : 'pointer',
              opacity: s.items.length >= 10 ? 0.5 : 1,
            }}
          >
            + Add
          </button>
        </div>

        {s.items.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#f7fafc',
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
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#4a5568',
                }}
              >
                Q{index + 1}
              </span>
              {s.items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
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

            <div style={sectionStyle}>
              <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                Question
              </label>
              <input
                style={inputStyle}
                value={item.question}
                onChange={(e) =>
                  updateItem(index, { question: e.target.value })
                }
                placeholder="Question?"
              />
            </div>

            <div style={sectionStyle}>
              <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                Answer
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                value={item.answer}
                onChange={(e) => updateItem(index, { answer: e.target.value })}
                placeholder="Answer..."
              />
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
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Active</label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.activeColor}
              onChange={(e) => u({ activeColor: e.target.value })}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
              Question
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
              value={s.questionColor}
              onChange={(e) => u({ questionColor: e.target.value })}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Border</label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.borderColor}
              onChange={(e) => u({ borderColor: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
