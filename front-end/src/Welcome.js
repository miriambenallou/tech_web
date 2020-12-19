import {} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {ReactComponent as ChannelIcon} from './icons/channel.svg';
import {ReactComponent as FriendsIcon} from './icons/friends.svg';
import {ReactComponent as SettingsIcon} from './icons/settings.svg';
import {useHistory} from 'react-router-dom'

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    backgroundImage: 'url("background_tech_main.jpg")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundAttachement: "fixed",
    backgroundSize: "cover",

    '& .MuiGrid-item > :hover ': {
        backgroundColor: "rgba(255,255,255,.3)",
        borderRadius: '5px',
    }
  },
  card: {
    textAlign: 'center'
  },
  icon: {
    width: '30%',
    fill: '#fff',
    '& svg :hover' : {
      display: 'none',
      position: "relative",
      backgroundColor: "rgba(255,255,255,.3)",
      borderRadius: '5px',
  }

}}
)



export default () => {
  const history = useHistory();
  const styles = useStyles(useTheme())

  const goSettings = () => {
    history.push('/settings')
  }
  return (
    <div id="icon_container" css={styles.root}>
      <Grid
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
            <FriendsIcon css={styles.icon} />
            <Typography color="textPrimary">
              Invite friends
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
