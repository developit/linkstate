import { Component } from 'preact';
import linkState from 'linkstate';

Component.prototype.linkState = function(key, eventPath) {
	return linkState(this, key, eventPath);
};

export default linkState;
