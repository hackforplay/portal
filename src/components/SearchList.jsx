// @flow
import * as React from 'react';
import { style } from 'typestyle';

import WorkList from '../containers/WorkList';
import { withTheme } from '@material-ui/core/styles';
import { type StateProps } from '../containers/SearchList';

const getCn = props => ({
  root: style({
    padding: props.theme.spacing.unit * 4
  })
});

export type OwnProps = {};

type Props = OwnProps & StateProps;

export default withTheme()((props: Props) => {
  const dcn = getCn(props);
  const { result } = props;

  return (
    <div className={dcn.root}>
      <WorkList
        works={result}
        title="検索結果"
        more
        moreLink=""
        showVisibility={false}
      />
    </div>
  );
});
