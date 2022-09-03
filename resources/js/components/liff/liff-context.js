import React, { useReducer } from 'react';

const SET_ME = 'SET_ME';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_ME:
      return {
        ...state,
        me: action.payload,
      };
    default:
      throw new Error();
  }
};

const LiffContext = React.createContext();
const initialState = {
  me: null,
};

const LiffProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    setMe: (me) => {
      dispatch({ type: SET_ME, payload: me });
    },
  };

  const { children } = props;
  return (
    <LiffContext.Provider
      value={{
        liffState: state,
        liffActions: actions,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};

export { LiffProvider, LiffContext };
