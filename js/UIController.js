class UIController {
	constructor(updateChannel) {
		this._observer = new ExtendedObserver();
		this._subscription = this._observer.subscribe(updateChannel);
	}
}