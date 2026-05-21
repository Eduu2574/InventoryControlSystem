import { obtenerProductos } from '../models/productos.model.js';
import pool from '../../../../db.js';
import { registrarMovimiento } from './stockMovimientos.controller.js';

/* ======================================================
   📦 OBTENER PRODUCTOS
====================================================== */
export const getProductos = async (req, res) => {
  try {
    const fabricaId = req.query.fabrica;
    const productos = await obtenerProductos(fabricaId);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener productos');
  }
};

/* ======================================================
   📦 OBTENER PRODUCTOS (DB DIRECTA)
====================================================== */
export async function obtenerProductosDB() {
  const result = await pool.query(
    'SELECT * FROM productos WHERE activo = TRUE'
  );
  return result.rows;
}

export async function getProductos2(req, res) {
  try {
    const productos = await obtenerProductosDB();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error cargando productos' });
  }
}

/* ======================================================
   ➕ CREAR PRODUCTO
====================================================== */
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, stock, securityStock, fabrica_id } = req.body;

    const stockMinimo =
      securityStock === undefined || securityStock === ''
        ? null
        : Number(securityStock);

    if (stockMinimo === null) {
      await pool.query(
        `INSERT INTO productos (nombre, descripcion, stock_actual, fabrica_id)
         VALUES ($1, $2, $3, $4)`,
        [nombre, descripcion, stock, fabrica_id]
      );
    } else {
      await pool.query(
        `INSERT INTO productos (nombre, descripcion, stock_actual, stock_minimo, fabrica_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [nombre, descripcion, stock, stockMinimo, fabrica_id]
      );
    }

    res.status(201).json({ ok: true });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear producto');
  }
};

/* ======================================================
   ➕➖ CAMBIAR STOCK
====================================================== */
export async function cambiarStock(req, res) {
  const { id } = req.params;
  const { cambio } = req.body;

  try {
    const result = await pool.query(
      'SELECT stock_actual FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const stockAnterior = result.rows[0].stock_actual;
    const stockNuevo = stockAnterior + cambio;

    if (stockNuevo < 0) {
      return res.status(400).json({ error: 'Stock negativo no permitido' });
    }

    await pool.query(
      'UPDATE productos SET stock_actual = $1 WHERE id = $2',
      [stockNuevo, id]
    );

    await registrarMovimiento({
      producto_id: id,
      userId: req.userId,
      tipo: cambio > 0 ? 'INCREMENTO' : 'DECREMENTO',
      cantidad: Math.abs(cambio),
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: 'Error actualizando stock' });
  }
}

/* ======================================================
   ✏️ EDITAR PRODUCTO
====================================================== */
export async function editarProducto(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, stock_minimo, stock } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'Nombre obligatorio' });
  }

  try {
    const result = await pool.query(
      'SELECT stock_actual FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const stockAnterior = result.rows[0].stock_actual;

    const nuevoStock =
      stock !== undefined && stock !== ''
        ? Number(stock)
        : stockAnterior;

    const stockMin =
      stock_minimo === '' || stock_minimo === undefined
        ? null
        : Number(stock_minimo);

    let sql = `
      UPDATE productos
      SET nombre = $1, descripcion = $2, stock_actual = $3
    `;

    const params = [nombre, descripcion, nuevoStock];
    let index = 4;

    if (stockMin !== null) {
      sql += `, stock_minimo = $${index}`;
      params.push(stockMin);
      index++;
    }

    sql += ` WHERE id = $${index}`;
    params.push(id);

    await pool.query(sql, params);

    if (nuevoStock !== stockAnterior) {
      await registrarMovimiento({
        producto_id: id,
        userId: req.userId,
        tipo: 'AJUSTE_MANUAL',
        cantidad: Math.abs(nuevoStock - stockAnterior),
        stock_anterior: stockAnterior,
        stock_nuevo: nuevoStock
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

/* ======================================================
   🗑️ ELIMINAR PRODUCTO
====================================================== */
export async function eliminarProducto(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT stock_actual FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const stockAnterior = result.rows[0].stock_actual;

    await pool.query(
      'UPDATE productos SET activo = false WHERE id = $1',
      [id]
    );

    await registrarMovimiento({
      producto_id: id,
      userId: req.userId,
      tipo: 'ELIMINADO',
      cantidad: 0,
      stock_anterior: stockAnterior,
      stock_nuevo: stockAnterior
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
}

/* ======================================================
   📜 HISTORIAL
====================================================== */
export async function obtenerMovimientos(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM movimientos_stock
       WHERE producto_id = $1
       ORDER BY fecha DESC`,
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
}

/* ======================================================
   🔐 HISTORIAL GLOBAL
====================================================== */
export async function obtenerMovimientosGlobal(req, res) {
  const { desde, hasta, tipo, fabrica } = req.query;

  let sql = `
    SELECT
      m.fecha,
      m.tipo,
      m.cantidad,
      m.stock_anterior,
      m.stock_nuevo,
      m.usuario,
      p.nombre AS producto
    FROM movimientos_stock m
    INNER JOIN productos p ON p.id = m.producto_id
  `;

  const params = [];
  const conditions = [];

  if (fabrica) {
    conditions.push(`p.fabrica_id = $${params.length + 1}`);
    params.push(fabrica);
  }

  if (desde && hasta) {
    conditions.push(`DATE(m.fecha) BETWEEN $${params.length + 1} AND $${params.length + 2}`);
    params.push(desde, hasta);
  }

  if (tipo) {
    conditions.push(`m.tipo = $${params.length + 1}`);
    params.push(tipo);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY m.fecha DESC';

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo historial global' });
  }
}


export default {
  getProductos,
  getProductos2,
  obtenerProductosDB,
  crearProducto,
  cambiarStock,
  editarProducto,
  eliminarProducto,
  obtenerMovimientos,
  obtenerMovimientosGlobal
};
