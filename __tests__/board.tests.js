import { empty2D, placeMines, randomInt } from "../src/board"



describe("empty2D", () => {
  test('creates a single row 2D array', () => {
    expect(empty2D(0, 2)).toEqual([[],[]])
  })
  test('creates an array with zeroes', () => {
    expect(empty2D(2,2)).toEqual([[0, 0],[0, 0]])
  })
  test('arrays are independent and not references', () => {
    let initial = empty2D(2,2)
    initial[0][1] = 2
    const expected = [[0,2],[0,0]]
    expect(initial).toEqual(expected)
  })
})

describe("randomInt", () => {
  test('generates a random number below the max', () => {
    const max = 50
    const tests = 100
    const results = []
    for (let i = 0; i < tests; i++) {
      results.push(randomInt(max))
    } 
    expect(results.every((n) => n < max))
  })
})

const m = 'mine'
const b = 'blank'

const initial = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
]

const coordinates = [[7,0],[5,1],[1,1],[6,3],[3,4],[2,5],[5,6],[2,7]]

const placed = [
  [0  ,0  ,0  ,0  ,0  ,0  ,0  ,m],
  [0  ,m  ,0  ,0  ,m  ,0  ,0  ,0],
  [b  ,b  ,b  ,0  ,0  ,0  ,0  ,0],
  [b  ,b  ,b  ,0  ,0  ,0  ,m  ,0],
  [b  ,b  ,b  ,m  ,0  ,0  ,0  ,0],
  [0  ,0  ,m  ,0  ,0  ,0  ,0  ,0],
  [0  ,0  ,0  ,0  ,0  ,m  ,0  ,0],
  [0  ,0  ,m  ,0  ,0  ,0  ,0  ,0],
]

describe("placeMines", () => {
  let with_blank = []
  beforeEach(() => {
    with_blank = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [b,b,b,0,0,0,0,0],
      [b,b,b,0,0,0,0,0],
      [b,b,b,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ]
  })

  test('places the number of mines given on a given 2D array', () => {
    const placed = placeMines(with_blank, 8)
    const allMines = placed.flat().filter((value) => value === m);
    const allBlank = placed.flat().filter((value) => value === b);
    expect(allBlank.length).toEqual(9)
    expect(allMines.length).toEqual(8)
  });
  test('abort with a full board if mines given is greater than the number of open spaces', () => {
    expect(() => placeMines(with_blank, 64)).toThrow(RangeError)
  });
  test('will place mines up the limit', () => {
    const placed = placeMines(with_blank, 55)
    const allMines = placed.flat().filter((value) => value === m);
    const allBlank = placed.flat().filter((value) => value === b);
    expect(allBlank.length).toEqual(9)
    expect(allMines.length).toEqual(55)
  });
})
