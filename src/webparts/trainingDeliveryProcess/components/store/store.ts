import { Store, createStore as reduxCreateStore, applyMiddleware } from 'redux';
import {trainingReducer,IApplicationState} from './reducers/reducer';
import thunk from 'redux-thunk';

export function createStore(initialState?: IApplicationState): Store<IApplicationState> {
  return reduxCreateStore(trainingReducer,applyMiddleware(thunk));
}
