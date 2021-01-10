export default function useLinkState<TEvent extends Event = Event, S = any>(
	initialState: S,
	eventPath?: string
): [S, (e: TEvent) => void, (value: S | ((prevState: S) => S)) => void];
