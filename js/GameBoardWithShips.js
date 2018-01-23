class GameBoardWithShips {
	constructor(grid, ships) {
		this._setUpGrid(grid, ships);
	}

	_setUpGrid(grid, ships) {
		this._grid = grid;

		ships.forEach(ship => {
			this._grid[ship.getY()][ship.getX()] = {'name': 'ship', 'passable': false};
		});
	}

	getGrid() {
		return this._grid;
	}
}