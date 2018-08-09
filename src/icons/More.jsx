// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const More = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M19 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM5 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </SvgIcon>
);

export default More;
