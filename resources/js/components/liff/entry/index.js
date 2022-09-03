import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { LiffProvider, LiffContext } from '../liff-context';

const styles = (theme) => ({
  root: {
    position: 'relative',
    padding: '6vw',
    height: '100vh',
    overflowX: 'hidden',
    overflowY: 'scroll',
    backgroundColor: '#EEECED',
  }
});

function MyComponent(props) {
  const { classes } = props;
  const { liffActions, liffState } = useContext(LiffContext);

  return (
    <div className={classes.root}>
      <div>Entry</div>
    </div>
  )
}

MyComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyComponent);
