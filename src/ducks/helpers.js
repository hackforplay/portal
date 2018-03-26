// @flow
export type Statefull<T> = {
  isAvailable: boolean,
  isProcessing: boolean,
  isEmpty: boolean,
  isInvalid: boolean,
  error?: string,
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

export function invalid(error: string): Statefull<*> {
  return {
    isAvailable: false,
    isProcessing: false,
    isEmpty: false,
    isInvalid: true,
    error
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

const emptyQueue = new WeakSet();

export function isFetchNeeded<T>(data: Statefull<T>): boolean {
  if (data.isAvailable || data.isProcessing || data.isInvalid) {
    // すでに取得済みか、クエリを実行中か、エラーで終了している
    return false;
  }
  if (emptyQueue.has(data)) {
    // 前回の実行から時間がたっていない
    return false;
  }
  // 実行したことをキューに入れて、しばらく差し止める
  emptyQueue.add(data);
  setTimeout(() => {
    emptyQueue.delete(data);
  }, 5000);
  return true;
}
