const express = require('express');

const app = express();

app.use(express.static('./dist/pv-interest-calculator'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {
    root: 'dist/pv-interest-calculator/'
  }),
);

app.listen(process.env.PORT || 8080);
