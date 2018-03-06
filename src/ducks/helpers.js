// @flow
export type Statefull<T> = {
  isAvailable: boolean,
  isProcessing: boolean,
  isEmpty: boolean,
  isInvalid: boolean,
  code?: string,
  data?: T
};

export function initialized(): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: false,
    isEmpty: false,
    isInvalid: false
  };
}

export function processing(): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: true,
    isEmpty: false,
    isInvalid: false
  };
}

export function empty(): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: false,
    isEmpty: true,
    isInvalid: false
  };
}

export function invalid(code: string): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: false,
    isEmpty: false,
    isInvalid: true,
    code
  };
}

export function has<T>(data: T): Statefull<T> {
  return {
    isAvailable: true,
    isProcessing: false,
    isEmpty: false,
    isInvalid: false,
    data
  };
}
