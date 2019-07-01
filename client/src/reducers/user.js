const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      window.localStorage.setItem('loggedUser', JSON.stringify(action.data));
      console.log('login successful', action.data);
      return action.data;
    default:
      return state;
  }
};

export const userLogin = info => {
  return async dispatch => {
    dispatch({
      type: 'LOGIN',
      data: {
        token: info.value,
        username: info.username,
      },
    });
  };
};
export default reducer;
