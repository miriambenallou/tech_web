import React from 'react';
import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Gravatar from 'react-gravatar'

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
      justifyContent:"center",
      "& #avatar_options": {
        '& > div' : {
          margin: '15px',
        },
        display: 'flex',
      },
      '& #gravatar': {
        borderRadius:'50%'
      },
      '& .MuiAvatar-colorDefault' : {
        height: '70px',
        width: '70px',
      },
    },
  },

}));

export default ({oauth}) => {

  const classes = useStyles();
  const [gravatar, setGravatar] = useState ('monsterid')
  const [language, setLanguage] = useState('ENG');

  const handleChangeFile = (e) => {
    console.log(e.target.files[0])
  }

  return (
  <form className={classes.root} noValidate autoComplete="off">
    <div id="container">

      <div id= "avatar">

              <Gravatar id="gravatar" email={oauth.email} default="monsterid"/>
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
                    id="standard-select-language"
                    select
                    value={gravatar}
                    
                    helperText="Choose one"
                  >
                    {gravatars.map((option) => (
                        <Gravatar email={''} default={option} />
                    ))}
                </TextField>
              </div>
              </div>



      </div>


      <div id="name-container">
      <TextField variant="outlined" required id="standard-required" label = "First Name" defaultValue="First Name" />
      <TextField id="second_txt" variant="outlined" required  label="Last Name" defaultValue="Last Name" />
      </div>

      <div id="email">
      <TextField variant="outlined" required id="standard-required" label="E-mail" defaultValue="example@yahoo.fr" />
      </div>

      <TextField
          id="standard-select-language"
          select
          label="Select"
          value={language}
          helperText="Please choose your language"
        >
          {languages.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>

      <div id="button">

          <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}>
          Discard
          </Button>

          <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SaveIcon />}
          >
          Save
          </Button>

      </div>

     </div>
   </form>
  );
}
