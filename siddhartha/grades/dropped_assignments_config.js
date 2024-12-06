const isEligibleForDropping = (course, category, assignment) => {
  if (course === 'AP Microeconomics' && category === 'Quizzes') {
    return true
  }
  if (course === 'AP United States History' && (assignment.total === 9 || assignment.total === 10)) {
    return true
  }
  return false
}

window.isEligibleForDropping = isEligibleForDropping