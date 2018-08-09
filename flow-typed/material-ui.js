declare module 'material-ui/styles/createGenerateClassName' {
  declare export default function createGenerateClassName(options: {}): (
    rule: { key: string },
    styleSheet: any
  ) => string;
}

declare module 'material-ui/styles/jssPreset' {
  declare export default function jssPreset(): {
    plugins: any[]
  };
}
