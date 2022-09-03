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
      '& .images': {
        position: 'relative',
        width: '100vw',
        height: '56vw',
        // background: 'center / contain no-repeat'
        '& .image': {
          position: 'absolute',
          width: '100%',
          height: '100%',
          visibility: 'hidden',
        }
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
const totalFrame = 29;

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

  const [currFrame, setCurrFrame] = useState(1);
  // const preloadImage = (src) => {
  //   return new Promise((r) => {
  //     const image = new Image();
  //     image.onload = r;
  //     image.onerror = r;
  //     image.src = src;
  //   });
  // }
  // const preloadImages = async () => {
  //   for (let i = 1; i <= totalFrame; i++) {
  //     await preloadImage(assetUrl(`/images/fingers-frames/ezgif-frame-${imageFrame.toString().padStart(3, '0')}.png`));
  //   }
  // }

  useEffect(() => {
    if (containerScrollRatio) {
      const time = containerScrollRatio * player.getDuration();
      console.log(`Play time: ${time}`);
      player.getInternalPlayer().currentTime = time;

      // Set image frame.
      const n = Math.ceil((totalFrame) * containerScrollRatio);
      console.log(`Play frame: ${n}`);
      setCurrFrame(n);
    }
  }, [containerScrollRatio]);

  useEffect(() => {
    // preloadImages();
  }, []);

  return (
    <div className={classes.root} ref={setContainerRef}>

      <div className="content">
        <div>Ratio: {containerScrollRatio}</div>
        <div className="video-wrap">
          <ReactPlayer url={assetUrl('/video/fingers.mp4', true)} width="100%" height="100%" ref={ref} playing={false} loop={false} playsinline={true}
            onReady={onVideoReady} onStart={onVideoStart} onEnded={onVideoEnd} onProgress={onProgress} controls={false} light={false} muted={false} />
        </div>
        <div className="images">
          {[...Array(totalFrame).keys()].map((i) =>
            <img key={i} className="image" src={assetUrl(`/images/fingers-frames/ezgif-frame-${(totalFrame - i).toString().padStart(3, '0')}.png`)}
              style={currFrame == (totalFrame - i) ? { visibility: 'visible' } : null} />
          )}
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
