import {} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {useState, useContext} from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import {ReactComponent as ChannelIcon} from './icons/channel.svg';
import {ReactComponent as FriendsIcon} from './icons/friends.svg';
import {ReactComponent as SettingsIcon} from './icons/settings.svg';
import {useHistory} from 'react-router-dom'
import Context from './Context'

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'block',
    backgroundImage: 'url("background_tech_main.jpg")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundAttachement: "fixed",
    backgroundSize: "cover",

    '& #info': {
      color: '#000',
      marginTop: '30%',
      backgroundColor: 'rgba(45,45,45,.7)',
      width: '45%',
      margin: '10% auto 0% auto',
      borderRadius: '15px',
    },

    '& .MuiGrid-item > :hover ': {
        backgroundColor: "rgba(255,255,255,.3)",
        borderRadius: '5px',
    },
    '& .MuiTypography-root': {
      width: "70%",
      padding: '5px',
      textAlign:'center',
    //  marginTop: '5%',
      marginLeft: '15%',
    //  margin: 'auto',
    },
  },
  card: {
    textAlign: 'center',
    position: "relative",
    alignItems:'center',
    //marginLeft: '15%',
  //  marginRight: '15%',
    marginTop: '5%',
  },
  icon: {
    width: '30%',
    fill: '#fff',
    '& svg :hover' : {
      display: 'none',
      position: "relative",
      backgroundColor: "rgba(255,255,255,.3)",
      borderRadius: '30%',
  },

  //buttons: {
//    marginTop: '30%',
//  },
  welcome: {
    maxWidth: '200px',
  },
  nmbOfChannels: {
    width: 'fit-content',
  },
  total: {
    width: 'fit-content',
  }

}}
)



export default () => {
  const history = useHistory();
  const styles = useStyles(useTheme())
  const oauth = useContext(Context)
  const goSettings = () => {
    history.push('/settings')
  }
  return (

      <div id="icon_container" css={styles.root}>
      <div id="info" >
      <Typography
        style = {{fontSize:'1.5rem'}} css={styles.welcome}
        color="textPrimary">
        Welcome, @ email {oauth.email}
      </Typography >
        <Typography
          style = {{fontSize:'1.2rem'}}
          css={styles.nmbOfChannels}
          color="textPrimary">
          Number of Channels created :
        </Typography>
        <Typography
          style = {{fontSize:'1.2rem'}}
          css={styles.total}
          color="textPrimary">
          Total number of channels :
        </Typography>
      </div>
        <Grid
          css={styles.buttons}
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >
          <Grid item xs>
            <div css={styles.card}>
              <ChannelIcon css={styles.icon} />
              <Typography color="textPrimary">
                Create channels
              </Typography>
            </div>
          </Grid>

          <Grid item xs>
            <div css={styles.card}>
              <SettingsIcon css={styles.icon} onClick={goSettings}/>
              <Typography color="textPrimary">
                Settings
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
  );
}
