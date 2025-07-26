import React, { useState, useEffect, useCallback } from 'react';
import { pedidosService } from './services/pedidosService';
import FormularioPedido from './components/FormularioPedido';
import TablaPedidos from './components/TablaPedidos';
import Mensaje from './components/Mensaje';
import './App.css';

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarSoloPendientes, setMostrarSoloPendientes] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  // Función para mostrar mensajes
  const mostrarMensaje = useCallback((texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 5000);
  }, []);

  // Cargar todos los pedidos
  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pedidosService.getPedidos();
      setPedidos(data || []);
    } catch (error) {
      mostrarMensaje('Error al cargar los pedidos', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  // Cargar pedidos pendientes
  const cargarPedidosPendientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pedidosService.getPedidosPendientes();
      setPedidos(data || []);
    } catch (error) {
      mostrarMensaje('Error al cargar los pedidos pendientes', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  // Manejar cambio de filtro
  const handleFiltroChange = (e) => {
    const checked = e.target.checked;
    setMostrarSoloPendientes(checked);
    
    if (checked) {
      cargarPedidosPendientes();
    } else {
      cargarPedidos();
    }
  };

  // Manejar eventos de los componentes hijos
  const handlePedidoCreado = (mensajeExito) => {
    mostrarMensaje(mensajeExito);
    if (mostrarSoloPendientes) {
      cargarPedidosPendientes();
    } else {
      cargarPedidos();
    }
  };

  const handlePedidoActualizado = (mensajeExito, tipo = 'success') => {
    mostrarMensaje(mensajeExito, tipo);
    if (mostrarSoloPendientes) {
      cargarPedidosPendientes();
    } else {
      cargarPedidos();
    }
  };

  const handlePedidoEliminado = (mensajeExito, tipo = 'success') => {
    mostrarMensaje(mensajeExito, tipo);
    if (mostrarSoloPendientes) {
      cargarPedidosPendientes();
    } else {
      cargarPedidos();
    }
  };

  // Cargar pedidos al montar el componente
  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <header className="mb-4">
              <h1 className="display-6 fw-bold text-primary">
                <i className="fas fa-shopping-cart me-3"></i>
                Sistema de Gestión de Pedidos
              </h1>
              <p className="text-muted">Administra tus pedidos de forma eficiente</p>
            </header>

            {/* Mensajes */}
            <Mensaje 
              mensaje={mensaje} 
              tipo={tipoMensaje}
              onClose={() => setMensaje('')}
            />

            <div className="row">
              {/* Formulario para crear pedido */}
              <div className="col-lg-4 col-md-5">
                <div className="card h-100">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-plus-circle me-2"></i>
                      Registrar Nuevo Pedido
                    </h5>
                  </div>
                  <div className="card-body">
                    <FormularioPedido onPedidoCreado={handlePedidoCreado} />
                  </div>
                </div>
              </div>

              {/* Tabla de pedidos */}
              <div className="col-lg-8 col-md-7">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-list me-2"></i>
                      Lista de Pedidos
                      {pedidos.length > 0 && (
                        <span className="badge bg-secondary ms-2">
                          {pedidos.length}
                        </span>
                      )}
                    </h5>
                    
                    <div className="d-flex align-items-center">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="filtroPendientes"
                          checked={mostrarSoloPendientes}
                          onChange={handleFiltroChange}
                        />
                        <label className="form-check-label" htmlFor="filtroPendientes">
                          Solo pendientes
                        </label>
                      </div>
                      
                      <button
                        className="btn btn-outline-secondary btn-sm ms-3"
                        onClick={mostrarSoloPendientes ? cargarPedidosPendientes : cargarPedidos}
                        disabled={loading}
                      >
                        <i className="fas fa-sync-alt me-1"></i>
                        Actualizar
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2 text-muted">Cargando pedidos...</p>
                      </div>
                    ) : (
                      <TablaPedidos
                        pedidos={pedidos}
                        onPedidoActualizado={handlePedidoActualizado}
                        onPedidoEliminado={handlePedidoEliminado}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;