// flow-typed signature: 445c54fe50b503bb64947bf2762e984a
// flow-typed version: <<STUB>>/typescript-fsa_v^3.0.0-beta-2/flow_v0.78.0

declare module 'typescript-fsa' {
  declare export interface AnyAction {
    type: any;
  }
  declare export type Meta = null | {
    [key: string]: any
  };
  declare export interface Action<Payload> extends AnyAction {
    type: string;
    payload: Payload;
    error?: boolean;
    meta?: Meta;
  }
  /**
   * Returns `true` if action has the same type as action creator.
   * Defines Type Guard that lets TypeScript know `payload` type inside blocks
   * where `isType` returned `true`.
   *
   * @example
   *
   *    const somethingHappened =
   *      actionCreator<{foo: string}>('SOMETHING_HAPPENED');
   *
   *    if (isType(action, somethingHappened)) {
   *      // action.payload has type {foo: string}
   *    }
   */
  declare export function isType<Payload>(
    action: AnyAction,
    actionCreator: ActionCreator<Payload>
  ): boolean;
  declare export type ActionCreator<Payload> = {
    type: string,
    /**
     * Identical to `isType` except it is exposed as a bound method of an action
     * creator. Since it is bound and takes a single argument it is ideal for
     * passing to a filtering function like `Array.prototype.filter` or
     * RxJS's `Observable.prototype.filter`.
     *
     * @example
     *
     *    const somethingHappened =
     *      actionCreator<{foo: string}>('SOMETHING_HAPPENED');
     *    const somethingElseHappened =
     *      actionCreator<{bar: number}>('SOMETHING_ELSE_HAPPENED');
     *
     *    if (somethingHappened.match(action)) {
     *      // action.payload has type {foo: string}
     *    }
     *
     *    const actionArray = [
     *      somethingHappened({foo: 'foo'}),
     *      somethingElseHappened({bar: 5}),
     *    ];
     *
     *    // somethingHappenedArray has inferred type Action<{foo: string}>[]
     *    const somethingHappenedArray =
     *      actionArray.filter(somethingHappened.match);
     */
    match: (action: AnyAction) => boolean,
    /**
     * Creates action with given payload and metadata.
     *
     * @param payload Action payload.
     * @param meta Action metadata. Merged with `commonMeta` of Action Creator.
     */
    (payload?: Payload, meta?: Meta): Action<Payload>
  };
  declare export type Success<Params, Result> = {
    params?: Params,
    result?: Result
  };
  declare export type Failure<Params, Error> = {
    params?: Params,
    error: Error
  };
  declare export interface AsyncActionCreators<Params, Result, Error = {}> {
    type: string;
    started: ActionCreator<Params>;
    done: ActionCreator<Success<Params, Result>>;
    failed: ActionCreator<Failure<Params, Error>>;
  }
  declare export interface ActionCreatorFactory {
    /**
     * Creates Action Creator that produces actions with given `type` and payload
     * of type `Payload`.
     *
     * @param type Type of created actions.
     * @param commonMeta Metadata added to created actions.
     * @param isError Defines whether created actions are error actions.
     */
    <Payload>(
      type: string,
      commonMeta?: Meta,
      isError?: boolean
    ): ActionCreator<Payload>;
    /**
     * Creates Action Creator that produces actions with given `type` and payload
     * of type `Payload`.
     *
     * @param type Type of created actions.
     * @param commonMeta Metadata added to created actions.
     * @param isError Function that detects whether action is error given the
     *   payload.
     */
    <Payload>(
      type: string,
      commonMeta?: Meta,
      isError?: (payload: Payload) => boolean
    ): ActionCreator<Payload>;
    /**
     * Creates three Action Creators:
     * * `started: ActionCreator<Params>`
     * * `done: ActionCreator<{params: Params, result: Result}>`
     * * `failed: ActionCreator<{params: Params, error: Error}>`
     *
     * Useful to wrap asynchronous processes.
     *
     * @param type Prefix for types of created actions, which will have types
     *   `${type}_STARTED`, `${type}_DONE` and `${type}_FAILED`.
     * @param commonMeta Metadata added to created actions.
     */
    async<Params, Result, Error>(
      type: string,
      commonMeta?: Meta
    ): AsyncActionCreators<Params, Result, Error>;
  }
  /**
   * Creates Action Creator factory with optional prefix for action types.
   * @param prefix Prefix to be prepended to action types as `<prefix>/<type>`.
   * @param defaultIsError Function that detects whether action is error given the
   *   payload. Default is `payload => payload instanceof Error`.
   */
  declare export function actionCreatorFactory(
    prefix?: string | null,
    defaultIsError?: (payload: any) => boolean
  ): ActionCreatorFactory;
  declare export default actionCreatorFactory;
}
