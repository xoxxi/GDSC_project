const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { solveSudoku, isValidPuzzle } = require('./sudokuSolver');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/solve', (req, res) => {
  const puzzle = req.body.puzzle;

  if (!isValidPuzzle(puzzle)) {
    return res.status(400).json({ error: 'Invalid puzzle format' });
  }

  const solution = solveSudoku(puzzle);

  res.json({ solution });
});


/* app.get('/api/generate', (req, res) => {
  try {
    const puzzle = generateRandomPuzzle();
    res.json({ puzzle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

const PORT = 3000;
const HOST = '0.0.0.0'; // 모든 IP 주소에서 접근 가능하게 설정

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});