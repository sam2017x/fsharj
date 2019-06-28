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
    const { data, error, loading } = await userService.login(info);
    if (!loading && !error) {
      dispatch({
        type: 'LOGIN',
        data,
      });
    }
    if (error) throw new Error(error.message);
  };
};

export default reducer;
