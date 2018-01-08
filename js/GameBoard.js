class GameBoard {
	constructor() {
		this._setUpGrid();
	}

	_setUpGrid() {
		this._grid = [];

		const f = {'name': 'forrest', 'passable': false};
		const t = {'name': 'tundra', 'passable': false};
		const d = {'name': 'desert', 'passable': false};
		const i = {'name': 'island', 'passable': false};
		const w = {'name': 'water'};
		const p = {'name': 'passage', 'passable': false};
		const h = {'name': 'harbour'};

		this._grid[0]  = [d,d,d,d,d,w,w,w,w,w,h,d,d,d,d,d,d,d,d,d];
		this._grid[1]  = [d,d,d,d,d,w,w,d,d,d,d,d,d,d,d,d,d,d,d,d];
		this._grid[2]  = [d,d,d,d,d,w,w,w,d,d,d,w,d,d,d,d,d,d,d,d];
		this._grid[3]  = [d,d,d,d,w,w,w,p,w,w,w,w,w,w,w,w,d,d,d,t];
		this._grid[4]  = [d,d,d,w,d,w,w,w,p,w,w,w,w,w,w,w,w,d,t,t];
		this._grid[5]  = [w,w,w,w,w,w,w,w,w,p,w,w,w,w,w,w,w,t,t,t];
		this._grid[6]  = [w,w,w,w,w,w,w,w,w,w,p,w,w,w,w,w,w,t,t,t];
		this._grid[7]  = [w,d,w,p,w,w,w,w,w,w,w,p,w,w,w,w,w,t,t,t];
		this._grid[8]  = [w,d,d,w,p,w,w,w,w,h,h,w,p,w,w,w,w,w,t,t];
		this._grid[9]  = [w,d,d,w,w,p,w,w,h,i,i,h,w,p,w,w,w,t,t,h];
		this._grid[10] = [h,d,d,w,w,w,p,w,h,i,i,h,w,w,p,w,w,t,t,w];
		this._grid[11] = [d,d,w,w,w,w,w,p,w,h,h,w,w,w,w,p,w,t,t,w];
		this._grid[12] = [d,d,d,w,w,w,w,w,p,w,w,w,w,w,w,w,p,w,t,w];
		this._grid[13] = [d,d,d,w,w,w,w,w,w,p,w,w,w,w,w,w,w,w,w,w];
		this._grid[14] = [d,d,d,w,w,w,w,w,w,w,p,w,w,w,w,w,w,w,w,w];
		this._grid[15] = [d,d,d,w,w,w,w,w,w,w,w,p,w,w,w,i,w,f,t,t];
		this._grid[16] = [d,d,f,f,w,w,w,w,w,w,w,w,p,w,w,w,f,f,t,t];
		this._grid[17] = [f,f,f,f,f,f,f,f,w,f,f,f,w,w,w,f,f,f,f,t];
		this._grid[18] = [f,f,f,f,f,f,f,f,f,f,f,f,f,w,w,f,f,f,f,f];
		this._grid[19] = [f,f,f,f,f,f,f,f,f,h,w,w,w,w,w,f,f,f,f,f];
	}

	getGrid() {
		return this._grid;
	}
}