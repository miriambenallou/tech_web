import React from 'react';
import {useState, useContext} from 'react';

import axios from 'axios'

import Context from './Context'

import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Gravatar from 'react-gravatar'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

const gravatars = [
  "wavatar", "monsterid", "identicon", "retro", "robohash", "mp"
]

const languages = [
  {
    value: 'FR',
    label: 'French',
  },
  {
    value: 'AR',
    label: 'Arabic',
  },
  {
    value: 'ENG',
    label: 'English',
  },
  {
    value: 'IT',
    label: 'Italian',
  },
];

const useStyles = makeStyles((theme) => ({

  root: {
    alignSelf: 'center',
    position: "relative",
    alignContent: 'center',

    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',

    },
    
    "& .MuiList-root" : {
      display: 'flex',
      backgroundColor:'white',
      flexDirection: 'column',
      alignItems: 'center',
    },

    '& #button' : {
      position: 'relative',
      float: 'right',
      justifySelf: "self-end",
      marginBottom: "20px",
      marginTop: "50px",

      '& .MuiButton-root': {
        margin: 5
      }
    },

    '& #container': {
      borderColor: "red",
      backgroundColor: "lightslategrey",
      boxShadow: '5px 2px 2px grey',
      justifyContent: "center",
      width : "550px",
      borderRadius: "20px",
      display: 'grid',
      height:"100%",

      '& .MuiTextField-root': {
        margin: 5
      }


    },
    '& #name-container': {
      display : 'flex',
      justifyContent:"space-evenly",

      '& .MuiInputBase-root' : {
         margin: "5px",
      },

      "& #second_txt": {
        marginLeft:"5px",
        alignSelf:"right",
      },

    },

    '& #email': {
      '&.MuiInputBase-root': {
        width:"100%",
      },
    },

    '& #avatar': {
      position:"relative",
      alignItems: 'center',
      textAlign: '-webkit-center',
      padding: '15px',
    //  marginBottom:,
      display:'flex',
      marginTop:5,
      flexDirection:'column',
      alignItems:"center",

      "& #avatar_options": {
        '& > div' : {
          margin: '15px',
        },
        display: 'flex',
      },
      '& #gravatar': {
        borderRadius:'50%',
      },
      '& .MuiAvatar-colorDefault' : {
        height: '70px',
        width: '70px',
      },
    },
  },
}));

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
        borderColor: 'dark-grey',
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

let manageOauthConn_lock = 0

const manageOauthConn = async (oauth) => {
  if (manageOauthConn_lock > 1) return

  await axios.post("http://127.0.0.1:3001/users", {
      email: oauth.email,
      firstname: '',
      lastname: '',
      password: '',
      type: 'oauth'
  })
}

export default ({
  oauth
}) => {

  const classes = useStyles();
  const [gravatar, setGravatar] = useState (oauth.gravatar ? oauth.gravatar : 'monsterid')
  const [language, setLanguage] = useState('ENG');
  const [first, setFirst] = useState(oauth.firstname)
  const [last, setLast] = useState(oauth.lastname)
  const [email, setEmail] = useState(oauth.email)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState({
    first: (oauth.firstname.length === 0 ? "Firstname is mandatory." : ""),
    last: (oauth.lastname.length === 0 ? "Lastname is mandatory." : ""),
    email: "",
  })
  const {setNoOauth, setOauth} = useContext(Context)

  const handleChangeFile = (e) => {
    console.log(e.target.files[0])
  }

  const handleChangeSelect = (e) => {
    setGravatar(e.target.id)
  }

  const handleDelete = async () => {
    setOpen(true)
  }

  const handleDeleteSure = async () => {
    const nooauth = oauth.userType === 'no-oauth'
    await axios.delete(`http://127.0.0.1:3001/users/${oauth.email}`, {
      headers: {
        'Authorization': `Bearer ${oauth.access_token}`,
        'no-oauth': nooauth,
    },
    params: {
        email: oauth.email,
    }
    })
    setOpen(false)
    setOauth(null)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async () => {
    if (first.length === 0 || last.length === 0 || email.length === 0 || error.email.length > 0) {
      return
    }

    const {data} = await axios.get(`http://127.0.0.1:3001/users/${oauth.email}`, {})
    if (!data) return

    const obj = {
      user: {
        firstname: first,
        lastname: last,
        email: email,
        id: data.id,
        gravatar: gravatar,
        access_token: oauth.access_token,
      }
    }
    const nooauth = oauth.userType === 'no-oauth'
    const dt = await axios.put(`http://127.0.0.1:3001/users/${oauth.email}`, {
      headers: {
        'Authorization': `Bearer ${oauth.access_token}`,
        'no-oauth': nooauth
      },
      params: {
        email: oauth.email,
        usr: obj,
      }
    })
    console.log(dt)
    if (oauth.userType === "no-oauth") {
      setNoOauth(obj.user)
    } else {
      obj.user.id_token = oauth.id_token
      setOauth(obj.user)
    }
  }
  console.log(oauth)

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value) == false) {
      setError({
        first: error.first,
        last: error.last,
        email: "Invalid email"
      })
    } else {
      setError({
        first: error.first,
        last: error.last,
        email: ""
      })
    }
  }

  const handleChangeLang = (e) => {
    setLanguage(e.target.dataset.value)
  }

  const handleChangeFirst = (e) => {
    setFirst(e.target.value)
    if (e.target.value.length === 0) {
      setError({
        first: "Firstname is mandatory.",
        last: error.last,
        email: error.email
      })
    } else {
      setError({
        first: "",
        last: error.last,
        email: error.email
      })
    }
  }

  const handleChangeLast = (e) => {
    setLast(e.target.value)
    if (e.target.value.length === 0) {
      setError({
        last: "Lastname is mandatory.",
        first: error.first,
        email: error.email
      })
    } else {
      setError({
        last: "",
        first: error.first,
        email: error.email
      })
    }
  }

  const newUserOauth = async () => {
    manageOauthConn_lock++
    await manageOauthConn(oauth)

    const {data} = await axios.get(`http://127.0.0.1:3001/users/${oauth.email}`)
    if (data && data.firstname.length > 0) {
      setOauth({
        firstname: data.firstname,
        lastname: data.lastname,
        email: oauth.email,
        access_token: oauth.access_token,
        id_token: oauth.id_token,
        gravatar: (data.gravatar) ? data.gravatar : (oauth.gravatar ? oauth.gravatar : "monsterid"),
      })
      window.location = '/'
    }
  }

  if (oauth.firstname.length === 0) newUserOauth()

  return (
  <form className={classes.root} noValidate autoComplete="off">
    <div id="container">
      <div id= "avatar">
        <Gravatar id="gravatar" email={oauth.email} default={gravatar} />
        <input
            id="input_file"
            hidden
            accept="image/*"
            type="file"
            onChange={handleChangeFile}
        />
              <div id= "avatar_options">
              <div>
                <label htmlFor="input_file">
                <Button
                   component="div"
                   style={{textTransform:'none', marginTop:'5px'}}
                   size='small' variant="contained"
                 >
                 Upload file  </Button>
                </label>
              </div>
              <div> <p> Or </p> </div>
              <div>
                <TextField
                    id="select-gravatar"
                    select
                    value={gravatar}
                    helperText="Choose one"
                  >
                    {gravatars.map((option) => (
                        <Gravatar id={option} email={oauth.email} default={option} onClick={handleChangeSelect}/>
                    ))}
                </TextField>
              </div>
              </div>
      </div>
      <div>
        {
          oauth.firstname.length === 0 ? (
            <h4>
              Please enter your firstname and lastname to continue using this app.
            </h4>
          ) : (
            ''
          )
        }
      </div>
      <div id="name-container">
      <CssTextField 
        variant="outlined" 
        label = "First Name" 
        value={first} 
        onChange={handleChangeFirst}
        error={error.first.length > 0}
        helperText={error.first}
      />
      <CssTextField 
        variant="outlined" 
        label="Last Name" 
        value={last} 
        onChange={handleChangeLast}
        error={error.last.length > 0}
        helperText={error.last}
      />
      </div>

      <div id="email">
      <CssTextField 
        variant="outlined" 
        label="E-mail"
        value={email}
        onChange={handleChangeEmail}
        disabled={oauth.userType !== 'no-oauth'}
        error={error.email.length > 0}
        helperText={error.email}
      />
      </div>

      <CssTextField
          id="standard-select-language"
          select
          label="Select"
          value={language}
          helperText="Please choose your language"
        >
          {languages.map((option) => (
            <MenuItem key={option.value} value={option.value} onClick={handleChangeLang} >
              {option.label}
            </MenuItem>
          ))}
      </CssTextField>

      <div id="button">

          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
          Delete Account
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
          Save
          </Button>
      </div>
     </div>
     <Dialog
      open={open}
      onClose={handleClose}
     >
       <DialogActions>
        <Button variant="contained" onClick={handleDeleteSure} color="secondary">Delete account</Button>
        <Button variant="contained" onClick={handleClose} color="primary">Cancel</Button>
      </DialogActions>
     </Dialog>
   </form>
  );
}
