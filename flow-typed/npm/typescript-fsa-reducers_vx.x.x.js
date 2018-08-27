// flow-typed signature: 23c120b0f41f97a5bfc7548312740388
// flow-typed version: <<STUB>>/typescript-fsa-reducers_v^0.4.5/flow_v0.78.0

import { Action, ActionCreator, AnyAction } from "typescript-fsa";

declare module 'typescript-fsa-reducers' {
  declare export interface ReducerBuilder<InS, OutS> {
      case<P>(actionCreator: ActionCreator<P>, handler: Handler<InS, OutS, P>): ReducerBuilder<InS, OutS>;
      caseWithAction<P>(actionCreator: ActionCreator<P>, handler: Handler<InS, OutS, Action<P>>): ReducerBuilder<InS, OutS>;
      cases<P1>(actionCreators: [ActionCreator<P1>], handler: Handler<InS, OutS, P1>): ReducerBuilder<InS, OutS>;
      cases<P1, P2>(actionCreators: [ActionCreator<P1>, ActionCreator<P2>], handler: Handler<InS, OutS, P1 | P2>): ReducerBuilder<InS, OutS>;
      cases<P1, P2, P3>(actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>], handler: Handler<InS, OutS, P1 | P2 | P3>): ReducerBuilder<InS, OutS>;
      cases<P1, P2, P3, P4>(actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>, ActionCreator<P4>], handler: Handler<InS, OutS, P1 | P2 | P3 | P4>): ReducerBuilder<InS, OutS>;
      casesWithAction<P1>(actionCreators: [ActionCreator<P1>], handler: Handler<InS, OutS, Action<P1>>): ReducerBuilder<InS, OutS>;
      casesWithAction<P1, P2>(actionCreators: [ActionCreator<P1>, ActionCreator<P2>], handler: Handler<InS, OutS, Action<P1 | P2>>): ReducerBuilder<InS, OutS>;
      casesWithAction<P1, P2, P3>(actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>], handler: Handler<InS, OutS, Action<P1 | P2 | P3>>): ReducerBuilder<InS, OutS>;
      casesWithAction<P1, P2, P3, P4>(actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>, ActionCreator<P4>], handler: Handler<InS, OutS, Action<P1 | P2 | P3 | P4>>): ReducerBuilder<InS, OutS>;
      build(): (state: InS | void, action: {
          type: any;
      }) => OutS;
      (state: InS | void, action: AnyAction): OutS;
  }
  declare export type Handler<InS, OutS, P> = (state: InS, payload: P) => OutS;
  declare export function reducerWithInitialState<S>(initialState: S): ReducerBuilder<S, S>;
  declare export function reducerWithoutInitialState<S>(): ReducerBuilder<S, S>;
  declare export function upcastingReducer<InS, OutS>(): ReducerBuilder<InS, OutS>;
}
