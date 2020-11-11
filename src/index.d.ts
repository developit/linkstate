export default function linkState(
  component: any,
  key: string,
  eventPath?: string,
): <TEvent extends Event = Event>(e: TEvent) => void;
