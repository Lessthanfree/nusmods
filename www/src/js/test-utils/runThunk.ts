import { FSA } from 'types/redux';

export default async function runThunk(
  action: FSA | Function,
  dispatch: Function,
  getState: Function = () => {},
) {
  if (typeof action === 'function') {
    const p = action(
      (nextAction: FSA | Function) => runThunk(nextAction, dispatch, getState),
      getState,
    );

    if (p instanceof Promise) {
      await p;
    }
  } else {
    dispatch(action);
  }
}
