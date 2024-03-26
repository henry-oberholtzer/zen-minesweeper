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

import { createNewMinefield } from './board.js';
import { floodFill, getAllType, coordsFromID, gameTemplate } from './logic.js';
import { getLocalStorageObject, setLocalStorage } from './local-storage.js';
import { enableSettings } from './settings.js';
localStorage.removeItem('currentGame');

// Global Variables
let mouseHandler = () => {};
let contextMenu = () => {};
let flagCount = 0;
let hiddenTilesRemaining = 0;
let numberOfMines = 0;

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
const resetTimer = () => {
	clearInterval(intervalID);
	timerOn = false;
	timeTotal = 0;
};

const startTimer = () => {
	timerOn = true;
	intervalID = setInterval(timer, 1000);
};
const pauseTimer = () => {
	timerOn = false;
	clearInterval(intervalID);
};

// Handle first click
const handleFirstClick = (e) => {
	const settings = getLocalStorageObject('settings');
	const { mines, xDimension, yDimension } = settings;
	const [x, y] = coordsFromID(e.target.id);
	const newMinefield = createNewMinefield({
		...settings,
		xOpen: x,
		yOpen: y,
	}); // generate minefield
	setLocalStorage('currentGame')(gameTemplate(newMinefield, settings)); // push to local storage
	hiddenTilesRemaining = xDimension * yDimension;
	flagCount = mines;
	numberOfMines = mines;
	floodFill(x, y, newMinefield).forEach((tileID) => {
		revealTile(newMinefield)(tileID);
	});
	document.getElementById('mine-count').textContent = mines;
	const game = document.getElementById('game');
	game.removeEventListener('click', handleFirstClick);
	mouseHandler = handleMouseDown(newMinefield);
	contextMenu = (e) => {
		e.preventDefault();
	};
	game.addEventListener('mousedown', mouseHandler);
	game.addEventListener('contextmenu', contextMenu);
	startTimer();
};

// Handles clicks to set flags
const setFlag = (e) => {
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

// Manages touch screen input
const handleMouseDown = (minefield) => {
	return (e) => {
		if (e.button === 0) {
			revealTile(minefield)(e.target.id);
		} else {
			setFlag(e);
		}
	};
};

const removeAllListeners = () => {
	const game = document.getElementById('game');
	game.removeEventListener('mousedown', mouseHandler);
	game.removeEventListener('contextmenu', contextMenu);
};

// Check win
const checkWin = () => {
	if (hiddenTilesRemaining - numberOfMines === 0) {
		pauseTimer();
		removeAllListeners();
		createModal(true);
	}
};

// handle losing the game
const handleGameOver = (minefield) => {
	getAllType('mine', minefield).forEach((tileID) =>
		revealTile(minefield)(tileID, true)
	);
	pauseTimer();
	removeAllListeners();
	createModal(false);
};

const createModal = (WinBoolean) => {
	const h2 = document.createElement('h2');
	h2.id = 'modal';
	h2.textContent = WinBoolean ? 'you win!' : 'game over';
	h2.style.color = WinBoolean ? '#008000' : 'rgb(255, 0, 0)';
	document.getElementById('game').style.opacity = '0.3';
	document.getElementById('main').append(h2);
};

const clearModal = () => {
	const modal = document.getElementById('modal');
	modal ? modal.remove() : '';
	document.getElementById('game').style.opacity = '1.0';
};

// Checks input and updates board
const revealTile = (minefield) => {
	return (tileID, gameOver = false) => {
		const classes = document.getElementById(tileID).classList;
		if (
			classes.contains('hidden') &&
			classes.contains('tile') &&
			!classes.contains('flag')
		) {
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
					if (gameOver) {
						classes.add('mine');
					} else {
						classes.add('mine', 'detonated');
						handleGameOver(minefield);
					}
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

// Checks for visiblity of page
document.onvisibilitychange = () => {
	const currentGame = getLocalStorageObject('currentGame');
	if (document.visibilityState === 'hidden') {
		pauseTimer();
		console.log('set local storage to the current game data');
	} else {
		if (currentGame) {
			startTimer();
		}
	}
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

// Resets the game board
const resetGame = () => {
	localStorage.removeItem('currentGame');
	const game = document.getElementById('game');
	game.innerHTML = '';
	removeAllListeners();
	resetTimer();
	clearModal();
	flagCount = 0;
	document.getElementById('timer').textContent = timeTotal;
	document.getElementById('mine-count').textContent = flagCount;
	const settings = getLocalStorageObject('settings');
	const { xDimension, yDimension } = settings;
	appendTiles(game)(xDimension, yDimension);
	document.getElementById('header').style.width = `${xDimension * 32}px`;
	document.getElementById('footer').style.width = `${xDimension * 32}px`;
	game.addEventListener('click', handleFirstClick);
};

// Starts the game board functions
document.addEventListener('DOMContentLoaded', () => {
	enableSettings(resetGame);
	document.getElementById('mineLogo').addEventListener('click', resetGame);
	if (getLocalStorageObject('currentGame')) {
		// render html board per previous game ->
		// render previous game tile settings ->
		// start game timer again
	} else {
		resetGame();
	}
});
