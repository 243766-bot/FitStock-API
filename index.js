const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 


const db = mysql.createConnection({
    host: 'localhost',
    user: 'victor', 
    password: 'zaid1234', 
    database: 'Fit_Stock_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('¡Conectado exitosamente a la base de datos MySQL! 🗄️');
});


app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results); 
    });
});


app.post('/api/products', (req, res) => {
    
    const { name, category, stock_quantity } = req.body;

    
    const sql = 'INSERT INTO products (name, category, stock_quantity) VALUES (?, ?, ?)';

  
    db.query(sql, [name, category, stock_quantity], (err, result) => {
        if (err) {
            console.log("¡ALERTA DE MYSQL! El error es:", err);
            return res.status(500).send(err);
        }
        console.log(`¡Nuevo producto agregado: ${name}!`);
        res.json({ message: '¡Producto creado con éxito!', id: result.insertId });
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});


app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    console.log(`¡Alguien intentó borrar el producto con ID: ${productId}!`); 
    const sql = 'DELETE FROM products WHERE id = ?';
    
    db.query(sql, [productId], (err, result) => {
        if (err) return res.status(500).send(err);
        console.log('¡Borrado exitoso en la BD!'); 
        res.json({ message: '¡Producto borrado con éxito!' }); 
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, stock_quantity } = req.body;

    const sql = 'UPDATE products SET name = ?, category = ?, stock_quantity = ? WHERE id = ?';

    db.query(sql, [name, category, stock_quantity, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar:", err);
            return res.status(500).send(err);
        }
        res.json({ message: 'Producto actualizado con éxito' });
    });
});

