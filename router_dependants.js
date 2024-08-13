const express = require('express');
const router = express.Router();
const pool = require('./db_connection.js')

router.get('/', async(req, res)=>{
    try {
        const result = await pool.query('SELECT * FROM dependants')
        res.status(200).json(result.rows);
    }
    catch (err){
        console.error(err.message)
        res.status(500).json({message: 'Server Error', error: err.message})
    }
})

router.get('/:id', async(req, res)=>{
    try {
        const result = await pool.query(`SELECT * FROM dependants
        WHERE employee_id = $1`, [req.params.id] )

        if(result.rows.length === 0){
            res.status(400).json('Record Not Found');
        }
        else {
            res.status(200).json(result.rows)
        }
    } 
    catch (err) {
        console.error(err.message)
        res.status(500).json({message: 'Server Error', error: err.message})
    }
})

router.post('/', async (req, res)=>{
    const {employee_id, name, age} = req.body;
    try {
        await pool.query(`INSERT INTO dependants (employee_id, name, age)
        VALUES ($1, $2, $3) RETURNING *`,
        [employee_id, name, age]);

        res.status(200).json('Record Inserted Successfully')
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({message: 'Server Error', error: err.message})
    }
})

router.put('/:id', async(req, res)=>{
    const {name, age} = req.body;
    try {
        const result = await pool.query(
            `UPDATE dependants SET name = $1, age = $2
            WHERE employee_id = $3 RETURNING *`,
            [name , age, req.params.id])
        
        if (result.rows.length === 0) {
            res.status(400).json('Record Not Found')
        }
        else {
            res.status(200).json('Update Successfull')
        }
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({message: 'Server Error', error: err.message})
    }
})

router.delete('/:id', async (req, res)=>{
    try {
        const result = await pool.query(`DELETE FROM dependants
        WHERE employee_id = $1 RETURNING *`, [req.params.id]);
        if(result.rows.length === 0){
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
