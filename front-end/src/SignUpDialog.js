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
  base64URLEncode
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordRepeatVisible, setPasswordRepeatVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordRepeat: "",
  })

  const handleClose = () => {
    setPasswordVisible(false)
    setPasswordRepeatVisible(false)
    setOpenUp(false)
    setErrorMessages({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordRepeat: "",
    })
  }

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleShowPasswordRepeat = () => {
    setPasswordRepeatVisible(!passwordRepeatVisible)
  }

  const handleFirstName = (e) => {
    if (e.target.value === "") {
      setErrorMessages({
        firstname: "First name can't be empty.",
        lastname: errorMessages.lastname,
        email: errorMessages.email,
        password: errorMessages.password,
        passwordRepeat: errorMessages.passwordRepeat
      })
    } else if (errorMessages.firstname.length > 0) {
      setErrorMessages({
        firstname: "",
        lastname: errorMessages.lastname,
        email: errorMessages.email,
        password: errorMessages.password,
        passwordRepeat: errorMessages.passwordRepeat
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
        passwordRepeat: errorMessages.passwordRepeat
      })
    } else if (errorMessages.lastname.length > 0) {
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: "",
        email: errorMessages.email,
        password: errorMessages.password,
        passwordRepeat: errorMessages.passwordRepeat
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
        passwordRepeat: errorMessages.passwordRepeat
      })
    } else if (errorMessages.password.length >= 6) {
      setErrorMessages({
        firstname:errorMessages.firstname,
        lastname : errorMessages.lastname,
        email: errorMessages.email,
        password: "",
        passwordRepeat: errorMessages.passwordRepeat
      })
    }
  }

  const handlePasswordRepeat = (e) => {
    let rept = e.target.value
    let pass = document.getElementById("password").value

    if (rept !== pass) {
      setErrorMessages({
          firstname:errorMessages.firstname,
          lastname : errorMessages.lastname,
          email: errorMessages.email,
          password: errorMessages.password,
          passwordRepeat: "The passwords are different."
      })
    } else {
      setErrorMessages({
          firstname:errorMessages.firstname,
          lastname : errorMessages.lastname,
          email: errorMessages.email,
          password: errorMessages.password,
          passwordRepeat: ""
      })
    }
  }

  const handleEmail = (e) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value) === false) {
      /*
      Regex expression has been found here : https://www.w3resource.com/javascript/form/email-validation.php
      */
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: errorMessages.lastname,
        email: "Email is invalid.",
        password: errorMessages.password,
        passwordRepeat: errorMessages.passwordRepeat
      })
    } else if (errorMessages.email.length > 0) {
      setErrorMessages({
        firstname: errorMessages.firstname,
        lastname: errorMessages.lastname,
        email: "",
        password: errorMessages.password,
        passwordRepeat: errorMessages.passwordRepeat
      })
    }
  }

  const handleSubmit = async () => {
    let firstname = document.getElementById("first-name")
    let lastname  = document.getElementById("last-name")
    let email     = document.getElementById("email")
    let password  = document.getElementById("password")
    let passwordr = document.getElementById("password-repeat")

    if (firstname.value.length > 0 &&
         lastname.value.length > 0 &&
         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value) &&
         password.value.length >= 6 &&
         password.value === passwordr.value
       ) {
         let pass =  base64URLEncode(sha256(password.value))
         const {data} = await axios.post("http://127.0.0.1:3001/users", {
           email: email.value,
           firstname: firstname.value,
           lastname: lastname.value,
           password: pass,
           type: "no-oauth"
         })

         if (data !== null) {
           setOpenUp(false)
         } else {
           setErrorMessages({
               firstname: errorMessages.firstname,
               lastname: errorMessages.lastname,
               email: "Email is already used for an account.",
               password: errorMessages.password,
               passwordRepeat: errorMessages.passwordRepeat
           })
         }
    } else {
      let ferr = "", lerr = "", eerr = "", perr = "", prerr = ""

      if (firstname.value.length === 0) {
        ferr = "First name can't be empty."
      }
      if (lastname.value.length === 0) {
        lerr = "Last name can't be empty."
      }
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value) === false) {
        eerr = "Email is invalid."
      }
      if (password.value.length < 6) {
        perr = "Password must have minimum 6 characters."
      }
      if (password.value !== passwordr.value) {
        prerr = "The passwords are different."
      }
      setErrorMessages({
        firstname: ferr,
        lastname:  lerr,
        email:     eerr,
        password:  perr,
        passwordRepeat:  prerr,
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
        <CssTextField
          margin="dense"
          id="password-repeat"
          label="Repeat password"
          type={passwordRepeatVisible ? "text" : "password"}
          fullWidth
          variant="outlined"
          onChange={handlePasswordRepeat}
          error={errorMessages.passwordRepeat.length > 0 ? true : false}
          helperText={errorMessages.passwordRepeat.length > 0 ? errorMessages.passwordRepeat : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPasswordRepeat}
                  edge="end"
                >
                  {passwordRepeatVisible ? <Visibility /> : <VisibilityOff />}
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
