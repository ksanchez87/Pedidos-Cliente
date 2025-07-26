import React, { useState, useEffect } from "react";
import { pedidosService } from "../services/pedidosService";
import { formatearFechaParaBackend } from "../utils/dateUtils";

const FormularioPedido = ({ onPedidoCreado }) => {
  const [formData, setFormData] = useState({
    numero_pedido: "",
    fecha_pedido: "",
    cliente: "",
    estado_pedido: "Pendiente",
    fecha_entrega_estimada: "",
    total_pedido: "",
    notas_pedido: "",
  });

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const response = await fetch("http://localhost:3000/api/clientes");
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setError("Error al cargar los clientes");
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.numero_pedido.trim()) {
      nuevosErrores.numero_pedido = "El número de pedido es requerido";
    }

    if (!formData.fecha_pedido) {
      nuevosErrores.fecha_pedido = "La fecha de pedido es requerida";
    }

    if (!formData.cliente.trim()) {
      nuevosErrores.cliente = "El ID del cliente es requerido";
    }

    if (!formData.estado_pedido) {
      nuevosErrores.estado_pedido = "El estado es requerido";
    }

    if (!formData.fecha_entrega_estimada) {
      nuevosErrores.fecha_entrega_estimada =
        "La fecha de entrega estimada es requerida";
    }

    if (!formData.total_pedido || parseFloat(formData.total_pedido) <= 0) {
      nuevosErrores.total_pedido = "El total del pedido debe ser mayor a 0";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setEnviando(true);
    setError("");

    try {
      const pedidoData = {
        ...formData,
        fecha_pedido: formatearFechaParaBackend(formData.fecha_pedido),
        fecha_entrega_estimada: formData.fecha_entrega_estimada, // Ya viene en formato correcto del input date
      };

      await pedidosService.crearPedido(pedidoData);

      // Limpiar formulario
      setFormData({
        numero_pedido: "",
        fecha_pedido: "",
        cliente: "",
        estado_pedido: "Pendiente",
        fecha_entrega_estimada: "",
        total_pedido: "",
        notas_pedido: "",
      });

      onPedidoCreado("Pedido creado exitosamente");
    } catch (error) {
      setError("Error al crear el pedido. Por favor, inténtalo de nuevo.");
      console.error("Error:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="numero_pedido" className="form-label">
          Número de Pedido *
        </label>
        <input
          type="text"
          className={`form-control ${
            errores.numero_pedido ? "is-invalid" : ""
          }`}
          id="numero_pedido"
          name="numero_pedido"
          value={formData.numero_pedido}
          onChange={handleChange}
        />
        {errores.numero_pedido && (
          <div className="invalid-feedback">{errores.numero_pedido}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="fecha_pedido" className="form-label">
          Fecha de Pedido *
        </label>
        <input
          type="date"
          className={`form-control ${errores.fecha_pedido ? "is-invalid" : ""}`}
          id="fecha_pedido"
          name="fecha_pedido"
          value={formData.fecha_pedido}
          onChange={handleChange}
        />
        {errores.fecha_pedido && (
          <div className="invalid-feedback">{errores.fecha_pedido}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="cliente" className="form-label">
          ID Cliente *
        </label>
        <select
          className={`form-select ${errores.cliente ? "is-invalid" : ""}`}
          id="cliente"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          disabled={loadingClientes}
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cli) => (
            <option key={cli.id} value={cli.id}>
              {cli.first_name} {cli.last_name}
            </option>
          ))}
        </select>
        {errores.cliente && (
          <div className="invalid-feedback">{errores.cliente}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="estado_pedido" className="form-label">
          Estado *
        </label>
        <select
          className={`form-select ${errores.estado_pedido ? "is-invalid" : ""}`}
          id="estado_pedido"
          name="estado_pedido"
          value={formData.estado_pedido}
          onChange={handleChange}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="Atrasado">Atrasado</option>
        </select>
        {errores.estado_pedido && (
          <div className="invalid-feedback">{errores.estado_pedido}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="fecha_entrega_estimada" className="form-label">
          Fecha Entrega Estimada *
        </label>
        <input
          type="date"
          className={`form-control ${
            errores.fecha_entrega_estimada ? "is-invalid" : ""
          }`}
          id="fecha_entrega_estimada"
          name="fecha_entrega_estimada"
          value={formData.fecha_entrega_estimada}
          onChange={handleChange}
        />
        {errores.fecha_entrega_estimada && (
          <div className="invalid-feedback">
            {errores.fecha_entrega_estimada}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="total_pedido" className="form-label">
          Total del Pedido *
        </label>
        <input
          type="number"
          className={`form-control ${errores.total_pedido ? "is-invalid" : ""}`}
          id="total_pedido"
          name="total_pedido"
          value={formData.total_pedido}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="0.01"
        />
        {errores.total_pedido && (
          <div className="invalid-feedback">{errores.total_pedido}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="notas_pedido" className="form-label">
          Notas
        </label>
        <textarea
          className="form-control"
          id="notas_pedido"
          name="notas_pedido"
          value={formData.notas_pedido}
          onChange={handleChange}
          rows="3"
          placeholder="Notas adicionales del pedido"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={enviando}
      >
        {enviando && (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        )}
        {enviando ? "Creando..." : "Crear Pedido"}
      </button>
    </form>
  );
};

export default FormularioPedido;
