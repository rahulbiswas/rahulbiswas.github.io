const isEligibleForDropping = (course, category, assignment) => {
  if (course === 'AP United States History' && assignment.total === 10) {
    return true
  }
  if (course === 'AP Macroeconomics' && category === 'Quizzes') {
    return true
  }
  return false
}

const getNumDrops = (course) => {
  if (course === 'AP Macroeconomics') {
    return 1
  }
  return 0
}

window.isEligibleForDropping = isEligibleForDropping
window.getNumDrops = getNumDrops
