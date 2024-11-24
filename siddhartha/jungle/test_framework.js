const testResults = document.getElementById('testResults');
let currentSuite;

function describe(description, testSuite) {
    const suiteElement = document.createElement('div');
    suiteElement.className = 'suite';
    suiteElement.innerHTML = `<h2>${description}</h2>`;
    testResults.appendChild(suiteElement);
    
    currentSuite = suiteElement;
    testSuite();
}

function it(description, setup, testCase) {
    const testElement = document.createElement('div');
    testElement.className = 'test';
    
    const setupHtml = `
        <div class="setup">
            <div>Moving: ${setup.moving}</div>
            <div>From: (${setup.from.x},${setup.from.y})</div>
            <div>To: (${setup.to.x},${setup.to.y})</div>
            <div>Other pieces: ${setup.otherPieces || 'none'}</div>
        </div>
    `;
    
    try {
        testCase();
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

function assertThrows(fn, expectedError) {
    try {
        fn();
        throw new Error('Expected function to throw an error');
    } catch (error) {
        if (expectedError && error.message !== expectedError) {
            throw new Error(`Expected error "${expectedError}" but got "${error.message}"`);
        }
    }
}

function assertEqual(actual, expected) {
    if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
    }
}