import { FaPlus, FaSave, FaTimes, FaEdit, FaTrash, FaEye, FaFilter, FaEraser } from 'react-icons/fa';

// ─── Base style helper ────────────────────────────────────────────────────────
const btn = (bg, color, border, hoverBg, hoverColor, shadow) => ({
  base: { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 20px', fontSize: '13.5px', fontWeight: 600, borderRadius: '9px', border: `1.5px solid ${border}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s', background: bg, color, ...(shadow ? { boxShadow: shadow } : {}) },
  hover: { background: hoverBg, color: hoverColor },
});

// ─── Primary ──────────────────────────────────────────────────────────────────
export const PrimaryButton = ({ children, onClick, disabled, type = 'button' }) => {
  const s = btn(
    'linear-gradient(135deg,#ec4899,#db2777)', '#fff', 'transparent',
    'linear-gradient(135deg,#db2777,#be185d)', '#fff',
    '0 3px 12px rgba(236,72,153,0.28)'
  );
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{ ...s.base, ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
      onMouseEnter={e => { if (!disabled) Object.assign(e.currentTarget.style, { ...s.hover, transform: 'translateY(-1px)', boxShadow: '0 5px 18px rgba(236,72,153,0.38)' }); }}
      onMouseLeave={e => { if (!disabled) Object.assign(e.currentTarget.style, { background: s.base.background, color: s.base.color, transform: 'translateY(0)', boxShadow: s.base.boxShadow }); }}
    >
      {children}
    </button>
  );
};

// ─── Secondary ────────────────────────────────────────────────────────────────
export const SecondaryButton = ({ children, onClick, disabled, type = 'button' }) => {
  const s = btn('#fff', '#ec4899', '#fce7f3', '#fdf2f8', '#db2777', 'none');
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{ ...s.base, ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
      onMouseEnter={e => { if (!disabled) Object.assign(e.currentTarget.style, s.hover); }}
      onMouseLeave={e => { if (!disabled) Object.assign(e.currentTarget.style, { background: s.base.background, color: s.base.color }); }}
    >
      {children}
    </button>
  );
};

// ─── Danger ───────────────────────────────────────────────────────────────────
export const DangerButton = ({ children, onClick, disabled, type = 'button' }) => {
  const s = btn(
    'linear-gradient(135deg,#ef4444,#dc2626)', '#fff', 'transparent',
    'linear-gradient(135deg,#dc2626,#b91c1c)', '#fff',
    '0 3px 12px rgba(239,68,68,0.28)'
  );
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{ ...s.base, ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
      onMouseEnter={e => { if (!disabled) Object.assign(e.currentTarget.style, { ...s.hover, transform: 'translateY(-1px)', boxShadow: '0 5px 18px rgba(239,68,68,0.38)' }); }}
      onMouseLeave={e => { if (!disabled) Object.assign(e.currentTarget.style, { background: s.base.background, color: s.base.color, transform: 'translateY(0)', boxShadow: s.base.boxShadow }); }}
    >
      {children}
    </button>
  );
};

// ─── Icon Button ──────────────────────────────────────────────────────────────
export const IconButton = ({ onClick, icon, variant = 'view', title }) => {
  const variants = {
    view:   { bg: '#eff6ff', color: '#2563eb', hoverBg: '#dbeafe', border: '#bfdbfe' },
    edit:   { bg: '#f0fdf4', color: '#16a34a', hoverBg: '#dcfce7', border: '#bbf7d0' },
    delete: { bg: '#fef2f2', color: '#ef4444', hoverBg: '#fee2e2', border: '#fecaca' },
  };
  const v = variants[variant] || variants.view;

  return (
    <button
      onClick={onClick} title={title}
      style={{
        width: '32px', height: '32px', borderRadius: '8px',
        border: `1.5px solid ${v.border}`, background: v.bg,
        color: v.color, cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', transition: 'all 0.18s', flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = v.hoverBg; e.currentTarget.style.transform = 'scale(1.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = v.bg; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
    </button>
  );
};

// ─── Action Buttons ───────────────────────────────────────────────────────────
export const ActionButtons = ({ onView, onEdit, onDelete }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
    {onView   && <IconButton onClick={onView}   icon={<FaEye   style={{ fontSize: '12px' }} />} variant="view"   title="View" />}
    {onEdit   && <IconButton onClick={onEdit}   icon={<FaEdit  style={{ fontSize: '12px' }} />} variant="edit"   title="Edit" />}
    {onDelete && <IconButton onClick={onDelete} icon={<FaTrash style={{ fontSize: '12px' }} />} variant="delete" title="Delete" />}
  </div>
);

// ─── Button Icons ─────────────────────────────────────────────────────────────
export const ButtonIcons = {
  Add:    <FaPlus    style={{ fontSize: '11px' }} />,
  Save:   <FaSave    style={{ fontSize: '12px' }} />,
  Cancel: <FaTimes   style={{ fontSize: '12px' }} />,
  Edit:   <FaEdit    style={{ fontSize: '12px' }} />,
  Delete: <FaTrash   style={{ fontSize: '12px' }} />,
  View:   <FaEye     style={{ fontSize: '12px' }} />,
  Filter: <FaFilter  style={{ fontSize: '11px' }} />,
  Clear:  <FaEraser  style={{ fontSize: '11px' }} />,
};
