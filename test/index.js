import linkState from '../src';
import chai, { expect } from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('linkstate', () => {
	let component, linkFunction;

	function Component() {
		this.state = {};
	}
	Component.prototype.setState = stub();

	beforeEach( () => {
		component = new Component();
		component.setState.reset();
	});

	it('should be a function', () => {
		expect(linkState).to.be.a('function');
	});

	it('should produce a function', () => {
		expect(linkState(component, 'testStateKey')).to.be.a('function');
	});

	it('should be memoized', () => {
		expect(linkState(component, 'a')).to.equal(linkState(component, 'a'));
		expect(linkState(component, 'a', 'x')).to.equal(linkState(component, 'a', 'x'));

		expect(linkState(component, 'a')).not.to.equal(linkState(component, 'b'));
		expect(linkState(component, 'a')).not.to.equal(linkState(component, 'a', 'x'));
		expect(linkState(component, 'a', 'x')).not.to.equal(linkState(component, 'a', 'y'));
	});

	describe('linkState without eventPath argument', () => {
		beforeEach( () => {
			linkFunction = linkState(component, 'testStateKey');
		});

		it('should use value attribute on text input when no eventPath is supplied', () => {
			let element = document.createElement('input');
			element.type= 'text';
			element.value = 'newValue';

			linkFunction({
				currentTarget: element,
				target: element
			});

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': 'newValue'});

			linkFunction.call(element);

			expect(component.setState).to.have.been.calledTwice;
			expect(component.setState.secondCall).to.have.been.calledWith({'testStateKey': 'newValue'});
		});

		it('should use checked attribute on checkbox input when no eventPath is supplied', () => {
			let checkboxElement = document.createElement('input');
			checkboxElement.type= 'checkbox';
			checkboxElement.checked = true;

			linkFunction({
				currentTarget: checkboxElement,
				target: checkboxElement
			});

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': true});
		});

		it('should use checked attribute on radio input when no eventPath is supplied', () => {
			let radioElement = document.createElement('input');
			radioElement.type= 'radio';
			radioElement.checked = true;

			linkFunction({
				currentTarget: radioElement,
				target: radioElement
			});

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': true});
		});


		it('should set dot notated state key appropriately', () => {
			linkFunction = linkState(component,'nested.state.key');
			let element = document.createElement('input');
			element.type= 'text';
			element.value = 'newValue';

			linkFunction({
				currentTarget: element,
				target: element
			});

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({nested: {state: {key: 'newValue'}}});
		});

	});

	describe('linkState with eventPath argument', () => {
		before( () => {
			linkFunction = linkState(component,'testStateKey', 'nested.path');
			expect(linkFunction).to.be.a('function');
		});

		it('should give precedence to nested.path on event over nested.path on component', () => {
			let event = {nested: {path: 'nestedPathValueFromEvent'}};

			linkFunction.call(component, event);

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': 'nestedPathValueFromEvent'});
		});
	});

	describe('linkState with eventPath functional argument', () => {
		before( () => {
			linkFunction = linkState(component,'testStateKey', function (e) {
                          return e && e.nested && e.nested.path
                        });
			expect(linkFunction).to.be.a('function');
		});

		it('should extract value using provided function', () => {
			let event = {nested: {path: 'nestedPathValueFromEvent'}};

			linkFunction.call(component, event);

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': 'nestedPathValueFromEvent'});
		});
	});

	describe('linkState with eventPath state.path-dependent functional argument', () => {
		before( () => {
			linkFunction = linkState(component, 'testStateKey', function (e, key) {
                          return e && e.updated && e.updated[key]
                        });
			expect(linkFunction).to.be.a('function');
		});

		it('should extract value using provided function of event and datakey', () => {
			let event = {updated: {testStateKey: 'nestedPathValueFromEvent'}};

			linkFunction.call(component, event);

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': 'nestedPathValueFromEvent'});
		});
	});

	describe('linkState with eventPath component.path-dependent functional argument', () => {
		before( () => {
                        component.id = "C2";
			linkFunction = linkState(component, 'testStateKey', function (e) {
                          return e && e.updated && e.updated[this.id]
                        });
			expect(linkFunction).to.be.a('function');
		});

		it('should extract value using provided function of event and component', () => {
			let event = {updated: {C1: 'C1Val', C2: 'C2Val'}};

			linkFunction.call(component, event);

			expect(component.setState).to.have.been.calledOnce;
			expect(component.setState).to.have.been.calledWith({'testStateKey': 'C2Val'});
		});

	});
});
