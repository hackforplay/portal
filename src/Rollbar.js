// @flow
import rollbar from 'rollbar';

const Rollbar = new rollbar({
  enabled: !!process.env.REACT_APP_ROLLBAR_TOKEN,
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: process.env.REACT_APP_VERSION || '',
        guess_uncaught_frames: true
      }
    }
  }
});

Rollbar.global({
  itemsPerMinute: 5,
  maxItems: 10
});

export default Rollbar;
