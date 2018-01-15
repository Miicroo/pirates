class ExtendedObserver {
	constructor() {
		this._registeredActions = {};
	}

	register(name, func) {
		this._registeredActions[name] = func;
	}

	subscribe(observable) {
		return observable.subscribe(obj => this._forwardUpdate(obj));
	}

	_forwardUpdate(obj) {
		const action = obj.action;
		const data = obj.data;

		if(this._hasRegisteredAction(action)) {
			const func = this._getRegisteredAction(action);
			func(data);
		} else {
			console.log(`Ignoring ${action}`);
		}
	}

	_hasRegisteredAction(action) {
		return this._registeredActions.hasOwnProperty(action);
	}

	_getRegisteredAction(action) {
		return this._registeredActions[action];
	}
}