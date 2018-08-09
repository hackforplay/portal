// Based on https://github.com/smooth-code/svgr/tree/7357e7cab9738a377889432582618d43dedba39d#use-a-specific-template

module.exports = (opts = {}) => {
  let props = '';

  if (opts.expandProps && opts.ref) {
    props = '{svgRef, ...props}';
  } else if (opts.expandProps) {
    props = 'props';
  } else if (opts.ref) {
    props = '{svgRef}';
  }

  return (code, state) => `
  // @flow
  import React from 'react';
  import type { ElementProps } from 'react';
  import SvgIcon from 'material-ui/SvgIcon';
  
  const ${
    state.componentName
  } = (${props}: ElementProps<typeof SvgIcon>) => ${code
    .replace(/<svg /, '<SvgIcon ')
    .replace(/<\/svg>/, '</SvgIcon>')}
    
  export default ${state.componentName}`;
};
