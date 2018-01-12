class GameController {
	constructor() {
		this._gameBoard = new GameBoard();
		this._players = this._createPlayers();
	}

	_createPlayers() {
		const players = [];

		players.push(new Bot('Spain', this._createFleet('#ffffff', 7, 0, x => x+1, y => y)));
		players.push(new Bot('Arabia', this._createFleet('#7E0CCA', 0, 7, x => x, y => y+1)));
		players.push(new Bot('France', this._createFleet('#088362', 19, 10, x => x, y => y+1)));
		players.push(new Human('Pirates', this._createFleet('#000000', 10, 19, x => x+1, y => y)));

		return players;
	}

	_createFleet(colour, startX, startY, transformX, transformY) {
		const ships = [];
		const numberOfShips = 3;
		let x = startX;
		let y = startY;
		for(let i = 0; i< numberOfShips; i++) {
			ships.push({'color': colour, 'x': x, 'y': y});
			x = transformX(x);
			y = transformY(y);
		}
		return ships;
	}

	getGameBoardGrid() {
		return this._gameBoard.getGrid();
	}

	getFleets() {
		return this._players.map(p => p._ships); //TODO oh no dont do this
	}

	calculateMovingPositions(ships, dices) {

	}
}