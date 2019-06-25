import userService from '../services/user';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.data;
    default:
      return state;
  }
};

export const userLogin = info => {
  return async dispatch => {
    try {
      const user = await userService.login(info);
      dispatch({
        type: 'LOGIN',
        data: user,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
};

export default reducer;
