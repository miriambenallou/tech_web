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

import { 
  List, Checkbox, FormControl, FormControlLabel, ListSubheader,
} from '@material-ui/core';

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
  dialog,
  setDialog,
  oauth,
  users
}) => {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState({})

  const handleClose = () => {
    setName('')
    setMessage('')
    setSelected([])
    setChecked({})
    setDialog({
      open: false
    })
  }

  const handleEnterDialog = () => {
    setName(dialog.name)
    setMessage('')

    let arr = []
    let obj = {}

    for (let usr of dialog.members) {
      for (let i = 0; i < users.length; i++) {
        if (usr === users[i].user.email) {
          if (users[i].bymail) {
            arr.push(usr)
            obj[usr] = true
          } else {
            const s = users[i].user.firstname + ' ' + users[i].user.lastname
            arr.push(s)
            obj[s] = true
          }
          break
        }
      }
    }

    setChecked(obj)
    setSelected(arr)
  }

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChecked = (e) => {
    if (e.target.checked) {
      setSelected([...selected, e.target.labels[0].children[1].innerText])
      let obj = {...checked}
      obj[e.target.labels[0].children[1].innerText] = true
      setChecked(obj)
    } else {
        let arr = []
        for (let txt of selected) {
            if (txt !== e.target.labels[0].children[1].innerText) {
                arr.push(txt)
            }
        }
        let obj = {...checked}
        obj[e.target.labels[0].children[1].innerText] = false
        setChecked(obj)
        setSelected(arr)
    }
  }

  const handleSave = async () => {
    if (name.length === 0) {
      setMessage("Name can't be empty.")
      return
    }
    setMessage('')

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

    await axios.put(`http://127.0.0.1:3001/channels/${dialog.channelId}`, {
      headers: {
        'Authorization': `Bearer ${oauth.access_token}`,
        'no-oauth': true,
      },
      params: {
        email: oauth.email,
        channel: {
          name: name,
          creator: dialog.creator,
          members: arr,
        }
      }
    })
    document.location = document.location
    handleClose()
  }

  const handleDelete = async () => {
    await axios.delete('http://127.0.0.1:3001/channels/' + dialog.channelId, {
      headers: {
        'Authorization': `Bearer ${oauth.access_token}`,
        'no-oauth': true
      },
      params: {
          email: oauth.email,
      }
    })
    document.location = document.location
    handleClose()
  }

  return (
    <Dialog
      open={dialog.open}
      onClose={handleClose}
      style={{borderRadius:'100px'}}
      onEnter={handleEnterDialog}
    >
      <DialogTitle id="edit-channel">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>Edit Channel</div>
          <Button variant="contained" onClick={handleDelete} color='secondary' >Delete</Button>
        </div>
      </DialogTitle>
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
          disabled={
            (oauth.email === dialog.creator) ? false : true
          }
          error={message.length > 0}
          helperText={message.length > 0 ? message : ''}
        />
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
                          checked={checked[
                            user.bymail ? 
                              user.user.email
                              :
                              user.user.firstname + ' ' + user.user.lastname
                            ] ? true : false}
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
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="secondary">Cancel</Button>
        <Button variant="contained" onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
