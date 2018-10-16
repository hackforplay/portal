// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const SvgArrowBack = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M7.5 11l5.6-5.6L11.7 4l-8 8 8 8 1.4-1.4L7.5 13h12.2v-2z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </SvgIcon>
);

export default SvgArrowBack;
