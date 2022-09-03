import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import liff from '@line/liff';
import queryString from 'query-string';
import { LiffProvider, LiffContext } from './liff-context';
import Entry from './entry/index';
import ScrollVideo from './scroll-video/index';

var parsedQueryString = {};

const styles = (theme) => ({
  root: {
  },
});

function LiffRoot(props) {
  const { classes } = props;
  const { liffActions, liffState } = useContext(LiffContext);
  const [errorMsg, setErrorMsg] = useState('');

  const lineLogin = () => {
    console.log('lineLogin()');
    liff.init({ liffId: window.liffId })
      .then(() => {
        console.log('liff init');
        if (!liff.isLoggedIn()) {
          liff.login({
            redirectUri: window.location.href
          });
        } else {
          const accessToken = liff.getAccessToken();
          // const idToken = liff.getIDToken();
          liff.getProfile()
            .then(profile => {
              // Send the token and userId to server, then verify it.
              appLogin(profile.userId, profile.displayName, profile.pictureUrl, accessToken)
                .then(getSelf);

              liff.getFriendship()
                .then((res) => {
                  if (res.friendFlag === true) {
                    console.log('getFriendship=true');
                  } else {
                    console.error('getFriendship=false');
                  }
                });
            })
            .catch((err) => {
              console.error('get profile failed:', err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const appLogin = (userId, displayName, pictureUrl, accessToken) => {
    console.log('appLogin()')
    var friendStatusChanged = false;
    if (parsedQueryString.friendship_status_changed == 'true') {
      friendStatusChanged = true;
    }

    const data = {
      line_id: userId,
      name: displayName,
      avatar_url: pictureUrl,
      access_token: accessToken,
      friendship_status_changed: friendStatusChanged,
    }
    return axios.post('/login', data)
      .catch((error) => {
        setErrorMsg('請重新開啟頁面');
        console.error('請重新開啟頁面');
        throw error;
      });
  }
  const getSelf = () => {
    return axios.get('/me').then((res) => {
      let me = res.data.data;
      liffActions.setMe(me);
    }).catch((error) => {
      setErrorMsg('請重新開啟頁面');
      console.error('請重新開啟頁面');
    });
  }

  /**
   * Entry point.
   */
  useEffect(() => {
    if (liffState.me === null) {
      // Parse query string.
      parsedQueryString = queryString.parse(window.location.search);

      // Check the query string: join-the-party
      if (parsedQueryString.joinTheParty == 1) {
        liffActions.setProjectionTimes(1);
      }

      if (!window.useMockUser) {
        lineLogin();
      } else {
        // For test mode.
        appLogin('test123', 'test', 'https://gravatar.com/avatar/071bbb589ceaf46b0d0d0c2f856c697b?s=400&d=robohash&r=x', 'xxxx')
          .then(getSelf);
      }
    }
  }, []);

  return (
    <div className={classes.root}>
      <div className="error-msg">{errorMsg}</div>
      {liffState.me ?
        <Switch>
          <Route path="/" exact component={Entry} />
          <Route path="/scroll_video" exact component={ScrollVideo} />
        </Switch>
        :
        null
      }
    </div>
  )
}

LiffRoot.propTypes = {
  classes: PropTypes.object.isRequired,
};

function LiffRootWrap() {
  const A = withStyles(styles)(LiffRoot);
  return (
    <LiffProvider>
      <A />
    </LiffProvider>
  )
}

export default LiffRootWrap;
