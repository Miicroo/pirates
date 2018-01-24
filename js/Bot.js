class Bot {
	constructor(teamName, ships, inputChannel, outputChannel, updateChannel) {
		this._name = teamName;
		this._ships = ships;
		this._inputChannel = inputChannel;
		this._outputChannel = outputChannel;
		this._updateChannel = updateChannel;
		this._inputSubscription = this._inputChannel.subscribe(positions => this._play(positions));
	}

	_play(possiblePositions) {
		console.log(`${this._name} got possible positions:`);
		console.log(possiblePositions);
		this._outputChannel.onNext(possiblePositions[0]);
	}
}