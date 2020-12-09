import {useState} from 'react';

import axios from 'axios'
/** @jsx jsx */
import { jsx } from '@emotion/core'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  withStyles,
} from '@material-ui/core/styles';

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

export default ({
  openUp,
  setOpenUp,
  sha256,
  base64URLEncode,
  redirect
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  })

  const handleClose = () => {
    setOpenUp(false)
    setErrorMessages({
      email: "",
      password: "",
    })
  }

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleSubmit = async () => {
    let email     = document.getElementById("email")
    let password  = document.getElementById("password")

    let pass =  base64URLEncode(sha256(password.value))
   const {data} = await axios.get("http://127.0.0.1:3001/users/"+ email.value, {})

   console.log(data)
   if (data !== null) { // The user exists.
     if (data.password === pass) { // Password corresponds.
       setOpenUp(false)
       redirect(data)
     } else { // Password incorrect.
       setErrorMessages({
         email: "",
         password: "Password incorrect !"
       })
     }
   } else { // No user with such email.
     setErrorMessages({
         email: "There is no account corresponding to this email address.",
         password: errorMessages.password,
     })
   }
  }

  return (
    <Dialog
      open={openUp}
      onClose={handleClose}
      style={{borderRadius:'100px'}}
    >
      <DialogTitle id="dialog-title">Sign up</DialogTitle>
      <DialogContent>
        <CssTextField
          margin="dense"
          id="email"
          label="e-mail address"
          type="email"
          fullWidth
          variant="outlined"
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
  )
}
