// @flow
import React from 'react';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import jssPreset from 'material-ui/styles/jssPreset';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';

const styleNode = document.createElement('style');
styleNode.id = 'insertion-point-jss';
if (!document.head) {
  throw new Error('document.head is not initialized');
}
document.head.insertBefore(styleNode, document.head.firstChild);

// Configure JSS
const jss = create(jssPreset());
jss.options.createGenerateClassName = createGenerateClassName;
jss.options.insertionPoint = document.getElementById('insertion-point-jss');

export default function Provider(props: any) {
  return <JssProvider jss={jss}>{props.children}</JssProvider>;
}
