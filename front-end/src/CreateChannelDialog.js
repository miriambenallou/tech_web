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
  dialog,
  setDialog,
  oauth
}) => {
  const handleClose = () => {
    setDialog({
      open: false
    })
  }
  const handleSave = async () => {
    let name = document.getElementById("channel-name").value

    if (name !== dialog.name) {
      console.log("SAVE")
      await axios.put("http://127.0.0.1:3001/channels/" + dialog.channelId, {
        name: name,
        creator: dialog.creator,
        members: dialog.members
      })
      document.location = document.location
    }
    setDialog({
      open: false
    })
  }

  return (
    <Dialog
      open={dialog.open}
      onClose={handleClose}
      style={{borderRadius:'100px'}}
    >
      <DialogTitle id="edit-channel">Create channels()</DialogTitle>
      <DialogContent>
        <CssTextField
          margin="dense"
          id="channel-name"
          label="Channel name"
          type="text"
          fullWidth
          variant="outlined"
          defaultValue="Channel name"
          disabled={
            (oauth.email === dialog.creator) ? false : true
          }
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="secondary">Cancel</Button>
        <Button variant="contained" onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
