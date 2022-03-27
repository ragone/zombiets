import { Topic, Action } from "./types";

type ActionExecutor = (a: Action[]) => void;

type Listener = {
  topic: Topic;
  f: ActionExecutor;
};

const listeners: Record<string, Listener> = {};

export const publish = ([topic, ...args]: [Topic, Action[]]) => {
  console.log(topic, args);
  Object.values(listeners).forEach((l) => {
    topic === l.topic && l.f.apply(null, args);
  });
};

export const watch = (id: string, topic: Topic, f: (a: Action[]) => void) =>
  (listeners[id] = { topic, f });
