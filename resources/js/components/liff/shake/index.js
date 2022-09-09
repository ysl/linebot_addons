import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { LiffProvider, LiffContext } from '../liff-context';

const styles = (theme) => ({
  root: {
    position: 'relative',
    padding: '10vw',
    '& .outline': {
      width: '80vw',
      height: '5vw',
      border: '1px solid #ccc',
      '& .fill': {
        height: '100%',
        background: '#2176bd',
      }
    }
  }
});

// var SHAKE_THRESHOLD = 800;
// var last_update = 0;
// var x = 0, y = 0, z = 0, last_x = 0, last_y = 0, last_z = 0;

let refX1, refY1, refZ1;
let prevX = 0;
let prevY = 0;
let prevZ = 0;
const DELTA_THRESHOLD = 10;

function MyComponent(props) {
  const { classes } = props;
  const { liffActions, liffState } = useContext(LiffContext);

  const [msg, setMsg] = useState('');

  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [z1, setZ1] = useState(0);
  const [delta, setDelta] = useState(0);
  const [score, setScore] = useState(0);

  const [x2, setX2] = useState(0);
  const [y2, setY2] = useState(0);
  const [z2, setZ2] = useState(0);

  const [x3, setX3] = useState(0);
  const [y3, setY3] = useState(0);
  const [z3, setZ3] = useState(0);

  const onClickGetPermission = () => {
    // feature detect
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            console.log('permission granted');
            setMsg('Permission granted');
          }
        })
        .catch((err) => {
          console.error(err);
          setMsg(err.toString());
        });
    } else {
      // handle regular non iOS 13+ devices
      setMsg('Cannot get permission of your iOS device');
    }
  }

  const startMotionDetect = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", function(event) {
        // This function only called when the value is changed.
        const rotateDegrees = event.alpha; // alpha: rotation around z-axis
        const frontToBack = event.beta; // beta: front back motion
        const leftToRight = event.gamma; // gamma: left to right
        setX1(frontToBack);
        setY1(leftToRight);
        setZ1(rotateDegrees);
      }, true);
    } else if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(event) {
        setX2(event.acceleration.x);
        setY2(event.acceleration.y);
        setZ2(event.acceleration.z);
      }, true);
    } else {
      window.addEventListener("MozOrientation", function(orientation) {
        setX3(orientation.x);
        setY3(orientation.y);
        setZ3(orientation.z);
      }, true);
    }
  }

  refX1 = x1;
  refY1 = y1;
  refZ1 = z1;
  const evaluateDelta = () => {
    let d1 = Math.abs(refX1 - prevX);
    if (d1 > 180) {
      d1 = 360 - d1;
    }
    let d2 = Math.abs(refY1 - prevY);
    if (d2 > 180) {
      d2 = 360 - d2;
    }
    let d3 = Math.abs(refZ1 - prevZ);
    if (d3 > 180) {
      d3 = 360 - d3;
    }
    const d = d1 + d2 + d3;;
    setDelta(d.toFixed(3));

    prevX = refX1;
    prevY = refY1;
    prevZ = refZ1;
  }

  useEffect(() => {
    if (delta > DELTA_THRESHOLD) {
      setScore(score + 1);
    }
  }, [delta]);

  // const startShake = () => {
  //   if (window.DeviceMotionEvent) {
  //     window.addEventListener('devicemotion', deviceMotionHandler, false);
  //   } else {
  //     alert('本设备不支持devicemotion事件');
  //   }
  // }

  // const deviceMotionHandler = (eventData) => {
  //   console.log('deviceMotionHandler')
  //   var acceleration = eventData.accelerationIncludingGravity;
  //   var curTime = new Date().getTime();
  
  //   if ((curTime - last_update) > 100) {
  //     var diffTime = curTime - last_update;
  //     last_update = curTime;
  //     x = acceleration.x;
  //     y = acceleration.y;
  //     z = acceleration.z;
  //     var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
  //     var status = document.getElementById("status");
  
  //     if (speed > SHAKE_THRESHOLD) {
  //       doResult();
  //     }
  //     last_x = x;
  //     last_y = y;
  //     last_z = z;
  //   }
  // }

  // const doResult = () => {
  //   document.getElementById("result").className = "result";
  //   document.getElementById("loading").className = "loading loading-show";
  //   setTimeout(function() {
  //     //document.getElementById("hand").className = "hand";
  //     document.getElementById("result").className = "result result-show";
  //     document.getElementById("loading").className = "loading";
  //   }, 1000);
  // }

  useEffect(() => {
    startMotionDetect();

    setInterval(() => {
      evaluateDelta();
    }, 100);
  }, []);

  return (
    <div className={classes.root}>
      <h2>Motion detect</h2>

      <hr />

      <div>
        For iOS <button onClick={onClickGetPermission}>Request permission</button>
      </div>
      <div>{msg}</div>
      <hr />

      <p>window.DeviceOrientationEvent</p>
      <div>x: {x1.toFixed(3)} deg</div>
      <div>y: {y1.toFixed(3)} deg</div>
      <div>z: {z1.toFixed(3)} deg</div>
      <div>delta: {delta} <span style={{ color: 'red', fontSize: '5vw' }}>{delta > DELTA_THRESHOLD ? 'Shaking' : ''}</span></div>
      <div className="outline">
        <div className="fill" style={{ width: `${score}%`}}></div>
      </div>
      <hr />

      <p>window.DeviceMotionEvent</p>
      <div>x: {x2.toFixed(3)}</div>
      <div>y: {y2.toFixed(3)}</div>
      <div>z: {z2.toFixed(3)}</div>

      <hr />

      <p>MozOrientation</p>
      <div>x: {x3.toFixed(3)}</div>
      <div>y: {y3.toFixed(3)}</div>
      <div>z: {z3.toFixed(3)}</div>

      {/* 请摇动手机
      <div id="hand" class="hand hand-animate"></div>
      <div id="loading" class="loading"></div>
      <div id="result" class="result">
      <div className="pic"></div>
      <div className="con">摇晃结果<br/>摇晃结果的其他信息哈哈哈</div>
      </div> */}
    </div>
  )
}

MyComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyComponent);
