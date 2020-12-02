import { MutableSnapshot, RecoilState } from 'recoil';

export type StatePair<T> = [RecoilState<T>, T];

export const initializeState = <T>(states: StatePair<T>[]) => (
  snapshot: MutableSnapshot,
) => {
  states.forEach(([k, v]) => snapshot.set(k, v));
};
