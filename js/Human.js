class Human {
	constructor(teamName, ships, inputChannel, outputChannel, updateChannel) {
		this._name = teamName;
		this._ships = ships;
		this._inputChannel = inputChannel;
		this._outputChannel = outputChannel;
		this._updateChannel = updateChannel;
	}
}