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

export function initialized(): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: false
  };
}

export function processing(): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: true
  };
}

export function empty(): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: false,
    isEmpty: true
  };
}

export function has<T>(data: T): Statefull<T> {
  return {
    isAvailable: true,
    isProcessing: false,
    isEmpty: false,
    data
  };
}
