import delve from 'dlv';
var counter = 0;
/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string|function} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component or function that has signature (component as this, event, key)
 *	@returns {function} linkedStateHandler
 */
export default function linkState(component, key, eventPath) {
	let path = key.split('.'),
                _c_id = typeof eventPath === 'function' ? key+ (eventPath._id || (eventPath._id = ++counter)) : key+eventPath,
		cache = component.__lsc || (component.__lsc = {});


	return cache[_c_id] || (cache[_c_id] = function(e) {
		let t = e && e.target || this,
			state = {},
			obj = state,
			v = typeof eventPath === 'function' ? eventPath.call(component, e, key): 
                            typeof eventPath === 'string'   ? delve(e, eventPath): 
                                                 t.nodeName ? (t.type.match(/^che|rad/) ? t.checked : t.value) : e,
			i = 0;
		for ( ; i<path.length-1; i++) {
			obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
		}
		obj[path[i]] = v;
		component.setState(state);
	});
}
