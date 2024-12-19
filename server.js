const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123', 
    database: 'waste_reduction',
});
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database');
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});
app.get('/show-products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'show-products.html'));
});
app.post('/add-product', (req, res) => {
    const { name, category, price, expiry_date } = req.body;
    if (!name || !category || !price || !expiry_date) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    db.query(
        'INSERT INTO products (name, category, price, expiry_date) VALUES (?, ?, ?, ?)',
        [name, category, price, expiry_date],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error adding product' });
            }
            res.json({ message: 'Product added successfully!' });
        }
    );
});
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error fetching products' });
        }
        res.json(results);
    });
});``
// Get Products Expiring in the Next Two Months
app.get('/api/expiry-products', (req, res) => {
    const currentDate = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(currentDate.getMonth() + 2);

    db.query(
        'SELECT * FROM products WHERE expiry_date BETWEEN ? AND ?',
        [currentDate, twoMonthsLater],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error fetching expiry products' });
            }
            res.json(results);
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
