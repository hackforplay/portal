/* Composer of duck(action/actionCreator/reducer)s */
import { combineReducers, compose, applyMiddleware, createStore } from 'redux';

const store = createStore(reducer, applyMiddleware(...middleware));

// reducer と actionCreator をまとめて export する
