import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

const styles = {};

function Tutorials() {
  return (
    <Grid container spacing={0}>
      <Paragraph href="https://hack-rpg.hackforplay.xyz">
        <Typography type="headline" align="center" gutterBottom>
          初めてのキット
        </Typography>
      </Paragraph>
    </Grid>
  );
}

type ParagraphProps = {
  children: React.Node,
  href: string,
};

function Paragraph({ children, href }: ParagraphProps) {
  return (
    <Grid item xs={12}>
      <a href={href}>
        <Paper
          elevation={1}
          style={{
            flex: '0 1 100%',
            padding: 60,
            textAlign: 'center',
            margin: 16,
          }}
        >
          {children}
        </Paper>
      </a>
    </Grid>
  );
}

Paragraph.defaultProps = {
  md: 12,
};

export default withStyles(styles)(Tutorials);
