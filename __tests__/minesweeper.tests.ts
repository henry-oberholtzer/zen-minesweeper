import { Minesweeper } from "../src/minesweeper"

let ms: Minesweeper
beforeEach(() => {
  ms = new Minesweeper(8, 8, 4, "test")
})

describe('Minesweeper.constructor', () => {
  test('should accept a height and width parameter', () => {
    expect(ms.height).toEqual(8);
    expect(ms.width).toEqual(8);
  });
  test('should accept a mine number', () => {
    expect(ms.mines).toEqual(4);
  })  
})

describe('Minesweeper.getAdjacent', () => {
  test('should return all adjacent squares when though of a as grid on width and height', () => {
    const smallMS = new Minesweeper(3,3,0, "test")
    expect(smallMS.getAdjacent(4)).toEqual([0,1,2,3,5,6,7,8])
  });
  test('should not return indexes that would be below column 0', () => {
    const smallMS = new Minesweeper(3,3,0, "test")
    expect(smallMS.getAdjacent(3)).toEqual([0,1,4,6,7])
  })
  test('should not return indexes that would be past the largest column', () => {
    const smallMS = new Minesweeper(3,3,0, "test")
    expect(smallMS.getAdjacent(5)).toEqual([1,2,4,7,8])
  })
  test('should not return indexes that would be past the maximum rows', () => {
    const smallMS = new Minesweeper(3,3,0, "test")
    expect(smallMS.getAdjacent(7)).toEqual([6,8,3,4,5,])
  })
  test('should not return index that would be below the first row', () => {
    const smallMS = new Minesweeper(3,3,0, "test")
    expect(smallMS.getAdjacent(1)).toEqual([0,2,3,4,5])
  })
  test('should not return indexes respecting each corner condition', () => {
    const smallMS = new Minesweeper(3,3,0, "test")
    expect(smallMS.getAdjacent(0)).toEqual([1,3,4])
    expect(smallMS.getAdjacent(2)).toEqual([1,4,5])
    expect(smallMS.getAdjacent(6)).toEqual([3,4,7])
    expect(smallMS.getAdjacent(8)).toEqual([7,5,4])
  })
});

describe('Minesweeper.board', () => {
  test('should be a one dimensional array of length that corresponds to the height and width.', () => {
    const board = new Array(8*8).fill(0)
    expect(ms.board.length).toEqual(board.length)
  });
  test('should contain the number of mines requested.', () => {
    const expected = [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 0, 0,
      0, 0, 0, 1, 9, 1, 0, 0,
      0, 0, 0, 1, 1, 1, 0, 0,
      0, 1, 1, 1, 0, 0, 1, 1, 
      0, 1, 9, 2, 1, 0, 1, 9,
      0, 1, 2, 9, 1, 0, 1, 1,
      0, 0, 1, 1, 1, 0, 0, 0
    ];
    const allMines = ms.board.filter((value) => value === 9)
    expect(allMines.length).toEqual(ms.mines)
    expect(ms.board).toEqual(expected)
  });
  test('should include appropriate proximity mappings', () => {
    const smallMS = new Minesweeper(3,3,1, "test")
    const expected = [
      0, 0, 0, 
      1, 1, 0,
      9, 1, 0
    ]
    expect(smallMS.board).toEqual(expected)
  });
  test('should handle up to 8 mines on a 3x3 grid', () => {
    const smallMS = new Minesweeper(3,3,8, "asdahkjsdah");
    const expected = [ 
      9, 5, 9,
      9, 9, 9,
      9, 9, 9,]
    const allMines = smallMS.board.filter((value) => value === 9)
    expect(allMines.length).toEqual(smallMS.mines)
    expect(smallMS.board).toEqual(expected)
  })
})

describe('Minesweeper.view', () => {
  let ms: Minesweeper
  beforeEach(() => {
    ms = new Minesweeper(8,8,12,"test")
  })
  test('should have a property showing what tiles have been revealed.', () => {
    expect(ms.revealedIndices).toEqual(new Set())
  })
  test('should accept an optional input for an opening index', () => {
    const msOpening = new Minesweeper(8,8,12,"test",29)
    expect(msOpening.revealedIndices).toEqual(new Set([20,21,22,28,30,36,37,38,29]))
  })
  test('should not place mines in the opening index', () => {
    const msOpening = new Minesweeper(8,8,12,"test",29)
    const safeTiles = [20,21,22,28,30,36,37,38,29]
    const board = msOpening.board
    const allSafe = safeTiles.map((index) => {
      if (board[index] != 9) {
        return true
      }
      return false
    });
    expect(allSafe.every((v) => v === true)).toBe(true)
  })
  test('should carry out flood fill the opening input grid if the opening input exists.', () => {
    const msOpening = new Minesweeper(8,8,12,"test",29)
    const expected = [
        1, 2, 9, 1, 0, 1, 2, 2, 
        1, 9, 2, 1, 0, 1, 9, 9, 
        1, 1, 1, 0, 0, 1, 3, 9,
        0, 1, 1, 1, 0, 0, 1, 1, 
        0, 2, 9, 2, 1, 1, 2, 1,
        0, 2, 9, 3, 2, 9, 3, 9,
        0, 1, 3, 9, 3, 2, 9, 2,
        0, 0, 2, 9, 2, 1, 1, 1
      ]
    const expectedView = [
        10,  10,  10,  10,  10,  10,  10,  10, 
        10,  10,  10,  10,  10,  10,  10,  10, 
        10,  10,  10,  10,  0,    1,   3,  10,
        10,  10,  10,  10,  0,    0,   1,  10, 
        10,  10,  10,  10,  1,    1,   2,  10, 
        10,  10,  10,  10,  10,  10,  10,  10,
        10,  10,  10,  10,  10,  10,  10,  10, 
        10,  10,  10,  10,  10,  10,  10,  10,
      ]
    console.log(msOpening.board)
  })
})

describe('Minesweeper.view', () => {
  test('should retrieve a representation of a the visible board state', () => {
    const smallMS = new Minesweeper(3,3,1, "test")
    const expectedBoard = [
      0, 0, 0, 
      1, 1, 0,
      9, 1, 0
    ]
    const expectedView = [
      10,10,10,
      10,10,10,
      10,10,10,
    ]
    expect(smallMS.board).toEqual(expectedBoard)
    expect(smallMS.view).toEqual(expectedView)
  })
  test('should include revealed squares', () => {
    const msOpening = new Minesweeper(8,8,12,"test",29)
    const expectedView = [
      10,  10,  10,  10,  10,  10,  10,  10, 
      10,  10,  10,  10,  10,  10,  10,  10, 
      10,  10,  10,  10,  0,  1,  3, 10,
      10,  10,  10,  10,  0,  0,  1,  10, 
      10,  10,  10,  10,  1,  1,  2,  10, 
      10,  10,  10,  10,  10, 10, 10, 10,
      10,  10,  10,  10,  10, 10,  10,10, 
      10,  10,  10,  10,  10,   10,  10,  10
    ]
    expect(msOpening.view).toEqual(expectedView)
  });
  test('should include flags as an 11', () => {
    const ms = new Minesweeper(3,3,1,"test")
    ms.flag(2)
    const expected = [
      10,10,11,
      10,10,10,
      10,10,10
    ]
    expect(ms.view).toEqual(expected)
  });
  test('should reveal mines if the game is over', () => {
    const ms = new Minesweeper(3,3,1,"test")
    ms.gameOver = true
    const expected = [
      10,10,10,
      10,10,10,
      9,10,10
    ]
    expect(ms.view).toEqual(expected)
  })
});

describe('Minesweeper.flag', () => {
  test('should accept an index to mark with a flag', () => {
    const ms = new Minesweeper(3,3,1,"test")
    ms.flag(2)
    expect(ms.flaggedIndices.has(2)).toBe(true)
  });
  test('if the index is already in the flagged list, remove it.', () => {
    const ms = new Minesweeper(3,3,1,"test")
    ms.flag(2)
    expect(ms.flaggedIndices.has(2)).toBe(true)
    ms.flag(2)
    expect(ms.flaggedIndices.has(2)).toBe(false)
  })
})

describe('Minesweeper.flood', () => {
  test('should flood fill an area to reveal tiles on a single reveal', () => {
    const ms = new Minesweeper(3,3,1,"test")
    const expected = [
      0,0,0,
      1,1,0,
      10,1,0
    ];
    ms.reveal(2)
    expect(ms.view).toEqual(expected)
  })
  test('should not flood over tiles marked with a flag.', () => {
    const ms = new Minesweeper(3,3,1,"test")
    const expected = [
      11,0,0,
      1,1,0,
      10,1,0
    ];
    ms.flag(0)
    ms.reveal(2)
    expect(ms.view).toEqual(expected)
  })
})

describe('Minesweeper.reveal', () => {
  test('should accept a single index to reveal and add to revealedIndices', () => {
    const ms = new Minesweeper(3,3,8, "asdahkjsdah")
    ms.reveal(1)
    const expected = [
      10,5,10,
      10,10,10,
      10,10,10
    ]
    expect(ms.view).toEqual(expected)
  });
  test('if the revealed tile is a mine, set game over to true', () => {
    const ms = new Minesweeper(3,3,8, "asdahkjsdah")
    expect(ms.gameOver).toEqual(false)
    ms.reveal(0)
    expect(ms.gameOver).toEqual(true)
  });
})

describe('Minesweeper.revealGrid', () => {
  test('should accept a single index to reveal, and reveal it and all squares around it', () => {
    const ms = new Minesweeper(3,3,0, "asdahkjsdah")
    const expected = [
      0,0,0,
      0,0,0,
      0,0,0,
    ]
    ms.revealGrid(4)
    expect(ms.mines).toEqual(0)
    expect(ms.board).toEqual(expected)
    expect(ms.view).toEqual(expected)
  })
  test('should not reveal indexes marked with flags.', () => {
    const ms = new Minesweeper(3,3,1, "test")
    const expected = [
      0,0,0,
      1,1,0,
      11,1,0,
    ]
    ms.flag(6)
    ms.revealGrid(4)
    expect(ms.view).toEqual(expected)
  })
})

describe('Minesweeper.input', () => {
  test('takes in an input coordinate between the range of the game board', () => {
    const ms = new Minesweeper(8,8,12,"test",29)
  })
})
