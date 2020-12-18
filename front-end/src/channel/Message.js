import react from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/core'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
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
  content
}) => {
  console.log(dayjs(message.creation).calendar())
  console.log(dayjs(1602232260000).calendar())
  return (
    <Card variant='outlined'>
      <CardContent>
        <p style={styles.name}>
          <span>{message.name}</span>
          {' - '}
          <span>{dayjs(parseInt(message.creation)).calendar()}</span>
        </p>
        <div dangerouslySetInnerHTML={{__html: content}}>
        </div>
      </CardContent>
    </Card>
  )
}
