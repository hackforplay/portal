// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const SvgCreate = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M3.86 17.465L14.199 7.09l2.653 2.66L6.5 20.105H3.86v-2.64zM17.032 4.244l2.665 2.665-1.525 1.525-2.66-2.66 1.52-1.53zM2.93 21.966h3.954c.248 0 .484-.1.658-.273L21.668 7.566a.929.929 0 0 0 0-1.314l-3.98-3.98a.929.929 0 0 0-1.314 0L2.273 16.425a.951.951 0 0 0-.273.657v3.955c0 .514.415.93.93.93z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </SvgIcon>
);

export default SvgCreate;
