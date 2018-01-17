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
		this._playRound();
	}

	_playRound() {
		// Roll 2 dice
		const dice = [Dice.roll(), Dice.roll()];
		console.log(dice);

		// Calculate possible positions for _currentPlayerIndex
		const state = this._gameState.getPlayerStates()[this._currentPlayerIndex];
		const ships = state.getShips();
		const possiblePositions = this._getPossiblePositions(ships, dice);
		// Send updates to _currentPlayerIndex
		// Wait for _currentPlayerIndex
		// Evaluate move
		// Send updates to everyone
		// Calculate next _currentPlayerIndex
	}

	_getPossiblePositions(ships, dice) {
		// Try first die, then second die
		const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
		const d1Directions = directions.map(d => ships.map(ship => this._getPositionsForDie(ship, dice[0], d)));
		console.log(d1Directions);
		// ships.map(ship => )
	}

	_getPositionsForDie(ship, die, direction) {
		const retVal = [];
		let func = undefined;
		if(direction === 'UP') {
			func = (x, y) => { return {'x':x,'y':y-1};};
		} else if(direction === 'DOWN') {
			func = (x, y) => { return {'x':x,'y':y+1};};
		} else if(direction === 'LEFT') {
			func = (x, y) => { return {'x':x-1,'y':y};};
		} else if(direction === 'RIGHT') {
			func = (x, y) => { return {'x':x+1,'y':y};};
		}
		let x = ship.getX();
		let y = ship.getY();
		for(let i = 0; i<die; i++) {
			const xyObj = func(x, y);
			retVal.push(xyObj);
			x = xyObj.x;
			y = xyObj.y;
		}

		return retVal;
	}
	_canTravelOnAll(gridPositions) {
		// TODO dont forget ships
		return gridPositions.map(position => getGameBoardGrid()[position.y][position.x])
				.every(node => node.passable);
	}

	_broadcastInitialShips() {
		const states = this._gameState.getPlayerStates();
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

	getPlayerStates() {
		return this._playerStates;
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