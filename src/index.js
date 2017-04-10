import delve from 'dlv';

/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
 *	@param {function} callback	A function to be called once component state is updated
 *	@returns {function} linkedStateHandler
 */
export default function linkState(component, key, eventPath, callback) {
	let path = key.split('.');
	return function(e) {
		let t = e && e.target || this,
			state = {},
			obj = state,
			v = typeof eventPath==='string' ? delve(e, eventPath) : t.nodeName ? (t.type.match(/^che|rad/) ? t.checked : t.value) : e,
			i = 0;
		for ( ; i<path.length-1; i++) {
			obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
		}
		obj[path[i]] = v;
		component.setState(state, callback);
	};
}
