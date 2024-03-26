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

import { getNeighboringTilesLocations } from './logic.js';

// Creates empty array
const empty2D = (x, y) => {
	return new Array(y).fill().map(() => {
		return new Array(x).fill(0);
	})
};

// Generates random integers
const randomInt = (max) => Math.floor(Math.random() * max);


const placeMines = (array2D, mines) => {
	if (mines > array2D.flat().filter((num) => num === 0).length) {
		throw new RangeError("The number of mines must be less than or equal to the size of the array minus preset blank tiles.")
	}
	const arrayWithMines = [...array2D];
	const yMax = arrayWithMines.length;
	const xMax = arrayWithMines[0].length;

	let m = 0;
	do {
		const x = randomInt(xMax);
		const y = randomInt(yMax);
		if (arrayWithMines[y][x] != 0) {
			continue;
		}
		else
		{
			arrayWithMines[y][x] = 'mine';
			m++;
		}
	} while (m < mines) 
	return arrayWithMines;
};

// Maps proximity to the array
const generateProximity = (twoDimensionArray) => {
	const proximityArray = twoDimensionArray.map((xArray, y) => {
		return xArray.map((tile, x) => {
			if (tile === 'mine') {
				return tile;
			} else {
				let mineCount = 0;
				getNeighboringTilesLocations(
					x,
					y,
					twoDimensionArray[0].length - 1,
					twoDimensionArray.length - 1
				).forEach((location) => {
					const [x, y] = location;
					if (twoDimensionArray[y][x] === 'mine') {
						mineCount++;
					}
				});
				if (mineCount > 0) {
					return mineCount;
				} else {
					return 'blank';
				}
			}
		});
	});
	return proximityArray;
};

// Handles the new minefield
export const createNewMinefield = (newGame) => {
	const { xDimension, yDimension, xOpen, yOpen, mines } = newGame;
	let emptyBoard = empty2D(xDimension, yDimension);
	getNeighboringTilesLocations(xOpen, yOpen, xDimension, yDimension).forEach(
		(location) => {
			const [x, y] = location;
			emptyBoard[y][x] = 'blank';
		}
	);
	return generateProximity(placeMines(emptyBoard, mines));
};

export { empty2D, randomInt, placeMines }
