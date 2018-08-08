// @flow
import React from "react";
import type { ElementProps } from "react";
import SvgIcon from "material-ui/SvgIcon";

const Share = (props: ElementProps<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      d="M20.201 19.595a1.51 1.51 0 0 0 1.678.7A1.496 1.496 0 0 0 23 18.841c0-2.261-.923-4.968-2.669-7.096-1.952-2.383-4.834-3.997-8.762-4.352V5.06c0-.583-.334-1.114-.847-1.353a1.497 1.497 0 0 0-1.609.193l-7.551 6.25a1.5 1.5 0 0 0-.02 2.323l7.571 6.28a1.5 1.5 0 0 0 2.46-1.157v-2.242c4.274.146 6.894 1.177 8.628 4.241zm-17.38-7.892l.013-.01a.39.39 0 0 1-.012.01zm-.005-.772l.002.003-.002-.003zM9.569 6.12v3.178l.963.035c3.833.14 6.498 1.54 8.253 3.682a10.161 10.161 0 0 1 1.946 3.841c-2.285-2.688-5.51-3.5-10.154-3.52l-1.004-.003v3.203L3.284 11.32l6.285-5.2z"
      fillRule="nonzero"
      fill="currentColor"
    />
  </SvgIcon>
);

export default Share;
