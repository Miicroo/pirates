class GameController {
	constructor() {
		this._gameBoard = new GameBoard();
		this._createShips();
	}

	_createShips() {
		const spain = [{'color': '#ffffff', 'x': 7, 'y': 0},
					   {'color': '#ffffff', 'x': 8, 'y': 0},
					   {'color': '#ffffff', 'x': 9, 'y': 0}
					  ];
		const arabia = [{'color': '#7E0CCA', 'x': 0, 'y': 7},
			   			{'color': '#7E0CCA', 'x': 0, 'y': 8},
			   			{'color': '#7E0CCA', 'x': 0, 'y': 9}
			  		   ];
		const france = [{'color': '#088362', 'x': 19, 'y': 10},
			   			{'color': '#088362', 'x': 19, 'y': 11},
			   			{'color': '#088362', 'x': 19, 'y': 12}
			  		   ];
		const pirates = [{'color': '#000000', 'x': 10, 'y': 19},
			   			 {'color': '#000000', 'x': 11, 'y': 19},
			   			 {'color': '#000000', 'x': 12, 'y': 19}
			  		    ];

		this._fleets = [spain, arabia, france, pirates];
	}

	getGameBoardGrid() {
		return this._gameBoard.getGrid();
	}

	getFleets() {
		return this._fleets;
	}
}