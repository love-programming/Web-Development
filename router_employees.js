const express = require('express');
const router = express.Router();
const pool = require('./db_connection.js');

// FETCH ALL DATA
router.get('/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employees');
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
})

// FETCH DATA BY ID
router.get('/details/:id', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM employees
                                        WHERE employee_id = $1 `, [req.params.id])

        if (result.rows.length === 0) {
            res.status(400).json('Record not found');
        } else {
            res.status(200).json(result.rows);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
});

// ADD NEW DATA 
router.post('/create', async (req, res) => {
    const{employee_id, first_name, last_name, dept_code, addr_line, city, state, zip, district}=req.body;
    try {
        await pool.query(`INSERT INTO employees (employee_id,first_name,last_name,
            dept_code,addr_line,city,state,zip, district)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [employee_id, first_name, last_name, dept_code, addr_line, city, state, zip, district]);

        res.status(200).json('Insertion Successfull');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
});

// UPDATE DATA BY ID
router.put('/update/:id', async (req, res) => {

    const { first_name, last_name, dept_code, addr_line, city, state, zip } = req.body;
    try {
        const result = await pool.query(
            `UPDATE employees SET first_name = $1, last_name = $2, dept_code = $3,
            addr_line = $4, city = $5, state = $6, zip = $7
             WHERE employee_id = $8 RETURNING *`,
            [first_name, last_name, dept_code, addr_line, city, state,
                zip, req.params.id]);

        if (result.rows.length === 0) {
            res.status(400).json('Record Not Found');
        } else {
            res.status(200).json('Update Successful');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
});

// DELETE DATA BY ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM employees
                             WHERE employee_id = $1 RETURNING *`, [req.params.id]);
        if (result.rows.length === 0) {
            res.status(400).json('Record Not Found');
        } else {
            res.status(200).json('Record Deleted Successfully');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
});

module.exports = router;

