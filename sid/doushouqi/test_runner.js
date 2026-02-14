let currentSuite

function describe(description, testSuite) {
    const suiteElement = document.createElement('div')
    suiteElement.className = 'suite'
    
    const headerElement = document.createElement('h2')
    const summaryElement = document.createElement('span')
    summaryElement.className = 'summary'
    
    headerElement.textContent = description
    headerElement.appendChild(summaryElement)
    
    headerElement.onclick = () => {
        suiteElement.classList.toggle('collapsed')
    }
    
    suiteElement.appendChild(headerElement)
    testResults.appendChild(suiteElement)
    currentSuite = suiteElement
    testSuite()
    
    const passCount = suiteElement.querySelectorAll('.test.pass').length
    const failCount = suiteElement.querySelectorAll('.test.fail').length
    summaryElement.innerHTML = ` (
        <span class="pass-count">${passCount} passed</span>, 
        <span class="fail-count">${failCount} failed</span>
    )`

    if (failCount === 0) {
        suiteElement.classList.add('collapsed')
    }
}

function it(description, scenario) {
    const testElement = document.createElement('div')
    testElement.className = 'test'

    const headerElement = document.createElement('div')
    headerElement.className = 'test-header'
    headerElement.innerHTML = `<span class="status">${scenario.startPos ? 
        `Move from ${scenario.startPos} to ${scenario.endPos}` : 
        `Evaluating position for ${scenario.evaluatingPlayer}`}</span>`
    headerElement.onclick = () => {
        testElement.classList.toggle('collapsed')
    }

    const setupHtml = `
        <div class="setup">
            <div>Board:</div>
            <pre>${JSON.stringify(scenario.board, null, 2)}</pre>
            ${scenario.startPos ? 
                `<div>Current Player: ${scenario.currentPlayer}</div>
                <div>Expected Valid: ${scenario.expectedValid}</div>` : 
                `<div>Expected Score: ${scenario.expectedScore}</div>`}
        </div>
    `
    
    try {
        const result = scenario.startPos ? 
            window.testCore.runMoveValidation(scenario) : 
            window.testCore.runPositionEvaluation(scenario)
        
        const expected = scenario.startPos ? 
            scenario.expectedValid : 
            scenario.expectedScore
        
        window.testCore.assert(result === expected)
        testElement.classList.add('pass')
        testElement.innerHTML += `
            <p class="pass">✓ ${description}</p>
            ${setupHtml}
        `
    } catch (error) {
        testElement.classList.add('fail')
        testElement.innerHTML += `
            <p class="fail">✗ ${description}</p>
            <p class="fail">${error.message}</p>
            ${setupHtml}
        `
    }

    testElement.classList.add('collapsed')
    testElement.insertBefore(headerElement, testElement.firstChild)
    currentSuite.appendChild(testElement)
}

window.testRunner = {
    describe,
    it
}