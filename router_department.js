const express = require('express');
const router = express.Router();
const pool = require('./db_connection.js')

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM department')
        res.status(200).json(result.rows)
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM department
        WHERE dept_code = $1`, [req.params.id]);
        if (result.rows.length === 0) {
            res.status(400).json('Record Not Found')
        }
        else {
            res.status(200).json(result.rows)
        }
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'err.message', error: err.message })
    }
})

router.post('/', async (req, res) => {
    const { dept_code, dept, sector, manager_id } = req.body;
    try {
        await pool.query(`INSERT INTO department (dept_code, dept, sector, manager_id)
        VALUES ($1, $2, $3, $4) RETURNING *`,
            [dept_code, dept, sector, manager_id]);
        res.status(200).json('Record Inserted Successfully')
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
})

router.put('/:id', async (req, res) => {
    const { dept, sector, manager_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE department SET dept = $1, sector = $2, manager_id = $3
            WHERE dept_code = $4 RETURNING *`,
            [dept, sector, manager_id, req.params.id]);
        if (result.rows.length === 0) {
            res.status(400).json('Record Not Found')
        }
        else {
            res.status(200).json('Update Successfull')
        }
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM department
        WHERE dept_code = $1 RETURNING *`, [req.params.id]);
        if (result.rows.length === 0) {
            res.status(400).json('Record not Found')
        }
        else {
            res.status(200).json('Record Deleted Successfully')
        }
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({message: 'Server Error', error: err.message})
    }
})

module.exports = router;