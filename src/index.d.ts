export default function linkState<T>(
  component: any,
  key: string,
  eventPath?: string
): (e: T) => void;
