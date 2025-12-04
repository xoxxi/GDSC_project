function isValidPuzzle(puzzle) {
    if (!Array.isArray(puzzle) || puzzle.length !== 9) return false;

  // 각 행의 유효성 검사
  for (let row of puzzle) {
    if (!Array.isArray(row) || row.length !== 9) return false;
    for (let cell of row) {
      if (typeof cell !== 'number' || cell < 0 || cell > 9) return false;
    }
  }

  // 행과 열에서 중복 숫자가 없는지 확인
  for (let i = 0; i < 9; i++) {
    let rowSet = new Set();
    let colSet = new Set();
    for (let j = 0; j < 9; j++) {
      let rowNum = puzzle[i][j];
      let colNum = puzzle[j][i];
      if (rowNum !== 0 && rowSet.has(rowNum)) return false;
      if (colNum !== 0 && colSet.has(colNum)) return false;
      rowSet.add(rowNum);
      colSet.add(colNum);
    }
  }

  // 3x3 구역에서 중복 숫자가 없는지 확인
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      let boxSet = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let num = puzzle[row + i][col + j];
          if (num !== 0 && boxSet.has(num)) return false;
          boxSet.add(num);
        }
      }
    }
  }

  // 최소한 하나의 1~9 숫자가 있는지 확인
  let hasNumber = false;
  for (let row of puzzle) {
    if (row.some(cell => cell >= 1 && cell <= 9)) {
      hasNumber = true;
      break;
    }
  }
  if (!hasNumber) return false;

  return true;
}
  
  function solveSudoku(puzzle) {
    function isValid(num, row, col, board) {
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num ||
          board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
          return false;
        }
      }
      return true;
    }
  
    function solve(board) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(num, row, col, board)) {
                board[row][col] = num;
                if (solve(board)) {
                  return true;
                }
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  
    const board = JSON.parse(JSON.stringify(puzzle));
    if (solve(board)) {
      return board;
    } else {
      throw new Error('No solution found');
    }
  }
  
  function generateRandomPuzzle() {
    const puzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
  
    function fillDiagonal() {
      for (let i = 0; i < 9; i += 3) {
        fillBox(i, i);
      }
    }
  
    function fillBox(row, col) {
      const num = shuffle(Array.from({ length: 9 }, (_, i) => i + 1));
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          puzzle[row + i][col + j] = num[i * 3 + j];
        }
      }
    }
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    fillDiagonal();
    solveSudoku(puzzle); // solveSudoku 함수 호출
  
    //Remove some elements to create the puzzle
    const removalCount = 40; // Number of elements to remove for the puzzle
    for (let i = 0; i < removalCount; i++) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      while (puzzle[row][col] === 0) {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
      }
      puzzle[row][col] = 0;
    }
  
    return puzzle
  }
  
module.exports = { solveSudoku, isValidPuzzle, generateRandomPuzzle };
