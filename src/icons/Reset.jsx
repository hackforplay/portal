// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const Reset = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M18.87 11.797a8.448 8.448 0 1 0-1.874 5.986 1 1 0 1 0-1.55-1.264c-.363.446-.79.845-1.263 1.182a6.447 6.447 0 1 1 2.623-6.33L15.7 10.288a1 1 0 0 0-1.402 1.426l3.755 3.689 3.647-3.583a1 1 0 1 0-1.402-1.427l-1.429 1.405z"
      fillRule="nonzero"
      fill="currentColor"
    />
  </SvgIcon>
);

export default Reset;
