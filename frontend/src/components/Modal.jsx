import { useEffect } from 'react';

// Centered dialog. Closes on Esc or when the dark backdrop is clicked.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-label={title}>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
