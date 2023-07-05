const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api', router);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});