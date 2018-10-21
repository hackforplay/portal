module.exports = (code, config, state) => `
// @flow
import React from 'react';
import type { ElementProps } from 'react';
import SvgIcon from 'material-ui/SvgIcon';

const ${
  state.componentName
} = (props: ElementProps<typeof SvgIcon>) => ${code
  .replace(/<svg /, '<SvgIcon ')
  .replace(/<\/svg>/, '</SvgIcon>')}

export default ${state.componentName}`;
