import { obtenerProductos } from '../models/productos.model.js';
import { db } from '../db.js';
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



export async function obtenerProductosDB() {
  return new Promise((resolve, reject) => {

    db.query('SELECT * FROM productos WHERE activo = 1', (err, rows) => {

      if (err) {
        reject(err);
      } else {
        resolve(rows); // ✅ solo productos activos
      }

    });

  });
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
        ? undefined
        : Number(securityStock);

    const sql =
      stockMinimo === undefined
        ? `
          INSERT INTO productos (nombre, descripcion, stock_actual, fabrica_id)
          VALUES (?, ?, ?, ?)
        `
        : `
          INSERT INTO productos (nombre, descripcion, stock_actual, stock_minimo, fabrica_id)
          VALUES (?, ?, ?, ?, ?)
        `;

    const params =
      stockMinimo === undefined
        ? [nombre, descripcion, stock, fabrica_id]
        : [nombre, descripcion, stock, stockMinimo, fabrica_id];

    db.query(sql, params);

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear producto');
  }
};

/* ======================================================
   ➕➖ CAMBIAR STOCK (BOTONES + / -)
====================================================== */
export function cambiarStock(req, res) {
  const { id } = req.params;
  const { cambio } = req.body;
  const usuario = req.user?.username || 'sistema';

  db.query(
    'SELECT stock_actual FROM productos WHERE id = ?',
    [id],
    (err, rows) => {
      if (err || rows.length === 0)
        return res.status(404).json({ error: 'Producto no encontrado' });

      const stockAnterior = rows[0].stock_actual;
      const stockNuevo = stockAnterior + cambio;

      if (stockNuevo < 0)
        return res.status(400).json({ error: 'Stock negativo no permitido' });

      db.query(
        'UPDATE productos SET stock_actual = ? WHERE id = ?',
        [stockNuevo, id],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: 'Error actualizando stock' });

          registrarMovimiento({
            producto_id: id,
            userId: req.userId,
            tipo: cambio > 0 ? 'INCREMENTO' : 'DECREMENTO',
            cantidad: Math.abs(cambio),
            stock_anterior: stockAnterior,
            stock_nuevo: stockNuevo
          });

          res.json({ success: true });
        }
      );
    }
  );
}

/* ======================================================
   ✏️ EDITAR PRODUCTO (CON AJUSTE)
====================================================== */
export function editarProducto(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, stock_minimo, stock } = req.body;
  const usuario = req.user?.username || 'sistema';

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'Nombre obligatorio' });
  }

  db.query(
    'SELECT stock_actual FROM productos WHERE id = ?',
    [id],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const stockAnterior = rows[0].stock_actual;
      const nuevoStock =
        stock !== undefined && stock !== ''
          ? Number(stock)
          : stockAnterior;

      const stockMin =
        stock_minimo === '' || stock_minimo === undefined
          ? undefined
          : Number(stock_minimo);

      const campos = ['nombre = ?', 'descripcion = ?', 'stock_actual = ?'];
      const valores = [nombre, descripcion, nuevoStock];

      if (stockMin !== undefined) {
        campos.push('stock_minimo = ?');
        valores.push(stockMin);
      }

      valores.push(id);

      db.query(
        `
        UPDATE productos
        SET ${campos.join(', ')}
        WHERE id = ?
        `,
        valores,
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: 'Error interno' });
          }

          if (nuevoStock !== stockAnterior) {
            registrarMovimiento({
              producto_id: id,
              userId: req.userId,
              tipo: 'AJUSTE_MANUAL',
              cantidad: Math.abs(nuevoStock - stockAnterior),
              stock_anterior: stockAnterior,
              stock_nuevo: nuevoStock
            });
          }

          res.json({ success: true });
        }
      );
    }
  );
}

/* ======================================================
   🗑️ ELIMINAR PRODUCTO (SOFT DELETE)
====================================================== */
export function eliminarProducto(req, res) {
  const { id } = req.params;
  const usuario = req.user?.username || 'sistema';

  db.query(
    'SELECT stock_actual FROM productos WHERE id = ?',
    [id],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const stockAnterior = rows[0].stock_actual;

      db.query(
        'UPDATE productos SET activo = 0 WHERE id = ?',
        [id],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: 'Error eliminando producto' });
          }

          registrarMovimiento({
            producto_id: id,
            userId: req.userId,
            tipo: 'ELIMINADO',
            cantidad: 0,
            stock_anterior: stockAnterior,
            stock_nuevo: stockAnterior
          });

          res.json({ success: true });
        }
      );
    }
  );
}

/* ======================================================
   📜 HISTORIAL POR PRODUCTO
====================================================== */
export function obtenerMovimientos(req, res) {
  const { id } = req.params;

  db.query(
    `
    SELECT *
    FROM movimientos_stock
    WHERE producto_id = ?
    ORDER BY fecha DESC
    `,
    [id],
    (err, rows) => {
      if (err)
        return res.status(500).json({ error: 'Error obteniendo historial' });

      res.json(rows);
    }
  );
}


/* ======================================================
   🔐 HISTORIAL GLOBAL (FILTROS)
====================================================== */
export function obtenerMovimientosGlobal(req, res) {

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

  // ✅ FILTRO POR FÁBRICA (YA FUNCIONA)
  if (fabrica) {
    conditions.push('p.fabrica_id = ?');
    params.push(fabrica);
  }

  if (desde && hasta) {
    conditions.push('DATE(m.fecha) BETWEEN ? AND ?');
    params.push(desde, hasta);
  }

  if (tipo) {
    conditions.push('m.tipo = ?');
    params.push(tipo);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY m.fecha DESC';

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error obteniendo historial global:', err);
      return res.status(500).json({ error: 'Error obteniendo historial global' });
    }

    res.json(rows);
  });
}


/* ======================================================
   ✅ EXPORT
====================================================== */
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