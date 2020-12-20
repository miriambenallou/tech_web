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
import { Drawer, List, Checkbox, FormControl, FormControlLabel } from '@material-ui/core';

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

const CssCheckbox = withStyles({
    root: {
        color: 'rgb(0, 128, 0)',
        '&:hover': {
            backgroundColor: 'rgba(0, 128, 0, 0.1)',
        },
        '&$checked': {
            color: 'rgb(0, 128, 0)',
        },
    }
})((props) => <Checkbox color="default" {...props} />)

export default ({
  open,
  setOpen,
  oauth,
  users
}) => {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([oauth.email])
  const [message, setMessage] = useState('')

  const handleClose = () => {
    setName('')
    setSelected([])
    setMessage('')
    setOpen(false)
  }
  const handleCreate = async () => {
      if (name.length === 0) {
          setMessage("Name can't be empty.")
          return
      }
      setMessage("")
      let arr = []
      
      for (let obj of selected) {
          if (obj.indexOf('@') === -1) { // Not an email.
            for (let usr of users) { // Loop through existing users.
                if (obj === (usr.user.firstname + ' ' + usr.user.lastname)) { // If same user --> add his email to the array.
                    arr.push(usr.user.email)
                    break
                }
            }
        } else { // Already an email so add it to the array.
            arr.push(obj)
        }
    }

    await axios.post('http://127.0.0.1:3001/channels', {}, {
      headers: {
        'Authorization': `Bearer ${oauth.access_token}`,
        'no-oauth': true
      },
      params: {
        email: oauth.email,
        channel: {
            name: name,
            members: arr,
        }
      }
    })

    setName("")
    setMessage("")
    setSelected([])
    setOpen(false)
    window.location = window.location
  }

  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  
  const handleChecked = (e) => {
    if (e.target.checked) {
        setSelected([...selected, e.target.labels[0].children[1].innerText])
    } else {
        let arr = []
        for (let txt of selected) {
            if (txt !== e.target.labels[0].children[1].innerText) {
                arr.push(txt)
            }
        }
        setSelected(arr)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      style={{borderRadius:'100px'}}
    >
      <DialogTitle id="edit-channel">Create channels</DialogTitle>
      <DialogContent>
        <CssTextField
          margin="dense"
          id="channel-name"
          label="Channel name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={handleChangeName}
          error={message.length > 0}
          helperText={message.length > 0 ? message : ''}
        />
        <div>
            <List
                style={{
                    position: 'relative',
                    overflow: 'auto',
                    minHeight: '100px',
                    maxHeight: '200px',
                    minWidth: '300px',
                    maxWidth: '500px',
                    border: '1px solid grey',
                    marginTop: '5px',
                }}
            >
                <FormControl>
                    {
                        users.map( (user) => {
                            return (
                                <FormControlLabel
                                    control={
                                        (user.user.email === oauth.email) ? 
                                        <CssCheckbox
                                            checked='true'
                                        />
                                        :
                                        <Checkbox
                                            onClick={handleChecked}
                                        />
                                    }
                                    label={
                                        user.bymail ? 
                                            user.user.email
                                            :
                                            user.user.firstname + ' ' + user.user.lastname
                                    }
                                    labelPlacement="end"
                                    style={{
                                        width: '100%',
                                        marginLeft: '0px',
                                        marginRight: '0px',
                                        justifyContent: 'start',
                                        maxWidth: '300px'
                                    }}
                                />
                            )
                        })
                    }
                </FormControl>
            </List>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="secondary">Cancel</Button>
        <Button variant="contained" onClick={handleCreate} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  )
}
