const testFiles = [
  'basic_move_tests.json',
  'capture_tests.json',
  'water_tests.json',
  'trap_tests.json',
  'position_evaluation_tests.json'
]

const timestamp = Date.now()

async function loadTests() {
  for (const file of testFiles) {
    const response = await fetch('tests/' + file + '?t=' + timestamp)
    const testSuite = await response.json()

    window.testRunner.describe(testSuite.description, function () {
      testSuite.tests.forEach(scenario => {
        window.testRunner.it(scenario.description, scenario)
      })
    })
  }
}

loadTests()