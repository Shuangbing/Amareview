const express = require("express")

const app = express()

app.set('secret', 'test123456')

app.use(require('cors')())
app.use(express.json())

require('./plugins/database')(app)
require('./routes')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
