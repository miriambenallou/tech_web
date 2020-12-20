import {useState} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout

import IconButton from '@material-ui/core/IconButton';
import TuneIcon from '@material-ui/icons/Tune';

export default ({
  channel,
  styles,
  history,
  i,
  setDialog,
  oauth
}) => {
  const handleClickBtn = () => {
    setDialog({
      channelId: channel.id,
      creator: channel.creator,
      open: true,
      name: channel.name,
      members: channel.members
    })
  }
  return (
      <div
        style={styles.channelDiv}
        onClick={ (e) => {
          if (/.*SVGAnimatedString.*/.test(e.target.className))
            return
          e.preventDefault()
          history.push(`/channels/${channel.id}`)
        }}
      >
        <div key={i} css={styles.channel}>
          {channel.name}
        </div>
        <div>
          {(channel.creator === oauth.email ?
          <IconButton onClick={handleClickBtn}
          css={styles.button}
          >
          <TuneIcon />
          </IconButton>
          :
          ''
          )}
        </div>
      </div>
  )
}
