// earybird または開発中の時は, earlybird 向けのステージを配信する
const { hostname } = window.location;
const isEarlybird =
  hostname.startsWith('earlybird') || hostname.startsWith('localhost');

  export default isEarlybird
