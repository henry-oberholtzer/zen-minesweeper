import { empty2D, randomInt } from "../src/board"



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
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  test('generates a random number below the max', () => {
    expect(randomInt(10)).toEqual(5)
  })
})

describe("mineCoordinates", () => {
  test('returns an array of coordinates of given length', () => {
    expect(mineCoordinates(2)).toEqual([[0,1],[2,2]])
  })
})
