import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import userReducer from './reducers/user'

const reducer = combineReducers({
  user: userReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
