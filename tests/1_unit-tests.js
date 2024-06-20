const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.validate(validString).valid, true);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidString = '1.5..2.84..63.12.7.2..5...X.9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.validate(invalidString).valid, false);
    assert.equal(solver.validate(invalidString).error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.';
    assert.equal(solver.validate(shortString).valid, false);
    assert.equal(solver.validate(shortString).error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.checkRowPlacement(validString, 0, 1, '3'), true);
  });

  test('Logic handles an invalid row placement', () => {
    const invalidString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.checkRowPlacement(invalidString, 0, 1, '1'), false);
  });

  test('Logic handles a valid column placement', () => {
    const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.checkColPlacement(validString, 0, 1, '4'), true);
  });

  test('Logic handles an invalid column placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const invalidColumnPlacement = solver.checkColPlacement(puzzleString, 0, 0, '2');
    assert.equal(invalidColumnPlacement, false);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.checkRegionPlacement(validString, 0, 1, '3'), true);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const invalidString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.checkRegionPlacement(invalidString, 0, 1, '5'), false);
  });

  test('Valid puzzle strings pass the solver', () => {
    const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(validString).solution;
    assert.equal(solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(invalidString.replace('4', 'X'));
    assert.property(result, 'error');
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const incompleteString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(incompleteString).solution;
    assert.equal(solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });
});
