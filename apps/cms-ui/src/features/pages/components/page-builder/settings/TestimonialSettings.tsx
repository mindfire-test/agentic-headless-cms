import {
  usePageBuilderStore,
  TESTIMONIAL_DEFAULTS,
} from '../stores/pageBuilderStore';

interface TestimonialSettingsProps {
  targetComponentId: string;
}

export default function TestimonialSettings({
  targetComponentId,
}: TestimonialSettingsProps) {
  const s = usePageBuilderStore(
    (state) => state.testimonial[targetComponentId] ?? TESTIMONIAL_DEFAULTS,
  );
  const set = usePageBuilderStore((state) => state.setTestimonial);
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
        <label style={labelStyle}>Quote</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={s.quote}
          onChange={(e) => u({ quote: e.target.value })}
          placeholder="What they said..."
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Author Name</label>
        <input
          style={inputStyle}
          value={s.authorName}
          onChange={(e) => u({ authorName: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}
      >
        <div style={sectionStyle}>
          <label style={labelStyle}>Role</label>
          <input
            style={inputStyle}
            value={s.authorRole}
            onChange={(e) => u({ authorRole: e.target.value })}
            placeholder="CEO"
          />
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle}>Company</label>
          <input
            style={inputStyle}
            value={s.authorCompany}
            onChange={(e) => u({ authorCompany: e.target.value })}
            placeholder="Tech Corp"
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Author Image URL</label>
        <input
          style={inputStyle}
          value={s.authorImageUrl}
          onChange={(e) => u({ authorImageUrl: e.target.value })}
          placeholder="https://... (optional)"
        />
      </div>

      <div
        style={{
          ...sectionStyle,
          borderTop: '1px solid #e2e8f0',
          paddingTop: '12px',
        }}
      >
        <label
          style={{
            ...labelStyle,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <input
            type="checkbox"
            checked={s.showRating}
            onChange={(e) => u({ showRating: e.target.checked })}
          />
          Show Rating Stars
        </label>
      </div>

      {s.showRating && (
        <div style={sectionStyle}>
          <label style={labelStyle}>Rating: {s.rating} / 5</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => u({ rating: star as 1 | 2 | 3 | 4 | 5 })}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: star <= s.rating ? '#f6ad55' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}

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
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Quote</label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.quoteColor}
              onChange={(e) => u({ quoteColor: e.target.value })}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Author</label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.authorColor}
              onChange={(e) => u({ authorColor: e.target.value })}
            />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Stars</label>
            <input
              type="color"
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              value={s.starColor}
              onChange={(e) => u({ starColor: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Border Radius: {s.borderRadius}px</label>
        <input
          type="range"
          min={0}
          max={32}
          value={s.borderRadius}
          onChange={(e) => u({ borderRadius: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
