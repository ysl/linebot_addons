import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import ReactPlayer from 'react-player';
import { LiffProvider, LiffContext } from '../liff-context';

const styles = (theme) => ({
  root: {
    position: 'relative',
    height: '100vh',
    overflowX: 'hidden',
    overflowY: 'scroll',
    backgroundColor: '#EEECED',
    fontWeight: 100,
    '& .content': {
      position: 'fixed',
      top: 0,
      '& .video-wrap': {
        width: '100vw',
        height: '56vw',
      },
    },
    '& .dummy': {
      position: 'absolute',
      top: 0,
      zIndex: 2,
      width: '100%',
      height: '300vh',
    },
  }
});

let containerRef = null;
let player = null;
let isPlaying = false;

function MyComponent(props) {
  const { classes } = props;
  const { liffActions, liffState } = useContext(LiffContext);
  const [containerScrollRatio, setContainerScrollRatio] = useState(0);
  const setContainerRef = el => {
    if (el) {
      containerRef = el;
      el.addEventListener('scroll', () => {
        const value = containerRef.scrollTop / (containerRef.scrollHeight - containerRef.clientHeight);
        let ratio = Number(value.toFixed(2)); // 0.01 - 0.99
        if (ratio > 0.99) { // Don't greate 0.99, or the mobile will failed.
          ratio = 0.99;
        }
        setContainerScrollRatio(ratio);
      });
    }
  }

  const ref = (p) => {
    player = p;
    window.player = p;
  }

  const onVideoReady = () => {

  }
  const onVideoStart = () => {
    // Notice: this function only call once.
    isPlaying = true;
  }
  const onVideoEnd = () => {
    isPlaying = false;
    // setPlayButtonShowing(true); // Disable feature
  }
  const onProgress = (c) => {
    console.log(c)
  }
  const playVideo = () => {
    player.getInternalPlayer().play();
    isPlaying = true;
    // setPlayButtonShowing(false); // Disable feature
  }

  useEffect(() => {
    if (containerScrollRatio) {
      const time = containerScrollRatio * player.getDuration();
      console.log(`Play time: ${time}`);
      player.getInternalPlayer().currentTime = time;
    }
  }, [containerScrollRatio])

  return (
    <div className={classes.root} ref={setContainerRef}>

      <div className="content">
        <div>Ratio: {containerScrollRatio}</div>
        <div className="video-wrap">
          <ReactPlayer url={assetUrl('/video/fingers.mp4', true)} width="100%" height="100%" ref={ref} playing={false} loop={false} playsinline={true}
            onReady={onVideoReady} onStart={onVideoStart} onEnded={onVideoEnd} onProgress={onProgress} controls={false} light={false} muted={false} />
        </div>
      </div>

      <div className="dummy"></div>

    </div>
  )
}

MyComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyComponent);

/**
 * Not work in Chrome
 * Workable: iOS LINE
 * Not smooth: Firefox
 */