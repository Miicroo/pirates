class GameController {
	constructor() {
		this._gameState = new GameState();
		this._currentPlayerIndex = this._getStartingPlayerIndex();
		this._currentSubscription = undefined;
		this._rounds = 0;
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
		this._rounds++;

		if(this._rounds > 50) {
			return;
		}
		// Roll 2 dice
		const dice = [Dice.roll(), Dice.roll()];

		// Calculate possible positions for _currentPlayerIndex
		const state = this._gameState.getPlayerStates()[this._currentPlayerIndex];
		const ships = state.getShips();
		const possiblePositions = this._getPossiblePositions(ships, dice)
									  .concat(this._getPossiblePositions(ships, [dice[1], dice[0]]));

		if(possiblePositions.length > 0) {
			// Set up listener for _currentPlayerIndex
			this._currentSubscription = state.getPlayerSenderChannel().subscribe(data => this._getInputFromUser(data));
			// Send updates to _currentPlayerIndex
			state.getControllerSenderChannel().onNext(possiblePositions);
		} else {
			console.log(`No positions for ${state.getName()} with dice ${dice}`);
			this._nextRound();
		}
	}

	_getInputFromUser(data) {
		console.log(data);
		this._currentSubscription.dispose();

		const firstMove = data[0];
		const secondMove = data[1];

		// Evaluate move
		this._move(firstMove);
		this._move(secondMove);

		// TODO check conditions
		// Calculate next _currentPlayerIndex
		this._nextRound();
	}

	_move(move) {
		const playerState = this._gameState.getPlayerStates()[this._currentPlayerIndex];
		const ships = playerState.getShips();

		const newShips = ships.map(ship => {
			if(ship.getX() === move.from.x && ship.getY() === move.from.y) {
				return new Ship(move.to.x, move.to.y, ship.getColor());
			} else {
				return ship;
			}
		});
		playerState.setShips(newShips);

		// Send updates to everyone
		this.getUpdateChannel().onNext({'action': 'shipMoved',
										'data': {
													'player': playerState.getName(),
													'ship': {
														'from': new Ship(move.from.x, move.from.y, ships[0].getColor()),
														'to': new Ship(move.to.x, move.to.y, ships[0].getColor())
													}
												}
										}
									);
	}

	_nextRound() {
		this._currentPlayerIndex = (this._currentPlayerIndex + 1) % (this._gameState.getPlayers().length);
		window.c = this;
		setTimeout(function() {window.c._playRound()}, 1000);
	}

	_getPossiblePositions(ships, dice) {
		// Try first die, then second die
		const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
		const d1Directions = directions.map(dir => ships.map(ship => this._getPositionsForDie(ship, dice[0], dir)))
										.reduce((a,b) => a.concat(b), [])
										.filter(path => this._canTravelOnAll(path, new GameBoardWithShips(this.getGameBoardGrid(), ships)));
		const allMoves = d1Directions.map(newDirArray => {
				return {'from': newDirArray[0], 'to': newDirArray[newDirArray.length-1]};
			}).map(move => {
				const newShipPositions = ships.map(ship => {
					if(ship.getX() == move.from.x && ship.getY() == move.from.y) {
						return new Ship(move.to.x, move.to.y, ship.getColor());
					} else {
						return ship;
					}
				}); // All your ships (with those that have moved set on their new position)

				return newShipPositions.map(ship => {
					return directions.map(dir => this._getPositionsForDie(ship, dice[1], dir))
								.filter(path => this._canTravelOnAll(path, new GameBoardWithShips(this.getGameBoardGrid(), newShipPositions)))
								.map(newDirArray => {
									return [move, {'from': newDirArray[0], 'to': newDirArray[newDirArray.length-1]}];
								});
				}).reduce((a,b) => a.concat(b), []);
		}).reduce((a,b) => a.concat(b), []);
		
		return allMoves;
	}

	_getPositionsForDie(ship, die, direction) {
		const retVal = [];
		let func = undefined;
		if(direction === 'UP') {
			func = (xy) => { return {'x':xy.x,'y':xy.y-1};};
		} else if(direction === 'DOWN') {
			func = (xy) => { return {'x':xy.x,'y':xy.y+1};};
		} else if(direction === 'LEFT') {
			func = (xy) => { return {'x':xy.x-1,'y':xy.y};};
		} else if(direction === 'RIGHT') {
			func = (xy) => { return {'x':xy.x+1,'y':xy.y};};
		}

		let xy = {'x':ship.getX(), 'y':ship.getY()};
		retVal.push(xy);

		for(let i = 0; i<die; i++) {
			xy = func(xy);
			retVal.push(xy);
		}

		return retVal;
	}

	_canTravelOnAll(gridPositions, gameBoard) {
		return gridPositions.slice(1, gridPositions.length)
				.map(position => this._getPositionOnGrid(position, gameBoard.getGrid()))
				.every(node => node.passable);
	}

	_getPositionOnGrid(position, grid) {
		return grid[position.y] ? 
					(grid[position.y][position.x] ?	grid[position.y][position.x] : {'passable': false})
					:
					{'passable': false};
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

	setShips(ships) {
		this._ships = ships;
	}
}