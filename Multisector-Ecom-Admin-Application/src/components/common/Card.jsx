// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '' }) => (
  <div
    className={className}
    style={{
      background: '#fff', borderRadius: '14px', padding: '20px 22px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
  >
    {children}
  </div>
);

// ─── Card Header ──────────────────────────────────────────────────────────────
export const CardHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f5f5f5' }}>
    <div>
      <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.2px' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '3px', fontWeight: 500 }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ─── Card Body ────────────────────────────────────────────────────────────────
export const CardBody = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);
