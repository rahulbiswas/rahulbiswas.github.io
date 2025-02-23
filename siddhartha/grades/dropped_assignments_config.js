const isEligibleForDropping = (course, category, assignment) => {
  if (course === 'AP Macroeconomics' && category === 'Quizzes') {
    return true
  }
  if (course === 'AP United States History' && assignment.total === 10) {
    return true
  }
  return false
}

window.isEligibleForDropping = isEligibleForDropping