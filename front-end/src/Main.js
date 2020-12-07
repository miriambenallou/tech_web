import {useContext} from 'react'
import qs from 'qs'
import axios from 'axios'
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
// Local
import Context from './Context'
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'
import {
  Route,
  Switch,
} from 'react-router-dom'

const useStyles = (theme) => ({
  root: {
    backgroundColor: '#373B44',
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  drawer: {
    width: '200px',
    display: 'none',
  },
  drawerVisible: {
    display: 'block',
  },
})

const manageOauthConn = async (oauth) => {
  axios.get("http:127.0.0.1:3001/users", {}).then((res) => {
    console.log(res)
  })
}

export default ({
  oauth
}) => {
  const {
    currentChannel,
    drawerVisible,
  } = useContext(Context)
  const theme = useTheme()
  const styles = useStyles(theme)
  const alwaysOpen = useMediaQuery(theme.breakpoints.up('sm'))
  const isDrawerVisible = alwaysOpen || drawerVisible

  console.log(oauth);

  if (oauth.userType === "oauth") {
    console.log("go")
    manageOauthConn(oauth)
  }

  // axios.post("http://127.0.0.1:3001/admin/reset", {})

  // const {data} = axios.get("http://127.0.0.1:3001/users", {}).then((res) => {
  //   console.log(res)
  // }).catch((err) => {
  //   console.log(err)
  // })
  // axios.post("http://127.0.0.1:3001/users", {
  //   email: oauth.email
  // })

  return (
    <main css={styles.root}>
      <Drawer
        PaperProps={{ style: { position: 'relative' } }}
        BackdropProps={{ style: { position: 'relative' } }}
        ModalProps={{
          style: { position: 'relative' }
        }}
        variant="persistent"
        open={isDrawerVisible}
        css={[styles.drawer, isDrawerVisible && styles.drawerVisible]}
      >
        <Channels />
      </Drawer>
      <Switch>
        <Route path="/channels/:id">
          <Channel />
        </Route>
        <Route path="/">
          <Welcome />
        </Route>
      </Switch>
    </main>
  );
}
