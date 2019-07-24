const express = require("express")

const app = express()

app.set('secret', 'test123456')

app.use(require('cors')())
app.use(express.json())
app.use('/', express.static(__dirname + '/public'))
require('./plugins/database')(app)
require('./routes')(app)
require('./plugins/exchange')


app.listen(3000, () => {
  console.log('http://localhost:3000');
});
