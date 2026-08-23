import { EVENT_NAME_SEPARATOR } from './constants';
import { isCorrectEvent } from './guards';
import type {
  WindowEventBusOptions,
  WindowEventDispatchArgs,
  WindowEventListener,
  WindowEventName,
} from './types';

type DefaultEventMap = Record<string, unknown>;

export class WindowEventBus<TEvents extends object = DefaultEventMap> {
  private readonly prefix?: string;

  constructor(options: WindowEventBusOptions = {}) {
    this.prefix = options.prefix;
  }

  public getEventName(eventName: string): string {
    if (!this.prefix) {
      return eventName;
    }

    return [this.prefix, eventName].join(EVENT_NAME_SEPARATOR);
  }

  public dispatch<TEventName extends WindowEventName<TEvents>>(
    eventName: TEventName,
    ...args: WindowEventDispatchArgs<TEvents[TEventName]>
  ) {
    if (typeof window === 'undefined') {
      return;
    }

    if (args.length === 0) {
      window.dispatchEvent(new CustomEvent(this.getEventName(eventName)));
    } else {
      const [payload] = args;

      const event = new CustomEvent<TEvents[TEventName]>(this.getEventName(eventName), {
        detail: payload,
      });

      window.dispatchEvent(event);
    }
  }

  public subscribe<TEventName extends WindowEventName<TEvents>>(
    eventName: TEventName,
    listener: WindowEventListener<TEvents[TEventName]>,
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const resolvedEventName = this.getEventName(eventName);

    const handler = (event: Event): void => {
      if (!isCorrectEvent<TEvents[TEventName]>(event)) {
        return;
      }

      listener(event.detail);
    };

    window.addEventListener(resolvedEventName, handler);

    return () => {
      window.removeEventListener(resolvedEventName, handler);
    };
  }
}
