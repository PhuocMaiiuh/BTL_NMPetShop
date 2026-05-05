import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';

const iconMap = {
  success: <FiCheck size={18} />,
  error: <FiAlertCircle size={18} />,
  warning: <FiAlertCircle size={18} />,
  info: <FiInfo size={18} />,
};

const colorMap = {
  success: {
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    shadow: 'rgba(16, 185, 129, 0.3)',
  },
  error: {
    bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    shadow: 'rgba(239, 68, 68, 0.3)',
  },
  warning: {
    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: 'rgba(245, 158, 11, 0.3)',
  },
  info: {
    bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    shadow: 'rgba(59, 130, 246, 0.3)',
  },
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const colors = colorMap[toast.type] || colorMap.info;
        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              background: colors.bg,
              boxShadow: `0 8px 24px ${colors.shadow}`,
              animation: 'toastSlideIn 0.3s ease-out',
              minWidth: '280px',
              maxWidth: '420px',
            }}
          >
            <span style={{ flexShrink: 0, display: 'flex' }}>
              {iconMap[toast.type]}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                borderRadius: '6px',
                padding: '4px',
                display: 'flex',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            >
              <FiX size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(80px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
