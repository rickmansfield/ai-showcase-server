const express = require('express');
const app = express();
const port = 3001; // Make sure this port does not conflict with your React app's port

app.get('/', (req, res) => {
  res.send('Hello World! This is my Express server.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
