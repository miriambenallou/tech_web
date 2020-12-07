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

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  ThemeProvider,
  useTheme,
  withTheme,
  withStyles,
  createMuiTheme
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
    margin: "50px 50px 50px 50px",
    padding: "20px 50px 20px 50px",
  }
})

const CssTextField = withStyles({
  root: {
    '& .Mui-error': {
      color: '#f44336'
    },
    '& .MuiFormLabel-root.Mui-error': {
      color: '#f44336'
    },
    '& label.Mui-focused': {
      color: 'green'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: '#f44336'
      },
      '& fieldset': {
        borderColor: 'grey',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    }
  },
})(TextField)

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
  const [open, setOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })


  const signUp = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setErrorMessages({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    })
  }
  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleFirstName = (e) => {
    if (e.target.value === "") {
      setErrorMessages({
        firstname: "First name can't be empty.",
        lastname: errorMessages.lastname,
        email: errorMessages.email,
        password: errorMessages.password,
      })
    } else if (errorMessages.firstname.length > 0) {
      setErrorMessages({
        firstname: "",
        lastname: errorMessages.lastname,
        email: errorMessages.email,
        password: errorMessages.password,
      })
    }
  }

  const handleLastName = (e) => {
    if (e.target.value === "") {
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: "Last name can't be empty.",
        email: errorMessages.email,
        password: errorMessages.password,
      })
    } else if (errorMessages.lastname.length > 0) {
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: "",
        email: errorMessages.email,
        password: errorMessages.password,
      })
    }
  }

  const handlePassword = (e) => {
    if (e.target.value.length < 6) {
      setErrorMessages({
        firstname:errorMessages.firstname,
        lastname : errorMessages.lastname,
        email: errorMessages.email,
        password: "Password must have minimum 6 characters.",
      })
    } else if (errorMessages.password.length >= 6) {
      setErrorMessages({
        firstname:errorMessages.firstname,
        lastname : errorMessages.lastname,
        email: errorMessages.email,
        password: "",
      })
    }
  }

  const handleEmail = (e) => {
    if (e.target.value === "") {
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: errorMessages.lastname,
        email: "Email can't be empty.",
        password: errorMessages.password,
      })
    } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value) === false) {
      /*
      Regex expression has been found here : https://www.w3resource.com/javascript/form/email-validation.php
      */
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: errorMessages.lastname,
        email: "Email is invalid.",
        password: errorMessages.password,
      })
    } else if (errorMessages.email.length > 0) {
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: errorMessages.lastname,
        email: "",
        password: errorMessages.password,
      })
    }
  }

  const handleSubmit = () => {
    let firstname = document.getElementById("first-name")
    let lastname  = document.getElementById("last-name")
    let email     = document.getElementById("email")
    let password  = document.getElementById("password")

    if (firstname.value.length > 0 &&
         lastname.value.length > 0 &&
         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value) === true &&
         password.value.length > 6
       ) {
         setOpen(false)
    } else {
      handlePassword({target: password})
      handleEmail({target: email})
      handleLastName({target: lastname})
      handleFirstName({target: firstname})
    }
  }

  return (
    <div css={styles.root}>

      <Button variant="contained" style={styles.button} onClick={redirect}>Sign in</Button>
      <Button variant="contained" style={styles.button} onClick={signUp}>Sign up</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        style={{borderRadius:'100px'}}
      >
        <DialogTitle id="dialog-title">Sign up</DialogTitle>
        <DialogContent>
          <CssTextField
            margin="dense"
            id="first-name"
            label="First name"
            type="text"
            variant="outlined"
            color=""
            onChange={handleFirstName}
            error={errorMessages.firstname.length > 0 ? true : false}
            helperText={errorMessages.firstname.length > 0 ? errorMessages.firstname : ""}
          />
          <CssTextField
            margin="dense"
            id="last-name"
            label="Last name"
            type="text"
            variant="outlined"
            onChange={handleLastName}
            error={errorMessages.lastname.length > 0 ? true : false}
            helperText={errorMessages.lastname.length > 0 ? errorMessages.lastname : ""}
          />
          <CssTextField
            margin="dense"
            id="email"
            label="e-mail address"
            type="email"
            fullWidth
            variant="outlined"
            onChange={handleEmail}
            error={errorMessages.email.length > 0 ? true : false}
            helperText={errorMessages.email.length > 0 ? errorMessages.email : ""}
          />
          <CssTextField
            margin="dense"
            id="password"
            label="Password"
            type={passwordVisible ? "text" : "password"}
            fullWidth
            variant="outlined"
            onChange={handlePassword}
            error={errorMessages.password.length > 0 ? true : false}
            helperText={errorMessages.password.length > 0 ? errorMessages.password : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                    edge="end"
                  >
                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="secondary">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">Sign up</Button>
        </DialogActions>
      </Dialog>

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
  if(!code){ // no: we are not being redirected from an oauth server
    if(!oauth){
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
        }catch (err) {
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
