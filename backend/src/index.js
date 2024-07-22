const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { solveSudoku, isValidPuzzle } = require('./sudokuSolver');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 루트 경로 핸들러 추가
app.get('/', (req, res) => {
  res.send('Sudoku Solver API');
});

app.post('/api/solve', (req, res) => {
  const puzzle = req.body.puzzle;
  console.log('Received puzzle:', puzzle); // 퍼즐 입력 로그

  if (!isValidPuzzle(puzzle)) {
    console.error('Invalid puzzle format');
    return res.status(400).json({ error: 'Invalid puzzle format' });
  }

  try {
    const solution = solveSudoku(puzzle);
    console.log('Solved puzzle:', solution); // 퍼즐 해결 로그
    res.json({ solution });
  } catch (error) {
    console.error('Error solving puzzle:', error);
    res.status(500).json({ error: 'Failed to solve puzzle' });
  }
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
