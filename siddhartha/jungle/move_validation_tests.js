const testFiles = [
  'basic_move_tests.json',
  'capture_tests.json',
  'water_tests.json',
  'trap_tests.json'
]

async function loadTests() {
  for (const file of testFiles) {
    const response = await fetch('tests/' + file + '?t=' + timestamp)
    const testSuite = await response.json()

    describe(testSuite.description, function () {
      testSuite.tests.forEach(scenario => {
        it(scenario.description, scenario)
      })
    })
  }
}

loadTests()