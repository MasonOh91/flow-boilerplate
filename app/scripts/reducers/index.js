import { combineReducers } from 'redux';
import messagesReducer from './messages_reducer';

// here we combine reducers. the variable "reducers" will be an object
// with all of our state's reducers. the variable rootReducers then combines
// our reducers with a routing reducer (and potential other 3rd party store tie-ins).

const reducers = {
  messagesReducer
};

const rootReducer = combineReducers({
  ...reducers
});

export default rootReducer;
