import { handleActions } from 'redux-actions';
import { Record, List } from 'immutable';
import {
  ADD_MESSAGE
} from 'actions/messages_actions';

const MessagesState = new Record({
  messages: List()
});

let reducers = {};

reducers[ADD_MESSAGE] = (state, action) => {
  
};

export default handleActions(reducers, new MessagesState());
