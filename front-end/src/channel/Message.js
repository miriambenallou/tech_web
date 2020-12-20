import react from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/core'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { CardHeader, IconButton } from '@material-ui/core';
dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'DD/MM/YYYY hh:mm'
  }
})

const styles = {
  name: {
    display: 'inline',
  },
}

export default ({
  message,
  content,
  fromMe,
  setDialog
}) => {
  
  const handleClick = (e) => {
    console.log(message)
    setDialog({
      open: true,
      message: message,
      content: content,
    })
  }
  
  return (
    <Card variant='outlined'>
      <CardHeader
        subheader={
          <div>
            <p style={styles.name}>
            <span>{message.name}</span>
            {' - '}
            <span>{dayjs(parseInt(message.creation)).calendar()}</span>
            </p>
          </div>
        }
        action={
          fromMe ?
            <IconButton 
              aria-label="settings"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          : 
            ''
        }
      />
      <CardContent>
        
        <div>
          {content.split('\n').map(str => <p>{str}</p>)}
        </div>
      </CardContent>
    </Card>
  )
}
