const express = require('express');
const cors = require('cors');
const api = require('./routes/api')

const app = express();

app.use(cors());

app.use('/api', api);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});