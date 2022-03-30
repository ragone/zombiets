import { Store, Action, Path, Op, Topic } from "./types";
import * as bus from "./bus";
import { set } from "lodash";

const sleep = (period: number, remainingActions: Action[]) =>
  setTimeout(() => {
    bus.publish([Topic.PERFORM_ACTION, remainingActions]);
  }, period);

export const performActions = (store: Store, actions: Action[]) => {
  let acc = { ...store };
  let remainingActions = actions;
  while (remainingActions.length !== 0) {
    const [action, ...remaining] = remainingActions;
    remainingActions = remaining;
    switch (action[0]) {
      case Op.ASSOC_IN:
        acc = { ...acc, ...set(acc, action[1], action[2]) };
        break;
      case Op.SHOW_TIPS:
        const tips = {
          ...action[1],
          action: [
            Topic.PERFORM_ACTION,
            [[Op.ASSOC_IN, ["tips"], null], ...remainingActions],
          ],
        };
        acc = { ...acc, tips };
        break;
      case Op.WAIT:
        sleep(action[1], remainingActions);
        break;
    }
  }

  return acc;
};
