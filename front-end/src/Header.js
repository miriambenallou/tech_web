
import { useContext } from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import Context from './Context'

const useStyles = (theme) => ({
  header: {
    textAlign:'center',
    fontSize: '35px',
    padding: theme.spacing(1),
    height : '40px',
    backgroundColor: 'rgba(45,45,45)',
    flexShrink: 0,

    '& #typo' : {
      position : 'relative',
      top : '-8px',
      fontSize : '10px',
    },
    '& .container': {
      display : 'flex',
      justifyContent: 'space-between',
    },

    '& #container_home' : {
      position : "relative",
      display: 'flex',

    },

    '& #chat' : {
      position: 'relative',
      margin: '15px',
      fontSize : '25px',
      top : '-10px'
    },

    '& #home' : {
      fontSize:'30px',
    },

    '& #home:hover': {
      position: "relative",
      backgroundColor: "rgba(255,255,255,.3)",
      borderRadius: '5px',
    },

    '& .container-nooauth': {
      position: 'relative',
      alignSelf:'center',

    },
    '& #logout' : {
      fontSize: "30px",
    },

    '& #logout:hover' : {
      position: "relative",
      backgroundColor: "rgba(255,255,255,.3)",
      borderRadius: '5px',
    },
  },
  headerLogIn: {
    backgroundColor: 'red',
  },
  headerLogOut: {
    backgroundColor: 'blue',
  },

  menu: {
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',
    },
  }
})

export default ({
  drawerToggleListener
}) => {
  const styles = useStyles(useTheme())
  const {
    oauth, setOauth,
    drawerVisible, setDrawerVisible
  } = useContext(Context)
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible)
  }
  const onClickLogout = (e) => {
    e.stopPropagation()
    setOauth(null)
  }
  return (
    <header css={styles.header}>
    <IconButton
       color="inherit"
       aria-label="open drawer"
       onClick={drawerToggle}
       css={styles.menu}
     >
       <MenuIcon />
     </IconButton>
    <div class={oauth ? "container" : "container-nooauth"}>
      <div id="container_home">

            {
            oauth ?   <div>  <HomeIcon id="home"></HomeIcon></div> : ""
            }

           <div id="chat"> ECE Chat </div>
      </div>
      {
        oauth ?
          <div>
            <span>
               {oauth.email}
            </span>
          </div>

        :
          <div> </div>
      }

      {
        oauth ?
        <div>
            <ExitToAppIcon id="logout" onClick={onClickLogout}>
            </ExitToAppIcon>
            <Typography id="typo" color="textPrimary">
                 Log out
             </Typography>
        </div>
        :
        <div> </div>
      }
   </div>


    </header>
  );
}
