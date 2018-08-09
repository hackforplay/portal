// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const ArrowForward = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M3.7 11h12.2l-5.6-5.6L11.7 4l8 8-8 8-1.4-1.4 5.6-5.6H3.7z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </SvgIcon>
);

export default ArrowForward;
