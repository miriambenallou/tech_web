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
}) => {
    const [message, setMessage] = useState('')
    const [original, setOriginal] = useState('')

    const handleClose = () => {
        setMessage('')
        setOriginal('')
        setDialog({
            open: false
        })
    }

    const handleEnterDialog = () => {
        setMessage(dialog.content)
        setOriginal(dialog.content)
    }

    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleSave = async () => {
        if (original === message) {
            handleClose()
            return
        } else {
            const nooauth = oauth.userType === 'no-oauth'
            await axios.put('http://127.0.0.1:3001/channels/' + dialog.message.channelId + '/messages', {
                headers: {
                    'Authorization': `Bearer ${oauth.access_token}`,
                    'no-oauth': nooauth,
                },
                params: {
                    email: oauth.email,
                    message: {
                        content: message,
                        creation: dialog.message.creation,
                        author: dialog.message.author,
                        name: dialog.message.name,
                    },
                }
            })
        }
        handleClose()
        document.location = document.location
    }

    const handleDelete = async () => {
        const nooauth = oauth.userType === 'no-oauth'
        await axios.delete(`http://127.0.0.1:3001/channels/${dialog.message.channelId}/messages`, {
            headers: {
                'Authorization': `Bearer ${oauth.access_token}`,
                'no-oauth': nooauth,
            },
            params: {
                email: oauth.email,
                message: dialog.message,
            }
        })
        handleClose()
        document.location = document.location
    }

    return (
        <Dialog
            open={dialog.open}
            onClose={handleClose}
            css={{
                '& .MuiPaper-root': {
                    position:'fixed',
                    width:'80%',
                    right:'-15px',
                    maxWidth: 'none',
                },
                borderRadius:'100px',
            }}
            onEnter={handleEnterDialog}
        >
            <DialogTitle id="edit-channel">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
            >
                <div>Edit message</div>
                <Button 
                    variant="contained" 
                    onClick={handleDelete} 
                    color='secondary' 
                    style={{
                        textTransform:'none',
                    }}
                >
                    Delete message
                </Button>
            </div>
            </DialogTitle>
            <DialogContent style={{
                overflow:'none',
            }}>
                <CssTextField
                    margin="dense"
                    id="message"
                    label="Message editor"
                    type="text"
                    fullWidth
                    multiline
                    rowsMax={10}
                    variant="outlined"
                    value={message}
                    onChange={handleChangeMessage}
                />
            </DialogContent>
            <DialogActions style={{
                    display:'flex',
                    justifyContent:'space-between',
                }}>
                <Button 
                    variant="contained" 
                    onClick={handleClose} 
                    color="secondary" 
                    style={{
                        width:'25%', 
                        textTransform:'none',
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleSave} 
                    color="primary" 
                    style={{
                        width:'25%',
                        textTransform:'none',
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}
