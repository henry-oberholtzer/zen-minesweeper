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

const empty2D = (x, y) => {
	return new Array(y).fill().map(() => {
		return new Array(x).fill(0);
	})
};

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
		for (let j = -1; j < 2; j++) {
			const newX = x+i;
			const newY = y+j;
			if (newX < 0 || newY < 0) {
				continue;
			}
			if (xLimit <= newX || yLimit <= newY) {
				continue;
			}
			if (newX == y && newY == x) {
				continue;
			}
			neighbors.push([newX, newY]);
		}
	}
	return neighbors;
};

const getProximity = (array2D) => {
	return array2D.map((xArray, y) => {
		return xArray.map((tile, x) => {
			if (tile === 'mine') {
				return tile;
			} else {
				let mineCount = 0;
				const neighbors = getNeighborTiles(x, y, array2D[0].length, array2D.length)
				neighbors.forEach((location) => {
					const [x, y] = location;
					if (array2D[y][x] === 'mine') {
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
};

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

const getFill = (coords, array2D, xLimit, yLimit, toFill) => {
	const neighbors = getNeighborTiles(coords[0], coords[1], xLimit, yLimit);
	neighbors.forEach((tile) => {
		const [x, y] = tile;
		const tileType = array2D[y][x];
		if (!toFill.has(tile)) {
			if (tileType !== 'mine' && tileType !== 'blank') {
				toFill.add(tile);
			} else if (tileType === 'blank') {
				toFill.add(coords);
				getFill(tile, array2D, xLimit, yLimit, toFill);
			}
		}
	});
};

const floodFill = (coords, array2D) => {
	const toFill = new Set([coords])
	const xLimit = array2D[0].length;
	const yLimit = array2D.length;
	getFill(coords, array2D, xLimit, yLimit, toFill);
	return Array.from(toFill);
};

const getTypeCoordinates = (type, twoDimensionalArray) => {
	const typeIDs = [];
	twoDimensionalArray.forEach((row, y) => {
		row.forEach((tile, x) => {
			if (tile === type) {
				typeIDs.push(`${x}.${y}`);
			}
		});
	});
	return typeIDs;
};

const idFromCoords = (coords) => `${coords[0]}.${coords[1]}`

const coordsFromID = (tileID) => tileID.split('.').map((i) => parseInt(i));

export const gameTemplate = (minefield, gameSettings) => {
	return {
		xDimension: gameSettings.xDimension,
		yDimension: gameSettings.yDimension,
		mines: gameSettings.mines,
		minefield: minefield,
		tilesRevealed: [],
	};
};

export { idFromCoords, coordsFromID, getTypeCoordinates, empty2D, randomInt, placeMines, getProximity, getNeighborTiles, newMinefield, floodFill }
