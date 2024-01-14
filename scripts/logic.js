export const getNeighboringTilesLocations = (x, y, xLimit, yLimit) => {
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

const getFill = (x, y, twoDimensionalArray, listToFill) => {
	const neighbors = getNeighboringTilesLocations(
		x,
		y,
		twoDimensionalArray[0].length - 1,
		twoDimensionalArray.length - 1
	);
	neighbors.forEach((neighbor) => {
		const [x, y] = neighbor;
		const tile = twoDimensionalArray[y][x];
		if (!listToFill.includes(`${x}.${y}`)) {
			if (tile !== 'mine' && tile !== 'blank') {
				listToFill.push(`${x}.${y}`);
			} else if (tile === 'blank') {
				listToFill.push(`${x}.${y}`);
				getFill(x, y, twoDimensionalArray, listToFill);
			}
		}
	});
};

export const floodFill = (x, y, twoDimensionalArray) => {
	const listToFill = [`${x}.${y}`];
	getFill(x, y, twoDimensionalArray, listToFill);
	return listToFill;
};

export const getAllType = (type, twoDimensionalArray) => {
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

export const coordsFromID = (tileID) => {
	const [x, y] = tileID.split('.');
	return [parseInt(x), parseInt(y)];
};

export const gameTemplate = (minefield, gameSettings) => {
	return {
		xDimension: gameSettings.xDimension,
		yDimension: gameSettings.yDimension,
		mines: gameSettings.mines,
		minefield: minefield,
		tilesRevealed: [],
	};
};
