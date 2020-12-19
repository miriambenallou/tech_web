
/** @jsx jsx */
import { jsx } from '@emotion/core'

const styles = {
  footer: {
    height: '20px',
    display : 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(45,45,45)',
    flexShrink: 0,
    position:'absolute',
    bottom:'0px',
    width:"100%",
  },
}

export default () => {
  return (
    <footer style={styles.footer}>
        <span> &copy; Pierre Herduin & Miriam Benallou </span>

    </footer>
  );
}
