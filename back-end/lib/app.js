
const db = require('./db')
const express = require('express')
const cors = require('cors')
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
  const channels = await db.channels.list()
  res.json(channels)
})

app.post('/channels', async (req, res) => {
  const channel = await db.channels.create(req.body)
  res.status(201).json(channel)
})

app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id)
  res.json(channel)
})

app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.body)
  res.json(channel)
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

// Users

app.get('/users', async (req, res) => {
  const users = await db.users.list()
  res.json(users)
})

app.post('/users', async (req, res) => {
  const data = await db.users.getByEmail(req.body.email)
  console.log("Trying to create new user...")
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

app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.body)
  res.json(user)
})

module.exports = app
