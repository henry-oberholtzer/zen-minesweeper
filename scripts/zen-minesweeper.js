/*
    Zen Minesweeper - a lightweight JS implmentation of Minesweeper for the browser
    Copyright (C) 2024  Henry Oberholtzer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { createNewMinefield } from './create-board.js';
import { floodFill, getAllType, coordsFromID, gameTemplate } from './logic.js';
import { getLocalStorageObject, setLocalStorage } from './local-storage.js';

// Global Variables
let firstClickHandler = () => {};
let clickHandler = () => {};
let contextMenu = () => {};
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
			contextMenu = (e) => {
				e.preventDefault();
				handleContextMenu(e);
			};
			gameBoard.addEventListener('click', clickHandler); // enable gameplay clicks
			gameBoard.addEventListener('contextmenu', contextMenu);
			startTimer();
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
			console.log('hello');
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

// handle losing the game
const handleGameOver = (minefield) => {
	getAllType('mine', minefield).forEach((tileID) =>
		revealTile(minefield)(tileID, true)
	);
	timerOn = false;
	document.getElementById('game').removeEventListener('click', clickHandler);
	document
		.getElementById('game')
		.removeEventListener('contextmenu', contextMenu);
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
					handleGameOver(minefield);

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

// Resets the game board
const resetGame = () => {
	localStorage.removeItem('currentGame');
	const gameBoard = document.getElementById('game');
	gameBoard.innerHTML = '';
	gameBoard.removeEventListener('click', clickHandler);
	gameBoard.removeEventListener('contextmenu', contextMenu);
	clearInterval(intervalID);
	timerOn = false;
	timeTotal = 0;
	document.getElementById('timer').textContent = timeTotal;
	flagCount = 0;
	document.getElementById('mine-count').textContent = flagCount;
	const defaultGameSettings = {
		xDimension: 50,
		yDimension: 20,
		mines: 200,
	};
	const firstClick = handleFirstClick(gameBoard)(defaultGameSettings);
	firstClickHandler = firstClick;
	const { xDimension, yDimension } = defaultGameSettings;
	appendTiles(gameBoard)(xDimension, yDimension);
	gameBoard.addEventListener('click', firstClickHandler);
};

// Starts the game board functions
document.addEventListener('DOMContentLoaded', () => {
	const reset = document.getElementById('mineLogo');
	reset.addEventListener('click', resetGame);
	if (getLocalStorageObject('currentGame')) {
		console.log('true local storage');
		// render html board per previous game ->
		// render previous game tile settings ->
		// start game timer again
	} else {
		resetGame();
	}
});
