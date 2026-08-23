import { WindowEventBus } from '@/services/window-event-bus';
import { PERSISTED_STATE_EVENT_PREFIX } from './constants';
import type { PersistedStateEvents } from './types';

export const persistedStateEvents = new WindowEventBus<PersistedStateEvents>({
  prefix: PERSISTED_STATE_EVENT_PREFIX,
});
