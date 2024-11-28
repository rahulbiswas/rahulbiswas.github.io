const calculateAssignmentPercentage = (assignments) => {
  if (!assignments || assignments.length === 0) return 0

  const validAssignments = assignments.filter(
    (assignment) =>
      assignment.status !== 'pending' && assignment.status !== 'exempt'
  )

  if (validAssignments.length === 0) return 0

  const totalPoints = validAssignments.reduce(
    (sum, assignment) => sum + Number(assignment.total),
    0
  )

  if (totalPoints === 0) return 0

  const earnedPoints = validAssignments.reduce(
    (sum, assignment) => sum + Number(assignment.score),
    0
  )

  return (earnedPoints / totalPoints) * 100
}

const calculateCourseGrade = (categories, courseName, hypotheticalAssignments = {}) => {
  if (!categories || categories.length === 0) return 0

  let totalWeight = 0
  let weightedSum = 0

  categories.forEach((category) => {
    let assignments = [...category.assignments]
    
    // Add hypothetical assignments if they exist
    if (hypotheticalAssignments[category.name]) {
      assignments = [...assignments, ...hypotheticalAssignments[category.name]]
    }

    // Special handling for AP Microeconomics Quizzes
    if (courseName === 'AP Microeconomics' && category.name === 'Quizzes') {
      // Find and remove the lowest non-pending quiz
      const completedQuizzes = assignments.filter(a => a.status !== 'pending')
      if (completedQuizzes.length > 0) {
        const lowestQuiz = completedQuizzes.reduce((lowest, current) =>
          (current.score / current.total) < (lowest.score / lowest.total) ? current : lowest
        )
        assignments = assignments.filter(a => a !== lowestQuiz)
      }
    }

    const percentage = calculateAssignmentPercentage(assignments)
    if (!isNaN(percentage)) {
      weightedSum += percentage * (category.weight / 100)
      totalWeight += category.weight / 100
    }
  })

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

window.calculateAssignmentPercentage = calculateAssignmentPercentage
window.calculateCourseGrade = calculateCourseGrade