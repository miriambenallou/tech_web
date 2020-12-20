const {v4: uuid} = require('uuid')
const db = require('./db')
const express = require('express')
const cors = require('cors')
const {merge} = require('mixme')
const authenticator = require('./authenticator')

const app = express()
const authenticate = authenticator({
  jwks_uri: 'http://127.0.0.1:5556/dex/keys'
})

app.use(require('body-parser').json())
app.use(cors())

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
})

// DEBUG.
app.get('/debug', async (req, res) => {
  const arr = await db.debug()
  res.json(arr)
})

app.post('/admin/reset', async (req, res) => {
  await db.admin.clear()
  res.json({})
})

// Channels

// app.get('/channels', async (req, res) => {
app.get('/channels', authenticate, async (req, res) => {
  const channels = await db.channels.list(req.user.email)
  res.json(channels)
})

app.post('/channels', authenticate, async (req, res) => {
  const c = JSON.parse(req.query.channel)
  const chan = {
    name: c.name,
    members: c.members,
    creator: req.query.email
  }
  const channel = await db.channels.create(chan)
  res.status(201).json(channel)
})

app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id)
  res.json(channel)
})

app.put('/channels/:id', authenticate, async (req, res) => {
  const c = req.body.params.channel
  const channel = await db.channels.update(req.params.id, c)
  res.json(channel)
})

app.delete('/channels/:id', authenticate, async (req, res) => {
  const channel = await db.channels.get(req.params.id)

  if (channel.creator === req.user.email) {
    db.channels.delete(req.params.id)
    res.status(201).json(null)
  } else {
    res.status(401).json({msg: "Not authorized to delete this channel !"})
  }
})

// Messages

app.get('/channels/:id/messages', async (req, res) => {
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post('/channels/:id/messages', async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body)
  res.status(201).json(message)
})

app.put('/channels/:id/messages', authenticate, async (req, res) => {
  if (req.body.params.message.author === req.user.email) {
    const message = await db.messages.update(req.params.id, req.body.params.message)
    res.status(201).json(message)
  } else {
    res.status(401).json({msg: "Cannot modify other people's messages"})
  }
})

app.delete('/channels/:id/messages', authenticate, async (req, res) => {
  const m = JSON.parse(req.query.message)
  console.log(m)
  const msg = JSON.parse(await db.messages.get(req.params.id, m))
  console.log(msg)
  if (msg.author === req.user.email) {
    await db.messages.delete(req.params.id, m.creation)
    res.status(201).json(null)
  } else {
    res.status(401).json({msg: "Not authorized to delete this message"})
  }
})

// Users

app.get('/users', async (req, res) => {
  const users = await db.users.list()
  res.json(users)
})

app.post('/users', async (req, res) => {
  const data = await db.users.getByEmail(req.body.email)
  console.log("Trying to create new user...")
  console.log("Email :", req.body.email)
  if (data == null) {
    console.log("User created")
    const user = await db.users.create(req.body)
    res.status(201).json(user)
  } else {
    console.log("User already exist")
    res.status(201).json(null)
  }
})

app.get('/users/:email', async (req, res) => {
  const user = await db.users.getByEmail(req.params.email)
  res.json(user)
})

app.put('/users/:email', async (req, res) => {
  if (req.body.generate_token === true) { // Must generate a token for the user.
    const token = uuid() + '-' + uuid()
    const dt = await db.users.update(req.body.user, token)
    res.status(201).json(dt)
  } else { // Just edit the user.
    const dt = await db.users.update(req.body.user)
    res.status(201).json(dt)
  }
})

// app.delete('/users/:email', async (req, res) => {
//   console.log("Try to delete :", req.params.email)
//   const data = await db.users.delete(req.params.email)
// })

module.exports = app
