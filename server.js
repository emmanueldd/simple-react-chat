// server.js
import express from 'express'
const app = express()
// Set port
app.set('port', process.env.PORT || 3000)
// Here, we import our Static files (dist..)
app.use(express.static('public'))
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Here, we import our Config
import config from './config'

// Here, we import our uniq model, Message
import Message from './models/Message'

// Here, we listen for a connection through socket.io
io.on('connection', socket => {
  // Create message
  socket.on('chat message', params => {
    Message.create(config, params, (message) => {
      io.emit('chat message', message);
    })
  })
})

// Here, we set the Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

http.listen(app.get('port'), () => {
  console.log('React Chat App listening on ' + app.get('port'))
})
