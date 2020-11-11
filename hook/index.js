import delve from 'dlv';
import { useState, useCallback } from 'preact/hooks';

export default function useLinkState(initialState, eventPath) {
	const [state, setState] = useState(initialState);

	const linkState = useCallback(function(e) {
		const t = (e && e.target) || this;
		const v = typeof eventPath === 'string'
			? delve(e, eventPath)
			: (t && t.nodeName)
			? t.type.match(/^che|rad/)
				? t.checked
				: t.value
			: e;
		setState(v);
	}, [eventPath]);

	return [state, linkState, setState];
}
