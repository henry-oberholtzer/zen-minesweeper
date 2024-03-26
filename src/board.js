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
	const mineArray = [...array2D];
	const yMax = mineArray.length;
	const xMax = mineArray[0].length;

	let m = 0;
	do {
		const x = randomInt(xMax);
		const y = randomInt(yMax);
		if (mineArray[y][x] != 0) {
			continue;
		}
		else
		{
			mineArray[y][x] = 'mine';
			m++;
		}
	} while (m < mines) 
	return mineArray;
};

const getNeighborTiles = (x, y, xLimit, yLimit) => {
	const neighbors = [];
	for (let i = -1; i < 2; i++) {
		const newY = y + i;
		if (newY < 0 || yLimit <= newY) {
		} else {
			for (let j = -1; j < 2; j++) {
				const newX = x + j;
				if (newX < 0 || xLimit <= newX) {
				} else {
					neighbors.push([newX, newY]);
				}
			}
		}
	}

	return neighbors;
};

// Maps proximity to the array
const getProximity = (twoDimensionArray) => {
	const proximityArray = twoDimensionArray.map((xArray, y) => {
		return xArray.map((tile, x) => {
			if (tile === 'mine') {
				return tile;
			} else {
				let mineCount = 0;
				getNeighborTiles(
					x,
					y,
					twoDimensionArray[0].length,
					twoDimensionArray.length
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
const newMinefield = (newGame) => {
	const { xDimension, yDimension, xOpen, yOpen, mines } = newGame;
	let emptyBoard = empty2D(xDimension, yDimension);
	getNeighborTiles(xOpen, yOpen, xDimension, yDimension).forEach(
		(location) => {
			const [x, y] = location;
			emptyBoard[y][x] = 'blank';
		}
	);
	return getProximity(placeMines(emptyBoard, mines));
};

export { empty2D, randomInt, placeMines, getProximity, getNeighborTiles, newMinefield }
