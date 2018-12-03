import { style } from 'typestyle';

export const largeButton = style({
  fontSize: 26,
  paddingLeft: 20,
  paddingRight: 20,
  $nest: {
    '& svg': {
      fontSize: 36,
      marginRight: 8
    }
  }
});

export const mediumButton = style({
  fontSize: 20,
  paddingLeft: 16,
  paddingRight: 16,
  $nest: {
    '& svg': {
      fontSize: 24,
      marginRight: 8
    }
  }
});
