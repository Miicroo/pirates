class GameController {
	constructor() {
		this._gameState = new GameState();
		this._currentPlayerIndex = this._getStartingPlayerIndex();
	}

	_getStartingPlayerIndex() {
		return 3;
	}

	getGameBoardGrid() {
		return this._gameState.getGameBoard().getGrid();
	}

	getUpdateChannel() {
		return this._gameState.getUpdateChannel();	
	}

	start() {
		this._broadcastInitialShips();
	}

	_playRound() {
		// Roll 2 dice
		// Calculate possible positions for _currentPlayerIndex
		// Send updates to _currentPlayerIndex
		// Wait for _currentPlayerIndex
		// Evaluate move
		// Send updates to everyone
		// Calculate next _currentPlayerIndex
	}

	_broadcastInitialShips() {
		const states = this._gameState._playerStates; // FIXME
		states.forEach(state => {
			state.getShips().forEach(ship => {
				this.getUpdateChannel().onNext({'action': 'shipAdded', 'data': {'player': state.getName(), 'ship': ship}});
			});
		});
	}
}

class GameState {
	constructor() {
		this._updateChannel = new Rx.Subject();
		this._gameBoard = new GameBoard();
		this._playerStates = this._createPlayerStates();
		this._players = this._createPlayers(this._playerStates, this._updateChannel);
	}

	_createPlayerStates() {
		const playerStates = [];

		playerStates.push(new PlayerState('Spain', this._createFleet('#ffffff', 7, 0, x => x+1, y => y), new Rx.Subject(), new Rx.Subject()));
		playerStates.push(new PlayerState('Arabia', this._createFleet('#7E0CCA', 0, 7, x => x, y => y+1), new Rx.Subject(), new Rx.Subject()));
		playerStates.push(new PlayerState('France', this._createFleet('#088362', 19, 10, x => x, y => y+1), new Rx.Subject(), new Rx.Subject()));
		playerStates.push(new PlayerState('Pirates', this._createFleet('#000000', 10, 19, x => x+1, y => y), new Rx.Subject(), new Rx.Subject()));

		return playerStates;
	}

	_createPlayers(playerStates, updateChannel) {
		return playerStates.map(state => {
			if(state.getName() === 'Pirates') {
				return new Human(state.getName(), state.getShips(), state.getControllerSenderChannel(), state.getPlayerSenderChannel(), updateChannel);
			} else {
				return new Bot(state.getName(), state.getShips(), state.getControllerSenderChannel(), state.getPlayerSenderChannel(), updateChannel);
			}
		});
	}

	_createFleet(colour, startX, startY, transformX, transformY) {
		const ships = [];
		const numberOfShips = 3;
		let x = startX;
		let y = startY;
		for(let i = 0; i< numberOfShips; i++) {
			ships.push(new Ship(x, y, colour));
			x = transformX(x);
			y = transformY(y);
		}
		return ships;
	}

	getUpdateChannel() {
		return this._updateChannel;
	}

	getGameBoard() {
		return this._gameBoard;
	}

	getPlayers() {
		return this._players;
	}
}

class PlayerState {
	constructor(name, ships, controllerSenderChannel, playerSenderChannel) {
		this._name = name;
		this._ships = ships;
		this._controllerSenderChannel = controllerSenderChannel;
		this._playerSenderChannel = playerSenderChannel;
	}

	getName() {
		return this._name;
	}

	getShips() {
		return this._ships;
	}

	getControllerSenderChannel() {
		return this._controllerSenderChannel;
	}

	getPlayerSenderChannel() {
		return this._playerSenderChannel;
	}
}