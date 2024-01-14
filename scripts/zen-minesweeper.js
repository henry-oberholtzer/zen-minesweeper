import { createNewMinefield } from './create-board.js';
import { floodFill, getAllType, coordsFromID, gameTemplate } from './logic.js';
import { getLocalStorageObject, setLocalStorage } from './local-storage.js';

// Global Variables
let firstClickHandler = () => {};
let clickHandler = () => {};
let flagCount = 0;
let hiddenTilesRemaining = 0;
let numberOfMines = 0;

localStorage.removeItem('currentGame');

// timer
let timerOn = false;
let intervalID;
let timeTotal = 0;
const timer = () => {
	if (timerOn) {
		timeTotal++;
		document.getElementById('timer').textContent = timeTotal;
	} else {
		clearInterval(intervalID);
	}
};
const startTimer = () => {
	timerOn = true;
	intervalID = setInterval(timer, 1000);
};

// Handle first click
const handleFirstClick = (gameBoard) => {
	return (gameSettings) => {
		return (e) => {
			const { mines, xDimension, yDimension } = gameSettings;
			console.log(mines);
			const [x, y] = coordsFromID(e.target.id);
			const newMinefield = createNewMinefield({
				...gameSettings,
				xOpen: x,
				yOpen: y,
			}); // generate minefield
			setLocalStorage('currentGame')(gameTemplate(newMinefield, gameSettings)); // push to local storage
			hiddenTilesRemaining = xDimension * yDimension;
			flagCount = mines;
			numberOfMines = mines;
			floodFill(x, y, newMinefield).forEach((tileID) =>
				revealTile(newMinefield)(tileID)
			);
			document.getElementById('mine-count').textContent = mines;
			gameBoard.removeEventListener('click', firstClickHandler);
			clickHandler = handleClick(newMinefield);
			gameBoard.addEventListener('click', clickHandler); // enable gameplay clicks
			gameBoard.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				handleContextMenu(e);
			});
			startTimer();
			console.log(newMinefield);
		};
	};
};

// Handles clicks to set flags
const handleContextMenu = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (classes.contains('hidden') && classes.contains('tile')) {
		if (classes.contains('flag')) {
			classes.remove('flag');
			flagCount++;
		} else if (flagCount !== 0) {
			classes.add('flag');
			flagCount--;
		}
	}
	document.getElementById('mine-count').textContent = flagCount;
};

// Check win
const checkWin = () => {
	if (hiddenTilesRemaining - numberOfMines === 0) {
		console.log('you win!!!!');
		timerOn = false;
		document.getElementById('game').removeEventListener('click', clickHandler);
	}
};

// Checks input and updates board

const revealTile = (minefield) => {
	return (tileID, gameOver = false) => {
		const classes = document.getElementById(tileID).classList;
		if (classes.contains('hidden')) {
			const [x, y] = coordsFromID(tileID);
			const tileType = minefield[y][x];
			classes.remove('hidden');
			hiddenTilesRemaining--;
			console.log(numberOfMines, hiddenTilesRemaining);
			gameOver === false ? checkWin() : null;
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

// Checks for visiblity of page
document.onvisibilitychange = () => {
	if (document.visibilityState === 'hidden') {
		console.log('stops the timer');
		console.log('set local storage to the current game data');
	} else {
		console.log('if there is a current game, restart the timer');
	}
};

// Starts the game board functions
document.addEventListener('DOMContentLoaded', () => {
	const gameBoard = document.getElementById('game');
	const defaultGameSettings = {
		xDimension: 8,
		yDimension: 8,
		mines: 4,
	};
	const firstClick = handleFirstClick(gameBoard)(defaultGameSettings);
	firstClickHandler = firstClick;
	if (getLocalStorageObject('currentGame')) {
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
