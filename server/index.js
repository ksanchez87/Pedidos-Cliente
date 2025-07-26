const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000; // Puedes cambiarlo si lo deseas

app.use(cors());
app.use(express.json());

// Ruta base de SuiteCRM
const SUITE_CRM_URL = 'http://localhost/AgropecuariaCarangal/index.php?entryPoint=PedidosClientesApi';

/**
 * Obtener todos los pedidos
 */
app.get('/api/pedidos', async (req, res) => {
    try {
        const response = await axios.get(SUITE_CRM_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

/**
 * Obtener pedidos pendientes
 */
app.get('/api/pedidos/pendientes', async (req, res) => {
    try {
        const response = await axios.get(`${SUITE_CRM_URL}&pendientes=true`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos pendientes' });
    }
});

/**
 * Obtener todos los clientes
 */
app.get('/api/clientes', async (req, res) => {
    try {
        const response = await axios.get(`${SUITE_CRM_URL}&clientes`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

/**
 * Crear un pedido
 */
app.post('/api/pedidos', async (req, res) => {
    try {
        const response = await axios.post(SUITE_CRM_URL, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

/**
 * Actualizar un pedido
 */
app.put('/api/pedidos', async (req, res) => {
    try {
        const response = await axios.put(SUITE_CRM_URL, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
});

/**
 * Eliminar un pedido por id
 */
app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${SUITE_CRM_URL}&id=${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend Node.js corriendo en http://localhost:${PORT}`);
});
