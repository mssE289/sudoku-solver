class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      console.log('Validation Error: Expected puzzle to be 81 characters long');
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      console.log('Validation Error: Invalid characters in puzzle');
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[rowStart + i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      const cellValue = puzzleString[column + i * 9];
      if (cellValue == value && i !== row) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (puzzleString[(startRow + r) * 9 + startCol + c] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (!validateResult.valid) {
      console.log(`Validation failed: ${validateResult.error}`);
      return { error: validateResult.error };
    }

    const solveRecursive = (puzzleString) => {
      const index = puzzleString.indexOf('.');
      if (index === -1) {
        console.log('Puzzle solved:', puzzleString);
        return puzzleString;
      }

      const row = Math.floor(index / 9);
      const col = index % 9;

      for (let value = 1; value <= 9; value++) {
        const charValue = value.toString();
        if (this.checkRowPlacement(puzzleString, row, col, charValue) &&
            this.checkColPlacement(puzzleString, row, col, charValue) &&
            this.checkRegionPlacement(puzzleString, row, col, charValue)) {
          console.log(`Trying value ${charValue} at index ${index} (row ${row}, col ${col})`);
          const solved = solveRecursive(puzzleString.substring(0, index) + charValue + puzzleString.substring(index + 1));
          if (solved) {
            return solved;
          }
        }
      }
      console.log('Backtracking from index', index);
      return null;
    };

    const solution = solveRecursive(puzzleString);
    if (!solution) {
      console.log('Puzzle cannot be solved');
      return { error: 'Puzzle cannot be solved' };
    }
    console.log('Puzzle solved successfully');
    return { solution };
  }
}

module.exports = SudokuSolver;
