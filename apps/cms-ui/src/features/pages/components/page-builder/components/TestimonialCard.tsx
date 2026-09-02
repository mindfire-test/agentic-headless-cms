import { forwardRef, useLayoutEffect } from 'react';
import {
  usePageBuilderStore,
  TESTIMONIAL_DEFAULTS,
} from '../stores/pageBuilderStore';

interface TestimonialCardProps {
  componentId: string;
}

const StarIcon = ({ filled, color }: { filled: boolean; color: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TestimonialCard = forwardRef<HTMLDivElement, TestimonialCardProps>(
  (props, ref) => {
    const id = props.componentId ?? 'default';
    const s = usePageBuilderStore(
      (state) => state.testimonial[id] ?? TESTIMONIAL_DEFAULTS,
    );

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const saved = el.getAttribute('data-pb-settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          usePageBuilderStore.getState().setTestimonial(id, parsed);
        } catch {
          /* ignore */
        }
      }
    }, [id]);

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      el?.setAttribute('data-pb-settings', JSON.stringify(s));
    });

    const initials = s.authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        ref={ref}
        id={id}
        data-pb-settings={JSON.stringify(s)}
        style={{
          backgroundColor: s.backgroundColor,
          padding: '40px 24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            borderRadius: `${s.borderRadius}px`,
            padding: '32px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Stars */}
          {s.showRating && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= s.rating}
                  color={s.starColor}
                />
              ))}
            </div>
          )}

          {/* Quote */}
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: s.quoteColor,
              margin: '0 0 24px',
              fontStyle: 'italic',
            }}
          >
            {s.quote}
          </p>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {s.authorImageUrl ? (
              <img
                src={s.authorImageUrl}
                alt={s.authorName}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#667eea',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <p
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: s.authorColor,
                  margin: 0,
                }}
              >
                {s.authorName}
              </p>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: s.roleColor,
                  margin: 0,
                }}
              >
                {s.authorRole}
                {s.authorCompany ? ` at ${s.authorCompany}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TestimonialCard.displayName = 'TestimonialCard';
export default TestimonialCard;
