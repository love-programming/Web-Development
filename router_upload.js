const express = require('express');
const router = express.Router();
const pool = require('./db_connection.js')
const multer = require('multer');
const xlsx = require('xlsx');

// Multer configuration for file upload

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('excelFile'), (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    excelData.forEach(async (row) => {
        try {
            await pool.query(`INSERT INTO employees (employee_id,first_name,last_name,
                dept_code,addr_line,city,state,zip)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [row.employee_id, row.first_name, row.last_name,
                row.dept_code, row.addr_line, row.city, row.state, row.zip]);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error', error: err.message })
        }
    });
    res.status(200).json('Excel data uploaded and saved successfully');
});

module.exports = router;