'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const coordinateRegex = /^[A-I][1-9]$/;
      if (!coordinateRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      const row = coordinate[0].charCodeAt(0) - 'A'.charCodeAt(0);
      const column = parseInt(coordinate[1]) - 1;

      const validRow = solver.checkRowPlacement(puzzle, row, column, value);
      const validColumn = solver.checkColPlacement(puzzle, row, column, value);
      const validRegion = solver.checkRegionPlacement(puzzle, row, column, value);

      const conflicts = [];
      if (!validRow) conflicts.push('row');
      if (!validColumn) conflicts.push('column');
      if (!validRegion) conflicts.push('region');

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }
      res.json({ valid: true });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        console.log('Solve route: Missing puzzle');
        return res.json({ error: 'Required field missing' });
      }

      const validationResult = solver.validate(puzzle);
      if (!validationResult.valid) {
        console.log(`Solve route: Validation failed: ${validationResult.error}`);
        return res.json({ error: validationResult.error });
      }

      const result = solver.solve(puzzle);
      if (result.error) {
        console.log(`Solve route: Solving failed: ${result.error}`);
        return res.json({ error: result.error });
      }

      console.log('Solve route: Puzzle solved successfully');
      res.json({ solution: result.solution, error: 'Puzzle cannot be solved' });
    });
};
