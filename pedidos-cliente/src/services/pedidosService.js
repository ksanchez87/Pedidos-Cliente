import axios from 'axios';

const API_URL = 'http://localhost:3000/api/pedidos';

// Configurar axios para manejar CORS
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pedidosService = {
  // Obtener todos los pedidos
  async getPedidos() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Obtener pedidos pendientes
  async getPedidosPendientes() {
    try {
      const response = await api.get('/pendientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos pendientes:', error);
      throw error;
    }
  },

  // Crear pedido
  async crearPedido(pedidoData) {
    try {
      const response = await api.post('/', pedidoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Actualizar pedido
  async actualizarPedido(pedidoData) {
    try {
      const response = await api.put('/', pedidoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      throw error;
    }
  },

  // Eliminar pedido
  async eliminarPedido(id) {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  }
};