import { useContext, useState } from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Local
import Oups from './Oups'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Context from './Context'
import SettingsDialog from './SettingsDialog'

// Rooter
import {
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom"

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    justifyContent: 'space-between'
  },
}

export default () => {
  const location = useLocation()
  const {oauth} = useContext(Context)
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false)
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible)
  }
  document.title = "ECE CHAT"
  return (
    <div className="App" css={styles.root}>
      <Header drawerToggleListener={drawerToggleListener}/>
      <Switch>
        <Route exact path="/">
          {
            oauth ? (
              oauth.firstname.length > 0 ? (
                <Redirect
                  to={{
                    pathname: "/channels",
                    state: { from: location }
                  }}
                />
              ) : (
                <Redirect
                  to={{
                    pathname: "/settings",
                    state: { from: location }
                  }}
                />
              )
            ) : (
              <Login />
            )
          }
        </Route>
        <Route path="/settings">
        {
          oauth ? (
            <SettingsDialog oauth={oauth} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
        </Route>
        <Route path="/channels">
          {
            oauth ? (
              oauth.firstname.length > 0 ? (
                <Main oauth={oauth} />
              ) : (
                <Redirect
                  to={{
                    pathname: "/settings",
                    state: { from: location }
                  }}
                />
              )
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: location }
                }}
              />
            )
          }
        </Route>
        <Route path="/Oups">
          <Oups />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}
