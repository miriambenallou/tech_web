import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
// Local
import Context from './Context'
import {useHistory} from 'react-router-dom'

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
  useEffect( () => {
    const fetch = async () => {
      try{
        // const data = await axios.get('http://localhost:3001/channels', {
        console.log(oauth.access_token)
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
  return (
    <div>
      <Button
        style={{
          width:"100%"
        }}
      >Create channel</Button>
      <ul style={styles.root}>
        { channels.map( (channel, i) => (
          <ChannelButton
            channel={channel}
            styles={styles}
            history={history}
            i={i}
            setDialog={setDialog}
          />
        ))}
      </ul>
      <ChannelSettingsDialog
        dialog={dialog}
        setDialog={setDialog}
        oauth={oauth}
      />
    </div>
  );
}
