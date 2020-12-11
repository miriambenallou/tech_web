
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')
const microtime = require('microtime')
const level = require('level')
const db = level(__dirname + '/../db')

module.exports = {
  channels: {
    create: async (channel) => {
      if(!channel.name) throw Error('Invalid channel')
      const id = uuid()
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, {id: id})
    },
    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`channels:${id}`)
      const channel = JSON.parse(data)
      return merge(channel, {id: id})
    },
    list: async (email) => {
      if (!email) throw Error('Invalid email')
      return new Promise( (resolve, reject) => {
        const channels = []
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]

          if (channel.members.includes(email))
            channels.push(channel)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(channels)
        })
      })
    },
    update: async (id, channel) => {
      const original = await db.get(`channels:${id}`)
      if(!original) throw Error('Unregistered channel id')
      await db.del(`channels:${id}`)
      const data = await db.put(`channels:${id}`, JSON.stringify({
        name: channel.name,
        creator: channel.creator,
        members: channel.members
      }))
      return data
    },
    delete: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      delete store.channels[id]
    }
  },
  messages: {
    create: async (channelId, message) => {
      if(!channelId) throw Error('Invalid channel')
      if(!message.author) throw Error('Invalid message')
      if(!message.content) throw Error('Invalid message')
      creation = microtime.now()
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content
      }))
      return merge(message, {channelId: channelId, creation: creation})
    },
    list: async (channelId) => {
      return new Promise( (resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value)
          const [, channelId, creation] = key.split(':')
          message.channelId = channelId
          message.creation = creation
          messages.push(message)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(messages)
        })
      })
    },
  },
  users: {
    create: async (user) => {
      if(!user.email) throw Error('Invalid user')
      const id = uuid()
      await db.put(`users:${id}`, JSON.stringify(user))
      return merge(user, {id: id})
    },
    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`users:${id}`)
      const user = JSON.parse(data)
      return merge(user, {id: id})
    },
    getByEmail: async (email) => {
      if(!email) throw Error('Invalid email')

      return new Promise( (resolve, reject) => {
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({key, value}) => {
          user = JSON.parse(value)
          if (user.email === email) {
            let id = key.split("users:")[1]
            resolve(merge(user, {id: id}))
          }
        }).on( 'error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(null)
        })
      })
    },
    list: async () => {
      return new Promise( (resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(users)
        })
      })
    },
    update: async (user, token) => {
      const original = await db.get(`users:${user.id}`)
      if (!original) throw Error("Invalid user id !")

      await db.del(`users:${user.id}`)

      let data
      if (token) {
        data = await db.put(`users:${user.id}`, JSON.stringify(merge(user, {access_token: token})))
      } else {
        data = await db.put(`users:${user.id}`, JSON.stringify(user))
      }
      return data
    },
    delete: (email) => {
      return new Promise( (resolve, reject) => {
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({key, value}) => {
          user = JSON.parse(value)
          if (user.email === email) {
            let id = key.split("users:")[1]
            // const data = db.delete(`users:${id}`)
            const data = db.put(`users:${id}`, JSON.stringify({}))
            resolve(data)
          }
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(null)
        })
      })
    }
  },
  admin: {
    clear: async () => {
      await db.clear()
    },
  },
  debug: async () => {
    return new Promise( (resolve, reject) => {
      let arr = []
      db.createReadStream({
      }).on( 'data', (data) => {
        arr.push(data)
      }).on( 'error', (err) => {
        reject(err)
      }).on( 'end', () => {
        resolve(arr)
      })
    })
  }
}
