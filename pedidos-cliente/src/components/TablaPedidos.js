import React, { useState } from 'react';
import { pedidosService } from '../services/pedidosService';
import { formatearFechaParaMostrar } from '../utils/dateUtils';

const TablaPedidos = ({ pedidos, onPedidoActualizado, onPedidoEliminado }) => {
  const [eliminandoId, setEliminandoId] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  const handleEstadoChange = async (pedido, nuevoEstado) => {
    if (!pedido.id || nuevoEstado === pedido.estado_pedido) return;

    setActualizandoId(pedido.id);

    try {
      const actualizacion = {
        id: pedido.id,
        estado_pedido: nuevoEstado,
        notas_pedido: pedido.notas_pedido || ''
      };

      await pedidosService.actualizarPedido(actualizacion);
      onPedidoActualizado('Pedido actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      onPedidoActualizado('Error al actualizar el pedido', 'error');
    } finally {
      setActualizandoId(null);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      setEliminandoId(id);

      try {
        await pedidosService.eliminarPedido(id);
        onPedidoEliminado('Pedido eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
        onPedidoEliminado('Error al eliminar el pedido', 'error');
      } finally {
        setEliminandoId(null);
      }
    }
  };

  const formatearTotal = (total) => {
    const numero = parseFloat(total);
    return isNaN(numero) ? total : numero.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  if (pedidos.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <i className="fas fa-inbox fa-3x mb-3"></i>
        <h5>No hay pedidos para mostrar</h5>
        <p>Los pedidos aparecerán aquí una vez que sean creados.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha Pedido</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Fecha Entrega</th>
            <th>Total</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id || Math.random()}>
              <td className="fw-bold">{pedido.numero_pedido}</td>
              <td>{formatearFechaParaMostrar(pedido.fecha_pedido)}</td>
              <td>
                <small className="text-muted">{pedido.cliente}</small>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <select
                    className="form-select form-select-sm"
                    value={pedido.estado_pedido}
                    onChange={(e) => handleEstadoChange(pedido, e.target.value)}
                    disabled={actualizandoId === pedido.id}
                    style={{ minWidth: '120px' }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Atrasado">Atrasado</option>
                  </select>
                  {actualizandoId === pedido.id && (
                    <div className="spinner-border spinner-border-sm ms-2" role="status">
                      <span className="visually-hidden">Actualizando...</span>
                    </div>
                  )}
                </div>
              </td>
              <td>{formatearFechaParaMostrar(pedido.fecha_entrega_estimada)}</td>
              <td className="fw-bold text-success">
                {formatearTotal(pedido.total_pedido)}
              </td>
              <td>
                <span title={pedido.notas_pedido || 'Sin notas'}>
                  {pedido.notas_pedido 
                    ? (pedido.notas_pedido.length > 30 
                       ? `${pedido.notas_pedido.substring(0, 30)}...` 
                       : pedido.notas_pedido)
                    : <em className="text-muted">Sin notas</em>
                  }
                </span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleEliminar(pedido.id)}
                  disabled={eliminandoId === pedido.id}
                  title="Eliminar pedido"
                >
                  {eliminandoId === pedido.id ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Eliminando...</span>
                    </div>
                  ) : (
                    <i className="fas fa-trash"></i>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPedidos;