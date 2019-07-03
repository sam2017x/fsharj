const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'NOTIFICATION':
      return action.data;
    case 'CLEAR':
      return {};
    default:
      return state;
  }
};

export const setNotification = (text, style, duration) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFICATION',
      data: {
        text,
        style,
      },
    });
    setTimeout(() => {
      dispatch({
        type: 'CLEAR',
      });
    }, duration * 1000);
  };
};

export default reducer;
