// @flow
export type Statefull<T> =
  | {
      isAvailable: false,
      isProcessing: false
    }
  | {
      isAvailable: false,
      isProcessing: true
    }
  | {
      isAvailable: false,
      isProcessing: false,
      isEmpty: true
    }
  | {
      isAvailable: true,
      isProcessing: false,
      isEmpty: false,
      data: T
    };
