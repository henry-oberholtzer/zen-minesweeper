import { cyrb128, sfc32 } from "./sfc32";

class Minesweeper {
  height: number;
  width: number;
  mines: number;
  seed: string;
  openingIndex: number | null;
  gameOver: boolean;
  revealedIndices: Set<number>;
  flaggedIndices: Set<number>;
  #mineIndices: Set<number>;
  board: number[];
  constructor(height: number, width: number, mines: number, seed: string, openingIndex: number | null = null) {
    this.height = height;
    this.width = width;
    this.mines = mines;
    this.seed = seed;
    this.openingIndex = openingIndex;
    this.gameOver = false
    this.#mineIndices = new Set([])
    this.revealedIndices = this.#openingMove(openingIndex)
    this.flaggedIndices = new Set([])
    this.board = this.#createBoard()
  }

  get view() {
    const view = new Array(this.width * this.height).fill(10)
    this.revealedIndices.forEach((index) => {
      view[index] = this.board[index]
    })
    this.flaggedIndices.forEach((index) => {
      view[index] = 11;
    })
    if (this.gameOver === true) {
      this.#mineIndices.forEach((index) => {
        if (!this.flaggedIndices.has(index)) {
          view[index] = 9
        }
      });
    }
    return view
  }

  flag(index: number) {
    if (this.flaggedIndices.has(index)) {
      this.flaggedIndices.delete(index)
    }
    else
    {
      this.flaggedIndices.add(index)
    }
  }

  reveal(index: number) {
    if (this.board[index] === 9) {
      this.gameOver = true;
    }
    if (!this.flaggedIndices.has(index)) {
      this.revealedIndices.add(index)
      this.flood(index)
    }
  }

  flood(index: number) {
    const adjacent = this.getAdjacent(index)
    adjacent.forEach((i) => {
      if (!this.revealedIndices.has(i) && !this.flaggedIndices.has(i)) {
        if (this.board[i] === 0) {
          this.revealedIndices.add(i)
          this.flood(i)
        }
        else if (this.board[i] != 9) {
          this.revealedIndices.add(i)
        }
      }
    })
  }

  revealGrid(index: number) {
    this.reveal(index)
    this.getAdjacent(index).forEach((i) => this.reveal(i))
  }

  #openingMove(openingIndex: number | null) {
    if (openingIndex === null) {
      return new Set([])
    }
    else
    {
      const adjacent = this.getAdjacent(openingIndex)
      adjacent.push(openingIndex)
      return new Set(adjacent)
    }
  }

  #placeMines(array: number[]) {
    const seed128 = cyrb128(this.seed);
    const rand = sfc32(seed128[0], seed128[1], seed128[2], seed128[3]);
    const randInt = () => {
      return Math.floor(rand() * array.length)
    }
    while (this.#mineIndices.size < this.mines) {
      const index = randInt()
      if (this.revealedIndices.has(index) || array[index] != 0) {
      }
      else
      {
        array[index] = 9
        this.#mineIndices.add(index)
      }
    } 
    return array
  }

  getAdjacent(index: number) {
    const w = this.width;
    const row = Math.floor(index / w);
    const col = index % w;
    if (row === 0) {
      if (col === 0) {
        return [index+1, index+w, index+w+1]
      }
      else if (col === w-1)
      {
        return [index-1, index+w-1, index+w]
      }
      else
      {
        return [index-1, index+1, index+w-1, index+w, index+w+1]
      }
    }
    else if (row === this.height - 1) {
      if (col === 0) {
        return [index-w, index-w+1, index+1]
      }
      else if (col === w-1)
      {
        return [index-1, index-w, index-w-1]
      }
      else
      {
        return [index-1, index+1, index-w-1, index-w, index-w+1]
      }
    }
    else
    {
      if (col === 0) {
        return [index-w, index-w+1, index+1, index+w, index+w+1]
      }
      else if (col === w - 1) {
        return [index-w-1, index-w, index-1, index+w-1, index+w]
      }
      else {
        return [index-w-1, index-w, index-w+1, index-1, index+1, index+w-1, index+w, index+w+1];
      }
    }
  }

  #createBoard() {
    const array = new Array(this.width * this.height).fill(0)
    const withMines = this.#placeMines(array)
    const withProximity = withMines.map((tile, index) => {
      if (tile === 9) {
        return tile
      }
      const adjacent = this.getAdjacent(index)
      let mineCount = 0;
      adjacent.forEach((index) => {
        if (withMines[index] === 9) {
          mineCount++;
        }
      });
      return mineCount;
    })
    return withProximity
  }

}

export { Minesweeper, }
