// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const SvgOpen = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M12.865 16.342l7.5-8A.5.5 0 0 0 20 7.5H5a.5.5 0 0 0-.365.842l7.5 8a.5.5 0 0 0 .73 0z"
      fillRule="nonzero"
      fill="currentColor"
    />
  </SvgIcon>
);

export default SvgOpen;
