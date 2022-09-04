import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { LiffProvider, LiffContext } from '../liff-context';
import { ReactMic } from 'react-mic';
import AudioStreamMeter from 'audio-stream-meter';

const styles = (theme) => ({
  root: {
    position: 'relative',
    height: '100vh',
    overflowX: 'hidden',
    overflowY: 'scroll',
    backgroundColor: '#EEECED',
    fontWeight: 100,
  }
});

let volumeMeterStarted = false;

function MyComponent(props) {
  const { classes } = props;
  const { liffActions, liffState } = useContext(LiffContext);
  const [record, setRecord] = useState(false);
  const [volume, setVolume] = useState(0);

  const startRecording = () => {
    setRecord(true);
  }

  const stopRecording = () => {
    setRecord(false);
  }

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  const onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
  }

  const startVolumeMeter = () => {
    if (volumeMeterStarted) {
      return volumeMeterStarted;
    }
    volumeMeterStarted = true;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        var audioContext = new AudioContext();
        var mediaStream = audioContext.createMediaStreamSource(stream);
        var volume = document.getElementById('volume');
        var meter = AudioStreamMeter.audioStreamProcessor(audioContext, function() {
          volume.style.width = meter.volume * 100 + '%';
          setVolume(meter.volume);
        });

        mediaStream.connect(meter);
        stream.onended = meter.close.bind(meter);
      });
  }

  useEffect(() => {
  }, []);

  return (
    <div className={classes.root}>
      <h3>navigator.mediaDevices.getUserMedia() require a secure context</h3>

      <div>
        <h3>react-mic</h3>
        <ReactMic
          record={record}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />
        <button onClick={startRecording} type="button">Start</button>
        <button onClick={stopRecording} type="button">Stop</button>
      </div>

      <div>
        <h3>audio-stream-meter</h3>
        <div>
          Volume: {volume}
        </div>
        <div style={{ width: '300px', height: '30px', backgroundColor: '#FF00FF' }}>
          <div id="volume" style={{ height: '30px', backgroundColor: '#00FFFF'}}></div>
          <button onClick={startVolumeMeter} type="button">Start</button>
        </div>
      </div>
    </div>
  )
}

MyComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyComponent);
