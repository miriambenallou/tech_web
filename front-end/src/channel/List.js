import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useContext, useState} from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
// Markdown
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
// Time
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'

import Context from '../Context'
import Message from './Message'
import MessageDialog from './MessageDialog'

dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'DD/MM/YYYY hh:mm'
  }
})
const useStyles = (theme) => ({
  root: {
    minHeight: '100%',
    position: 'relative',
    flex: '1 1 auto',
    overflowX: 'hidden',
    'pre': {

      overflowY: 'auto',
    },
    '& ul': {
      'margin': 0,
      'padding': 0,
      'textIndent': 0,
      'listStyleType': 0,
    },
    backgroundImage: 'url("../background_conv.jpg")',
    backgroundPosition: "center center",
    backgroundAttachement: "scroll",
    backgroundSize: "auto auto",
  },
  message: {
    padding: '.2rem .5rem',
    '&#from-me': {
      '& .MuiPaper-root': {
        backgroundColor: 'rgb(69, 113, 173)',
        borderRadius: '20px 20px 0px 20px',
        border: '2px ridge grey',
      },
      '& .MuiCardContent-root': {
        padding: '5px 10px 10px 5px',
      },
      position: 'relative',
      right: '-50%',
      height: 'auto'
    },
    '&#from-others': {
      '& .MuiPaper-root': {
        backgroundColor: 'rgb(77, 77, 77)',
        borderRadius: '20px 20px 20px 0px',
        border: '2px ridge grey',
      },
      '& .MuiCardContent-root': {
        padding: '5px 10px 10px 5px',
      },
    },
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.05)',
    },
    maxWidth: '50%'
  },
  fabWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50px',
  },
  fab: {
    position: 'fixed !important',
    top: 0,
    width: '50px',
  },
})

export default forwardRef(({
  channel,
  messages,
  onScrollDown
}, ref) => {
  const [dialog, setDialog] = useState({
    open: false
  })
  const styles = useStyles(useTheme())
  // Expose the `scroll` action
  useImperativeHandle(ref, () => ({
    scroll: scroll
  }));
  const rootEl = useRef(null)
  const scrollEl = useRef(null)
  const scroll = () => {
    scrollEl.current.scrollIntoView()
  }
  const {oauth} = useContext(Context)
  // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
  const throttleTimeout = useRef(null) // react-hooks/exhaustive-deps
  useLayoutEffect( () => {
    const rootNode = rootEl.current // react-hooks/exhaustive-deps
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null
          const {scrollTop, offsetHeight, scrollHeight} = rootNode // react-hooks/exhaustive-deps
          onScrollDown(scrollTop + offsetHeight < scrollHeight)
        }, 200)
      }
    }
    handleScroll()
    rootNode.addEventListener('scroll', handleScroll)
    return () => rootNode.removeEventListener('scroll', handleScroll)
  })
  return (
    <div css={styles.root} ref={rootEl}>
      <ul style={{maxWidth: "98%"}}>
        { messages.map( (message, i) => {
            const {contents: content} = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content)
            const cont = content.substring(3).slice(0, -4)
            return (
              <li key={i} css={styles.message}
                id={
                  message.author === oauth.email ? 'from-me' : 'from-others'
                }
              >
                <Message message={message} content={cont} fromMe={message.author === oauth.email} setDialog={setDialog} />
              </li>
            )
        })}
      </ul>
      <div ref={scrollEl} />
      <MessageDialog dialog={dialog} setDialog={setDialog} oauth={oauth} />
    </div>
  )
})
