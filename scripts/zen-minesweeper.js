import { openNewField } from './create-board.js';

// Set game board to size of user's screen
const screenHeight = screen.availHeight;
const screenWidth = screen.availWidth;
console.log(screenHeight, screenWidth);
const xDimension = Math.round(screenWidth / 32);
const yDimension = Math.round(screenHeight / 32);

// Handle first click
const handleFirstClick = (e) => {
	const openingMove = e.target.id.split('.');
	const newGame = {
		mines: 80,
		xDimension: xDimension,
		yDimension: yDimension,
		xOpen: parseInt(openingMove[0]) - 1,
		yOpen: parseInt(openingMove[1]) - 1,
	};
	console.log(newGame);
	openNewField(newGame);
};

// Handles clicks to set flags
const handleContextMenu = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (classes.contains('hidden') && classes.contains('tile')) {
		classes.toggle('flag');
	}
};

// Handles clicks to set flags and reveal squares
const handleClick = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (classes.contains('hidden'))
		if (classes.contains('tile') && !classes.contains('flag')) {
			console.log(
				'checks the type with the game data, updates game data and adds the appropriate revealed!'
			);
			classes.remove('hidden');
			classes.add('revealed', 'one'); // to be dynamic with the type of tile
		}
};

// Generates tiles on the screen
const game = document.getElementById('game');
const appendTiles = (xDimension, yDimension) => {
	for (let x = 1; x <= xDimension; x++) {
		for (let y = 1; y <= yDimension; y++) {
			let tile = document.createElement('div');
			tile.classList.add('tile', 'hidden');
			tile.style.gridColumn = x;
			tile.style.gridRow = y;
			tile.id = `${x}.${y}`;
			game.append(tile);
		}
	}
};

appendTiles(xDimension, yDimension);

// Enables user input
game.addEventListener('click', (e) => handleFirstClick(e));
// game.addEventListener('click', (e) => handleClick(e));
game.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	handleContextMenu(e);
});
