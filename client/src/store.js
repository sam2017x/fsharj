import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import userReducer from './reducers/user';
import notificationReducer from './reducers/notification';

const reducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
