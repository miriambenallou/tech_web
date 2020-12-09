import { useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import crypto from 'crypto'
import qs from 'qs'
import axios from 'axios'
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
// Local
import Context from './Context'

import SignUpDialog from './SignUpDialog'
import SignInDialog from './SignInDialog'

import Button from '@material-ui/core/Button';
import {
  useTheme,
} from '@material-ui/core/styles';

import {
  useHistory
} from "react-router-dom";

const base64URLEncode = (str) => {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const sha256 = (buffer) => {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest()
}

const useStyles = (theme) => ({
  root: {

    flex: '1 1 auto',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > div': {
      margin: `${theme.spacing(1)}`,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '& fieldset': {
      border: 'none',
      '& label': {
        marginBottom: theme.spacing(.5),
        display: 'block',
      },
    },
    backgroundImage: 'url("background_tech_main.jpg")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundAttachement: "fixed",
    backgroundSize: "cover",
  },
  button: {
    display: "inline",
    margin: "50px 50px 50px 50px",
    padding: "20px 50px 20px 50px",
  }
})

const Redirect = ({
  config,
  codeVerifier,
}) => {
  const styles = useStyles(useTheme())
  const redirect = (e) => {
    e.stopPropagation()
    const code_challenge = base64URLEncode(sha256(codeVerifier))
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join('')
    window.location = url
  }
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const {setNoOauth} = useContext(Context)

  const [openUp, setOpenUp] = useState(false)
  const [openIn, setOpenIn] = useState(false)


  const signIn = () => {
    setOpenIn(true)
  }
  const signUp = () => {
    setOpenUp(true)
  }

  const noOauthRedirect = (user) => {
    setNoOauth(user)
  }

  return (
    <div css={styles.root}>

      <Button variant="contained" style={styles.button} onClick={redirect}>
        <div>Sign in</div>
        <div style={{
          fontSize: "10px"
        }}>with Oauth</div>
      </Button>
      <Button variant="contained" style={styles.button} onClick={signUp}>Sign up</Button>
      <Button variant="contained" style={styles.button} onClick={signIn}>
        <div>Sign in</div>
        <div style={{
          fontSize: "10px"
        }}>no Oauth</div>
      </Button>

      <SignUpDialog
        openUp={openUp}
        setOpenUp={setOpenUp}
        sha256={sha256}
        base64URLEncode={base64URLEncode}
      />

      <SignInDialog
        openUp={openIn}
        setOpenUp={setOpenIn}
        sha256={sha256}
        base64URLEncode={base64URLEncode}
        redirect={noOauthRedirect}
      />

    </div>
  )
}

const Tokens = ({
  oauth
}) => {
  const {setOauth} = useContext(Context)
  const styles = useStyles(useTheme())
  const {id_token} = oauth
  const id_payload = id_token.split('.')[1]
  const {email} = JSON.parse(atob(id_payload))
  const logout = (e) => {
    e.stopPropagation()
    setOauth(null)
  }

  return (
    <div css={styles.root}>
      Welcome {email} <Link onClick={logout} color="secondary">logout</Link>
    </div>
  )
}

export default ({
  onUser
}) => {
  const styles = useStyles(useTheme())
  const history = useHistory();
  // const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const {oauth, setOauth} = useContext(Context)
  const config = {
    authorization_endpoint: 'http://127.0.0.1:5556/dex/auth',
    token_endpoint: 'http://127.0.0.1:5556/dex/token',
    client_id: 'webtech-frontend',
    redirect_uri: 'http://127.0.0.1:3000',
    scope: 'openid%20email%20offline_access',
  }
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  // is there a code query parameters in the url
  if (!code) { // no: we are not being redirected from an oauth server
    if (!oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32))
      setCookie('code_verifier', codeVerifier)
      return (
        <Redirect codeVerifier={codeVerifier} config={config} css={styles.root} />
      )
    } else { // yes: user is already logged in, great, is is working
      return (
        <Tokens oauth={oauth} css={styles.root} />
      )
    }
  } else { // yes: we are coming from an oauth server
    const codeVerifier = cookies.code_verifier
    useEffect( () => {
      const fetch = async () => {
        try {
          const {data} = await axios.post(
            config.token_endpoint
          , qs.stringify ({
            grant_type: 'authorization_code',
            client_id: `${config.client_id}`,
            code_verifier: `${codeVerifier}`,
            redirect_uri: `${config.redirect_uri}`,
            code: `${code}`,
          }))
          removeCookie('code_verifier')
          setOauth(data)
          // window.location = '/'
          history.push('/')
        } catch (err) {
          console.error(err)
        }
      }
      fetch()
    })
    return (
      <div css={styles.root}>Loading tokens</div>
    )
  }
}
