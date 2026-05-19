import express from 'express';
import { obtenerProductosDB } from '../controllers/productos.controller.js';

const router = express.Router();

router.post('/chatbot', async (req, res) => {
  try {

    const { mensaje, fabrica_id } = req.body;


    // ✅ 1. CARGAR PRODUCTOS REALES

    const productosAll = await obtenerProductosDB();

    const productos = productosAll.filter(p =>
      Number(p.fabrica_id) === Number(fabrica_id)
    );

    const criticos = [];
    const riesgo = [];
    const optimos = [];

    productos.forEach(p => {

      const stockActual = Number(p.stock_actual);
      const stockMinimo = Number(p.stock_minimo);

      if (!stockMinimo) return;

      if (stockActual <= stockMinimo) {
        criticos.push(p);
      } else if (stockActual <= stockMinimo * 1.5) {
        riesgo.push(p);
      } else {
        optimos.push(p); // ✅ CLAVE
      }

    });
    // ✅ 2. LLAMADA A IA
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: 'system',
            content: `
Eres un asistente de logística industrial especializado en gestión de inventario.

Trabajas sobre UNA fábrica concreta, por lo que SOLO puedes responder usando los datos proporcionados.

Datos REALES del sistema:

Productos críticos (${criticos.length}):
${criticos.map(p => `- ${p.nombre} (${p.stock_actual}/${p.stock_minimo})`).join('\n')}

Productos en riesgo (${riesgo.length}):
${riesgo.map(p => `- ${p.nombre} (${p.stock_actual}/${p.stock_minimo})`).join('\n')}

Productos óptimos (${optimos.length}):
${optimos.map(p => `- ${p.nombre}`).join('\n')}

Total productos: ${productos.length}

INSTRUCCIONES:
- Responde de forma clara, profesional y breve
- Si el usuario pregunta por estado del stock, usa las categorías: Crítico, En riesgo, Óptimo
- Prioriza siempre los productos críticos en tus respuestas
- Si no hay productos en una categoría, indícalo claramente
- NO inventes productos ni datos
- NO uses información externa
- Usa SOLO los datos proporcionados
- Responde como si estuvieras ayudando a un operario o responsable de planta

`

          },
          {
            role: 'user',
            content: mensaje
          }
        ]
      })
    });

    const data = await response.json();

    // ✅ PROTECCIÓN
    if (!data.choices || !data.choices[0]) {
      console.error("Error IA:", data);
      return res.json({
        respuesta: "⚠️ El asistente no pudo responder"
      });
    }

    res.json({
      respuesta: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      respuesta: "Error en el servidor"
    });
  }
});

export default router;