import '@testing-library/react';
import { createEvent, createStore, sample, Event } from 'effector';

const watch = (event: Event<any>) => {
  const mock = jest.fn();
  event.watch(mock);
  return mock;
}

describe('test', () => {
  test('effector event', () => {
    let event1 = createEvent<string>();
    let event2 = createEvent<{ clock: string, source: string }>();
    let store = createStore<string>('source');

    sample({
      source: store,
      clock: event1,
      fn: (source, clock) => ({ clock, source }),
      target: event2,
    });

    const event2mock = watch(event2);

    event1('clock');

    expect(event2mock).toBeCalledWith({clock: 'clock', source: 'source'});
  });
});
