export type WindowEventBusOptions = {
  prefix?: string;
};

export type WindowEventName<TEvents extends object> = Extract<keyof TEvents, string>;

export type WindowEventDispatchArgs<TPayload> = [TPayload] extends [void]
  ? [] | [payload: TPayload]
  : [payload: TPayload];

export type WindowEventListener<TPayload> = [TPayload] extends [void]
  ? () => void
  : (payload: TPayload) => void;
