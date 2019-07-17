const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      window.localStorage.setItem('loggedUser', JSON.stringify(action.data));
      console.log('login successful', action.data);
      return action.data;
    case 'SET_USER':
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
        id: info.id,
        level: info.level,
        posts: info.posts,
        friends: info.friends,
      },
    });
  };
};

export const setUser = info => {
  return dispatch => {
    dispatch({
      type: 'SET_USER',
      data: {
        token: info.token,
        username: info.username,
        id: info.id,
        level: info.level,
        posts: info.posts,
        friends: info.friends,
      },
    });
  };
};
export default reducer;
