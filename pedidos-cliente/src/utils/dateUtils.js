// Formatear fecha para enviar al backend (dd-mm-yyyy)
export const formatearFechaParaBackend = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Formatear fecha para mostrar en el frontend
export const formatearFechaParaMostrar = (fecha) => {
  if (!fecha) return '';
  
  // Si la fecha viene en formato dd-mm-yyyy del backend
  if (fecha.includes('-') && fecha.split('-')[0].length === 2) {
    const [day, month, year] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }
  
  // Si la fecha viene en formato ISO
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return fecha;
  
  return date.toLocaleDateString('es-ES');
};

// Convertir fecha del backend a formato input date (yyyy-mm-dd)
export const fechaBackendAInputDate = (fecha) => {
  if (!fecha) return '';
  
  // Si viene en formato dd-mm-yyyy
  if (fecha.includes('-') && fecha.split('-')[0].length === 2) {
    const [day, month, year] = fecha.split('-');
    return `${year}-${month}-${day}`;
  }
  
  // Si viene en formato ISO, extraer solo la fecha
  if (fecha.includes('T')) {
    return fecha.split('T')[0];
  }
  
  return fecha;
};