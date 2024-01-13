import { createNewMinefield } from './create-board.js';
import { floodFill, getAllType } from './logic.js';
localStorage.removeItem('currentGame');
const setLocalStorage = (objectName) => {
	return (object) => localStorage.setItem(objectName, JSON.stringify(object));
};
const getLocalStorage = (objectName) => localStorage.getItem(objectName);
const getLocalStorageObject = (objectName) =>
	JSON.parse(localStorage(objectName));

const gameTemplate = (minefield, gameSettings) => {
	return {
		xDimension: gameSettings.xDimension,
		yDimension: gameSettings.yDimension,
		mines: gameSettings.mines,
		minefield: minefield,
		tilesRevealed: [],
	};
};

const coordsFromID = (tileID) => {
	const [x, y] = tileID.split('.');
	return [parseInt(x), parseInt(y)];
};

// Handle first click
const handleFirstClick = (gameBoard) => {
	return (defaultGameSettings) => {
		return (e) => {
			const [x, y] = coordsFromID(e.target.id);
			const newGameSettings = { ...defaultGameSettings, xOpen: x, yOpen: y };
			const newMinefield = createNewMinefield(newGameSettings); // generate minefield
			console.log(gameTemplate(newMinefield, defaultGameSettings));
			setLocalStorage('currentGame')(
				gameTemplate(newMinefield, defaultGameSettings)
			); // push to local storage
			floodFill(x, y, newMinefield).forEach((tileID) =>
				revealTile(newMinefield)(tileID)
			);
			gameBoard.removeEventListener('click', firstClickHandler);
			gameBoard.addEventListener('click', (e) => handleClick(newMinefield)(e)); // enable gameplay clicks
			console.log('start timer');
		};

		// -> start timer
	};
};

// Handles clicks to set flags
const handleContextMenu = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (classes.contains('hidden') && classes.contains('tile')) {
		classes.toggle('flag');
	}
};

// Checks input and updates board;
const revealTile = (minefield) => {
	return (tileID, gameOver = false) => {
		const classes = document.getElementById(tileID).classList;
		if (classes.contains('hidden')) {
			const [x, y] = coordsFromID(tileID);
			const tileType = minefield[y][x];
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
					getAllType('mine', minefield).forEach((tileID) =>
						revealTile(minefield)(tileID, true)
					);
					break;
				case 'blank':
					floodFill(x, y, minefield).forEach((tileID) =>
						revealTile(minefield)(tileID)
					);
					break;
			}
		}
	};
};

// Handles clicks to set flags and reveal squares
const handleClick = (minefield) => {
	return (e) => {
		const classes = document.getElementById(e.target.id).classList;
		if (classes.contains('tile') && !classes.contains('flag')) {
			revealTile(minefield)(e.target.id);
			// to be dynamic with the type of tile
		}
	};
};

// Generates tiles on the screen

const appendTiles = (gameHTML) => {
	return (xDimension, yDimension) => {
		for (let x = 0; x < xDimension; x++) {
			for (let y = 0; y < yDimension; y++) {
				let tile = document.createElement('div');
				tile.classList.add('tile', 'hidden');
				tile.style.gridColumn = x + 1;
				tile.style.gridRow = y + 1;
				tile.id = `${x}.${y}`;
				gameHTML.append(tile);
			}
		}
	};
};

// Enables user input

game.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	handleContextMenu(e);
});

document.onvisibilitychange = () => {
	if (document.visibilityState === 'hidden') {
		console.log('set local storage to the current game data');
	}
};

let firstClickHandler = () => {};

document.addEventListener('DOMContentLoaded', () => {
	const gameBoard = document.getElementById('game');
	const defaultGameSettings = {
		xDimension: 50,
		yDimension: 20,
		mines: 200,
	};
	const firstClick = handleFirstClick(gameBoard)(defaultGameSettings);
	firstClickHandler = firstClick;
	if (getLocalStorage('currentGame')) {
		console.log('true local storage');
		// render html board per previous game ->
		// render previous game tile settings ->
		// start game timer again
	} else {
		console.log('false local storage');
		const { xDimension, yDimension } = defaultGameSettings;
		appendTiles(gameBoard)(xDimension, yDimension); // render board per defaults
		game.addEventListener('click', firstClickHandler); // enable first click;
	}
});
