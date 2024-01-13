import { openNewField } from './create-board.js';
import { floodFill, getAllType } from './logic.js';

const xDimension = 50;
const yDimension = 20;
let gameOver = false;
let currentGame = [];
const revealedTiles = [];

// Handle first click
const handleFirstClick = (e) => {
	const openingMove = e.target.id.split('.');
	const x = parseInt(openingMove[0]);
	const y = parseInt(openingMove[1]);
	const newGame = {
		mines: 200,
		xDimension: xDimension,
		yDimension: yDimension,
		xOpen: x,
		yOpen: y,
	};
	currentGame = openNewField(newGame);
	gameOver = false;
	floodFill(x, y, currentGame).forEach((tileID) => revealTile(tileID));
	game.removeEventListener('click', handleFirstClick);
	game.addEventListener('click', (e) => handleClick(e));
	console.log('start timer');
};

// Handles clicks to set flags
const handleContextMenu = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (classes.contains('hidden') && classes.contains('tile')) {
		classes.toggle('flag');
	}
};

// Checks input and updates board;
const revealTile = (tileID) => {
	const classes = document.getElementById(tileID).classList;
	if (classes.contains('hidden')) {
		const move = tileID.split('.');
		const x = parseInt(move[0]);
		const y = parseInt(move[1]);
		const tileType = currentGame[y][x];
		classes.remove('hidden');
		switch (tileType) {
			case 1:
				classes.add('one');
				break;
			case 2:
				classes.add('two');
				break;
			case 3:
				classes.add('three');
				break;
			case 4:
				classes.add('four');
				break;
			case 5:
				classes.add('five');
				break;
			case 6:
				classes.add('six');
				break;
			case 7:
				classes.add('seven');
				break;
			case 8:
				classes.add('eight');
				break;
			case 'mine':
				gameOver ? classes.add('mine') : classes.add('mine', 'detonated');
				gameOver = true;
				getAllType('mine', currentGame).forEach((tileID) => revealTile(tileID));
				break;
			case 'blank':
				floodFill(x, y, currentGame).forEach((tileID) => revealTile(tileID));
				break;
		}
	}
};

// Handles clicks to set flags and reveal squares
const handleClick = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (classes.contains('tile') && !classes.contains('flag')) {
		revealTile(e.target.id);
		// to be dynamic with the type of tile
	}
};

// Generates tiles on the screen
const game = document.getElementById('game');
const appendTiles = (xDimension, yDimension) => {
	for (let x = 0; x < xDimension; x++) {
		for (let y = 0; y < yDimension; y++) {
			let tile = document.createElement('div');
			tile.classList.add('tile', 'hidden');
			tile.style.gridColumn = x + 1;
			tile.style.gridRow = y + 1;
			tile.id = `${x}.${y}`;
			game.append(tile);
		}
	}
};
appendTiles(xDimension, yDimension);

// Enables user input
game.addEventListener('click', handleFirstClick);
game.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	handleContextMenu(e);
});
