const express = require('express');
const mariadb = require('mariadb');

const app = express();

const PORT = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '****', // Add your password to the database
    database: 'pets'
});

async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database!');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database:' + err);
    }
};

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Hello, world! - Server");
    res.render('home');
});

app.post('/confirm', async (req, res) => {
    const data = req.body; 
    console.log(data);

    const conn = await connect();

    await conn.query(`
        INSERT INTO adoptions (pet_type, quantity, color) VALUES
        ('${ data.pet_type}', '${ data.quantity }', '${ data.color }');`
    );

    res.render('confirmation', { details: data });
});

app.get('/adoptions', async (req,res) => {
    const conn = await connect();
    const results = await conn.query('SELECT * FROM adoptions ORDER BY adoption_date DESC');

    res.render('adoptions', { adoptions: results });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
 