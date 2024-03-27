import {
	empty2D,
	getNeighborTiles,
	getProximity,
	newMinefield,
	placeMines,
	randomInt,
	idFromCoords,
	coordsFromID,
	getTypeCoordinates,
	floodFill,
} from '../src/board';

const m = 'mine';
const b = 'blank';

const initial = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
];

const coordinates = [
	[7, 0],
	[1, 1],
	[4, 1],
	[6, 3],
	[3, 4],
	[2, 5],
	[5, 6],
	[2, 7],
];

const placed = [
	[0, 0, 0, 0, 0, 0, 0, m],
	[0, m, 0, 0, m, 0, 0, 0],
	[b, b, b, 0, 0, 0, 0, 0],
	[b, b, b, 0, 0, 0, m, 0],
	[b, b, b, m, 0, 0, 0, 0],
	[0, 0, m, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, m, 0, 0],
	[0, 0, m, 0, 0, 0, 0, 0],
];

describe('empty2D', () => {
	test('creates a single row 2D array', () => {
		expect(empty2D(0, 2)).toEqual([[], []]);
	});
	test('creates an array with zeroes', () => {
		expect(empty2D(2, 2)).toEqual([
			[0, 0],
			[0, 0],
		]);
	});
	test('arrays are independent and not references', () => {
		let initial = empty2D(2, 2);
		initial[0][1] = 2;
		const expected = [
			[0, 2],
			[0, 0],
		];
		expect(initial).toEqual(expected);
	});
});

describe('randomInt', () => {
	test('generates a random number below the max', () => {
		const max = 50;
		const tests = 100;
		const results = [];
		for (let i = 0; i < tests; i++) {
			results.push(randomInt(max));
		}
		expect(results.every((n) => n < max));
	});
});

describe('placeMines', () => {
	let with_blank = [];
	beforeEach(() => {
		with_blank = [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[b, b, b, 0, 0, 0, 0, 0],
			[b, b, b, 0, 0, 0, 0, 0],
			[b, b, b, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		];
	});

	test('places the number of mines given on a given 2D array', () => {
		const placed = placeMines(with_blank, 8);
		const allMines = placed.flat().filter((value) => value === m);
		const allBlank = placed.flat().filter((value) => value === b);
		expect(allBlank.length).toEqual(9);
		expect(allMines.length).toEqual(8);
	});
	test('abort with a full board if mines given is greater than the number of open spaces', () => {
		expect(() => placeMines(with_blank, 64)).toThrow(RangeError);
	});
	test('will place mines up the limit', () => {
		const placed = placeMines(with_blank, 55);
		const allMines = placed.flat().filter((value) => value === m);
		const allBlank = placed.flat().filter((value) => value === b);
		expect(allBlank.length).toEqual(9);
		expect(allMines.length).toEqual(55);
	});
});

describe('getProximity', () => {
	test('should map out proximity on a 3x3 grid with only one mine', () => {
		const input = [
			[0, 0, 0],
			[0, m, 0],
			[0, 0, 0],
		];
		const expected = [
			[1, 1, 1],
			[1, m, 1],
			[1, 1, 1],
		];
		expect(getProximity(input)).toEqual(expected);
	});
	test('should map out proximity on a 3x3 grid with 8 mines', () => {
		const input = [
			[m, m, m],
			[m, 0, m],
			[m, m, m],
		];
		const expected = [
			[m, m, m],
			[m, 8, m],
			[m, m, m],
		];
		expect(getProximity(input)).toEqual(expected);
	});
	test('should map out blank on a 3x3 grid with no mines', () => {
		const input = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
		const expected = [
			[b, b, b],
			[b, b, b],
			[b, b, b],
		];
		expect(getProximity(input)).toEqual(expected);
	});
	test.only('should appropriately handle a combination of mines and no mines', () => {
		const input = [
			[m, 0, 0],
			[m, 0, 0],
			[0, 0, 0],
		];
		const expected = [
			[m, 2, b],
			[m, 2, b],
			[1, 1, b],
		];
		expect(getProximity(input)).toContainEqual(expected);
	});
});

describe('getNeighborTiles', () => {
	test('will return a list of neighboring tiles to the given coordinates, excluding itself', () => {
		const x = 2;
		const y = 2;
		const xLimit = 100;
		const yLimit = 100;
		const expected = [
			[1, 1],
			[1, 2],
			[1, 3],
			[2, 1],
			[2, 3],
			[3, 1],
			[3, 2],
			[3, 3],
		];
		expect(getNeighborTiles(x, y, xLimit, yLimit)).toEqual(expected);
	});
	test('will return a list of neighboring tiles, respecting the xLimit', () => {
		const x = 2;
		const y = 2;
		const xLimit = 3;
		const yLimit = 100;
		const expected = [
			[1, 1],
			[1, 2],
			[1, 3],
			[2, 1],
			[2, 3],
		];
		expect(getNeighborTiles(x, y, xLimit, yLimit)).toEqual(expected);
	});
	test('will return a list of neighboring tiles, respecting the yLimit', () => {
		const x = 2;
		const y = 2;
		const xLimit = 100;
		const yLimit = 3;
		const expected = [
			[1, 1],
			[1, 2],
			[2, 1],
			[3, 1],
			[3, 2],
		];
		expect(getNeighborTiles(x, y, xLimit, yLimit)).toEqual(expected);
	});
	test('will return a list of neighboring tiles respecting xLimit and yLimit', () => {
		const x = 2;
		const y = 2;
		const xLimit = 3;
		const yLimit = 3;
		const expected = [
			[1, 1],
			[1, 2],
			[2, 1],
		];
		expect(getNeighborTiles(x, y, xLimit, yLimit)).toEqual(expected);
	});
	test('will return a list of neighboring tiles respecting zero as the mininmum value', () => {
		const y = 0;
		const x = 0;
		const xLimit = 1;
		const yLimit = 1;
		const expected = [];
		expect(getNeighborTiles(x, y, xLimit, yLimit)).toEqual(expected);
	});
});

describe('newMinefield', () => {
	test('creates a valid gameboard based on given inputs', () => {
		const newGame = {
			xDimension: 8,
			yDimension: 10,
			xOpen: 1,
			yOpen: 1,
			mines: 16,
		};
		const minefield = newMinefield(newGame);
		expect(minefield.length).toEqual(newGame.yDimension);
		expect(minefield[0].length).toEqual(newGame.xDimension);
		expect(minefield.flat().filter((tile) => tile === m).length).toEqual(16);
	});
});

describe('coordsFromID', () => {
	test('accepts a string that matches "x.y" in pattern, returns [x,y]', () => {
		const expected = [1, 2];
		const result = coordsFromID('1.2');
		expect(result).toEqual(expected);
	});
});

describe('idFromCoords', () => {
	test('accepts x and y coordinates, returns a string matching "x.y"', () => {
		const expected = '1.2';
		const result = idFromCoords([1, 2]);
		expect(result).toEqual(expected);
	});
});

describe('getTypeCoordinates', () => {
	test('correctly retrieves all mine coordinates.', () => {
		const expected = coordinates.map((c) => idFromCoords(c));
		expect(getTypeCoordinates(m, placed)).toEqual(expected);
	});
});

// describe('floodFill', () => {
// 	test('should return all blank tile coordinates in a 3x3 grid', () => {
// 		const input = [
// 			[1,1,1],
// 			[1,1,1],
// 			[1,1,1],
// 		];
// 		const coords = [1,1];
// 		const expected = [
// 			[0,0],
// 			[1,0],
// 			[2,0],
// 			[0,1],
// 			[1,1],
// 			[2,1],
// 			[0,2],
// 			[1,2],
// 			[2,2],
// 		];
// 		const result = floodFill(coords, input)
// 		expect(result).toEqual(expected)
// 	});
// 	test('should respond similarly with blank tiles.', () => {
// 		const input = [
// 			[b,b,b],
// 			[b,b,b],
// 			[b,b,b],
// 		];
// 		const coords = [1,1];
// 		const expected = [
// 			[0,0],
// 			[1,0],
// 			[2,0],
// 			[0,1],
// 			[1,1],
// 			[2,1],
// 			[0,2],
// 			[1,2],
// 			[2,2],
// 		];
// 		const result = floodFill(coords, input)
// 		expect(result).toEqual(expected)
// 	});
// })
