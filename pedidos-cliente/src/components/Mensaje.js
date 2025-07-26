import React from 'react';

const Mensaje = ({ mensaje, tipo, onClose }) => {
  if (!mensaje) return null;

  const alertClass = tipo === 'success' ? 'alert-success' : 'alert-danger';

  return (
    <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
      {mensaje}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close">
        </button>
      )}
    </div>
  );
};

export default Mensaje;