class UIController {
	constructor(rootSelector, updateChannel) {
		this._root = document.querySelector(rootSelector);

		this._observer = new ExtendedObserver();
		this._observer.register('shipAdded', (data) => this._shipAdded(data));
		this._observer.register('shipMoved', (data) => this._shipMoved(data));
		this._observer.register('shipRemoved', (data) => this._shipRemoved(data));
		this._subscription = this._observer.subscribe(updateChannel);
	}

	_shipAdded(data) {
		console.log(data);
  		const ship = data.ship;
  		const element = this._createShipUI(ship);
  		const node = this._findShipNode(ship);
  		node.appendChild(element);
	}

	_shipRemoved(data) {
  		const ship = data.ship;
  		const node = this._findShipNode(ship);
  		node.removeChild(node.firstChild);
	}

	_shipMoved(data) {
		const removeData = {'data': {'ship': data.ship.from}};
		const addData = {'data': {'ship': data.ship.to}};

		this._shipRemoved(removeData);
		this._shipAdded(addData);
	}

	_findShipNode(ship) {
		const row = this._root.children[ship.getY()];
		return row.children[ship.getX()];
	}

	_createShipUI(ship) {
		const span = document.createElement('div');
		span.innerHTML = '&nbsp;';
		span.classList.add('ship');
	    span.style.backgroundColor = ship.getColor();

	    return span;
	}
}