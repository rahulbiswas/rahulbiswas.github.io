const testResults = document.getElementById('testResults');
let currentSuite;

function runMoveValidation(scenario) {
    const [fromX, fromY] = scenario.startPos.split('_').map(Number);
    const [toX, toY] = scenario.endPos.split('_').map(Number);
    const movingPiece = scenario.board[scenario.startPos];
    if (movingPiece?.player !== scenario.currentPlayer) {
        return false;
    }
    return isValidMove(fromX, fromY, toX, toY, scenario.board, movingPiece);
}

function describe(description, testSuite) {
    const suiteElement = document.createElement('div');
    suiteElement.className = 'suite';
    suiteElement.innerHTML = `<h2>${description}</h2>`;
    testResults.appendChild(suiteElement);
    currentSuite = suiteElement;
    testSuite();
}

function it(description, scenario) {
    const testElement = document.createElement('div');
    testElement.className = 'test';
    
    const setupHtml = `
        <div class="setup">
            <div>Board:</div>
            <pre>${JSON.stringify(scenario.board, null, 2)}</pre>
            <div>Start: ${scenario.startPos}</div>
            <div>End: ${scenario.endPos}</div>
            <div>Current Player: ${scenario.currentPlayer === 0 ? 'YELLOW' : 'RED'}</div>
        </div>
    `;
    
    try {
        const isValid = runMoveValidation(scenario);
        assert(isValid === scenario.expectedValid);
        testElement.innerHTML = `
            ${setupHtml}
            <p class="pass">✓ ${description}</p>
        `;
    } catch (error) {
        testElement.innerHTML = `
            ${setupHtml}
            <p class="fail">✗ ${description}</p>
            <p class="fail">${error.message}</p>
        `;
    }
    
    currentSuite.appendChild(testElement);
}

function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}