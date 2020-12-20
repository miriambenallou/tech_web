
import React, {useState} from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const Context = React.createContext()

export default Context

export const Provider = ({
  children
}) => {
  const [cookies, setCookie, removeCookie] = useCookies([])
  const [oauth, setOauth] = useState(cookies.oauth)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  return (
    <Context.Provider value={{
      oauth: oauth,
      setOauth: async (oauth) => {
        if (oauth) {
          const payload = JSON.parse(
            Buffer.from(
              oauth.id_token.split('.')[1], 'base64'
            ).toString('utf-8')
          )
          oauth.email = payload.email
          oauth.userType = "oauth"
          const {data} = axios.get(`http://127.0.0.1:3001/users/${oauth.email}`)
          
          if (data) {
            oauth.firstname = (data.firstname) ? data.firstname : ''
            oauth.lastname = (data.lastname) ? data.lastname : ''
            oauth.gravatar = (data.gravatar) ? data.gravatar : "monsterid"
          } else {
            oauth.firstname = (oauth.firstname) ? oauth.firstname : ''
            oauth.lastname = (oauth.lastname) ? oauth.lastname : ''
            oauth.gravatar = (oauth.gravatar) ? oauth.gravatar : "monsterid"
          }
          setCookie('oauth', oauth)
        } else {
          setCurrentChannel(null)
          setChannels([])
          removeCookie('oauth')
        }
        setOauth(oauth)
      },
      setNoOauth: (user) => {
        if (user) {
          let o = {
            email: user.email,
            userType: "no-oauth",
            access_token: user.access_token,
            firstname: user.firstname,
            lastname: user.lastname,
            gravatar: user.gravatar,
          }
          removeCookie('code_verifier')
          setCookie('oauth', o)
          setOauth(o)
        } else {
          setCurrentChannel(null)
          setChannels([])
          removeCookie('oauth')
          console.log("ERROR NO OAUTH USER NULL")
        }
      },
      channels: channels,
      drawerVisible: drawerVisible,
      setDrawerVisible: setDrawerVisible,
      setChannels: setChannels,
      currentChannel: currentChannel,
      setCurrentChannel: (channelId) => {
        const channel = channels.find( channel => channel.id === channelId)
        setCurrentChannel(channel)
      },
    }}>{children}</Context.Provider>
  )
}
