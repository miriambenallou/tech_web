import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
// Local
import Context from './Context'
import {useHistory} from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button"

import ChannelButton from './ChannelButton'
import ChannelSettingsDialog from './ChannelSettingsDialog'
import CreateChannelDialog from './CreateChannelDialog'

const styles = {
  root: {
    maxWidth: '200px',
  },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
    color: 'black',
    cursor: 'default'
  },
  channelDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: "5% 0",
    border: 'solid black',
  },
  // container: {
  //   display : 'flex',
  //   flexWrap: 'nowrap',
  //   alignItems: 'stretch',
  //   flex: '1 1 70%'
  // },
  button: {
    '&.MuiIconButton-root': {
      color: 'black'
    }
  }
}

export default () => {
  const {
    oauth,
    channels, setChannels
  } = useContext(Context)
  const history = useHistory();
  const [dialog, setDialog] = useState({
    open: false
  })
  const [openCreate, setOpenCreate] = useState(false)
  const [users, setUsers] = useState([])
  useEffect( () => {
    const fetch = async () => {
      try{
        const {data: channels} = await axios.get('http://localhost:3001/channels', {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`,
            'no-oauth': true
          },
          params: {
            email: oauth.email
          }
        })
        setChannels(channels)
      }catch(err){
        console.error(err)
      }
    }
    fetch()
  }, [oauth, setChannels])

  const getUsers = async () => {
    const {data} = await axios.get('http://127.0.0.1:3001/users')
    
    let arr = []
    for (let i = 0; i < data.length; i++) {
      let a = data[i]
      let alone = true
      for (let j = 0; j < data.length; j++) {
        if (i !== j) {
          let b = data[j]
          if ( (a.firstname + ' ' + a.lastname) === (b.firstname + ' ' + b.lastname) ) {
            alone = false
            break
          }
        }
      }
      arr.push({
        user: data[i],
        bymail: !alone
      })      
    }

    setUsers(arr)
  }

  const createChannel = async () => {
    await getUsers()

    setOpenCreate(true)
  }

  const editChannel = async (obj) => {
    await getUsers()

    setDialog({
      channelId: obj.channelId,
      creator: obj.creator,
      open: true,
      name: obj.name,
      members: obj.members
    })
  }

  console.log("oauth :", oauth)

  return (
    <div>
      <AppBar
        position="sticky"
        style={{
          backgroundColor: "#1c687a"
        }}
      >
        <Button
          style={{
            width:"100%"
          }}
          onClick={createChannel}
        >Create channel</Button>
      </AppBar>
      <ul style={styles.root}>
        { channels.map( (channel, i) => (
          <ChannelButton
            channel={channel}
            styles={styles}
            history={history}
            i={i}
            setDialog={editChannel}
          />
        ))}
      </ul>
      <ChannelSettingsDialog
        dialog={dialog}
        setDialog={setDialog}
        oauth={oauth}
        users={users}
      />
      <CreateChannelDialog
        open={openCreate}
        setOpen={setOpenCreate}
        oauth={oauth}
        users={users}
      />
    </div>
  );
}
