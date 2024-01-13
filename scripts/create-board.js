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

const getNeighboringTilesLocations = (x, y, xLimit, yLimit) => {
	const neighbors = [];
	for (let i = -1; i < 2; i++) {
		const newX = x + i;
		if (newX < 0 || newX > xLimit) {
		} else {
			for (let j = -1; j < 2; j++) {
				const newY = y + j;
				if (newY < 0 || newY > yLimit) {
				} else {
					neighbors.push([newX, newY]);
				}
			}
		}
	}
	return neighbors;
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
	emptyBoard[yOpen][xOpen] = 'blank';
	console.log(generateProximity(placeMines(emptyBoard, mines)));
};
