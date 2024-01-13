import { getNeighboringTilesLocations } from './logic.js';

// Creates empty array
const emptyTwoDimensionArray = (xDimension, yDimension) => {
	const verticalArray = new Array(yDimension).fill(0);
	const fullArray = verticalArray.map(() => {
		return new Array(xDimension).fill(0);
	});
	return fullArray;
};

// Generates random integers
const randomInt = (max) => Math.floor(Math.random() * max);

const placeMines = (twoDimensionArray, mines) => {
	const arrayWithMines = [...twoDimensionArray];
	const yMax = arrayWithMines.length - 1;
	const xMax = arrayWithMines[0].length - 1;
	for (let m = 0; m <= mines; ) {
		const x = randomInt(xMax);
		const y = randomInt(yMax);
		if (arrayWithMines[y][x] !== 'blank') {
			arrayWithMines[y][x] = 'mine';
			m++;
		}
	}
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
export const openNewField = (newGame) => {
	const { xDimension, yDimension, xOpen, yOpen, mines } = newGame;
	let emptyBoard = emptyTwoDimensionArray(xDimension, yDimension);
	getNeighboringTilesLocations(xOpen, yOpen, xDimension, yDimension).forEach(
		(location) => {
			const [x, y] = location;
			emptyBoard[y][x] = 'blank';
			console.log(location);
		}
	);
	return generateProximity(placeMines(emptyBoard, mines));
};
