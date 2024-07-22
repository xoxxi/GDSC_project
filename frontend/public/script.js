document.addEventListener("DOMContentLoaded", function() {
  // 스도쿠 퍼즐과 해답을 표시할 테이블을 생성하는 함수
  function createSudokuTable(parentElement, tableId) {
    const tableBody = document.createElement('tbody');
    tableBody.id = tableId;

    for (let row = 0; row < 9; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < 9; col++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        td.appendChild(input);
        tr.appendChild(td);
      }
      tableBody.appendChild(tr);
    }

    parentElement.appendChild(tableBody);
  }

  // 스도쿠 그리드 초기화
  const sudokuGrid = document.getElementById('sudoku-table');
  createSudokuTable(sudokuGrid, 'sudoku-table-body');

  // 해답 테이블 초기화
  const solutionGrid = document.getElementById('solution-table');
  createSudokuTable(solutionGrid, 'solution-table-body');

  // 퍼즐 제출 함수
  async function submitPuzzle(puzzle) {
    const backendUrl = 'https://port-0-sudoku-backend-lywjjuocf092590d.sel4.cloudtype.app/api/solve';
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ puzzle }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error:', error.error);
        return;
      }

      const { solution } = await response.json();
      console.log('Solution:', solution); // 응답 로그 추가
      displaySolution(solution);
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error: ' + error.message);
    }
  }

  // 랜덤 퍼즐 요청 함수
  async function generateRandomPuzzle() {
    const backendUrl = 'https://port-0-sudoku-backend-lywjjuocf092590d.sel4.cloudtype.app/api/generate';
    try {
      const response = await fetch(backendUrl);

      if (!response.ok) {
        const error = await response.json();
        console.error('Error:', error.error);
        return;
      }

      const { puzzle } = await response.json();
      console.log('Generated Puzzle:', puzzle); // 응답 로그 추가
      displayPuzzle(puzzle);
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  // 스도쿠 퍼즐을 화면에 표시하는 함수
  function displayPuzzle(puzzle) {
    const tableBody = document.getElementById('sudoku-table-body');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('input');
      cells.forEach((cell, colIndex) => {
        cell.value = puzzle[rowIndex][colIndex] === 0 ? '' : puzzle[rowIndex][colIndex];
      });
    });
  }

  // 스도쿠 해답을 화면에 표시하는 함수
  function displaySolution(solution) {
    const tableBody = document.getElementById('solution-table-body');
    tableBody.innerHTML = ''; // 기존 내용 제거

    for (let row = 0; row < 9; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < 9; col++) {
        const td = document.createElement('td');
        td.textContent = solution[row][col];
        tr.appendChild(td);
      }
      tableBody.appendChild(tr);
    }
    console.log('Displayed solution'); // 해답 표시 로그 추가
  }

  // Solve 버튼 클릭 이벤트
  document.getElementById('solve-button').addEventListener('click', () => {
    const puzzle = [];
    const rows = document.querySelectorAll('#sudoku-table-body tr');
    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll('input');
      cells.forEach((cell) => {
        const value = cell.value ? parseInt(cell.value, 10) : 0;
        rowData.push(value);
      });
      puzzle.push(rowData);
    });

    console.log('Submitting puzzle:', puzzle); // 퍼즐 제출 로그 추가
    submitPuzzle(puzzle);
  });

  // Generate Random Puzzle 버튼 클릭 이벤트
  document.getElementById('generate-button').addEventListener('click', () => {
    generateRandomPuzzle();
  });
});
