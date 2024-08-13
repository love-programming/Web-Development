const express = require('express');
const app = express();
const employees = require('./router_employees.js');
const dependants = require('./router_dependants.js');
const departments = require('./router_department.js');
const upload = require('./router_upload.js')


app.use(express.json());

app.use('/employee', employees);
app.use('/dependant', dependants)
app.use('/department', departments)
app.use('/upload', upload);

const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port 3000');
});
