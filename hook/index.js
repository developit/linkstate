import delve from 'dlv';
import { useState, useCallback } from 'preact/hooks';

export default function useLinkState(initialState, eventPath) {
  const [state, setState] = useState(initialState);

  const linkState = useCallback(
    e => {
      const t = (e && e.target) || this,
        v =
          typeof eventPath === 'string'
            ? delve(e, eventPath)
            : t.nodeName
            ? t.type.match(/^che|rad/)
              ? t.checked
              : t.value
            : e;

      setState(v);
    },
    [setState, eventPath]
  );

  return [state, linkState, setState];
}
