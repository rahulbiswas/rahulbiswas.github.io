const CategorySection = ({category, idx, courseName}) => {
  const isQuizCategory = category.name === 'Quizzes' && courseName === 'AP Microeconomics'
  let assignments = [...category.assignments]
  let droppedQuiz = null

  if (isQuizCategory) {
    const completedQuizzes = assignments.filter(a => a.status !== 'pending')
    if (completedQuizzes.length > 0) {
      droppedQuiz = completedQuizzes.reduce((lowest, current) =>
        (current.score / current.total) < (lowest.score / lowest.total) ? current : lowest
      )
    }
  }

  const activeAssignments = isQuizCategory ?
    assignments.filter(a => a !== droppedQuiz) :
    assignments

  const categoryPercentage = calculateAssignmentPercentage(activeAssignments)

  // Calculate total points earned and possible
  const totalEarned = activeAssignments
    .filter(a => a.status !== 'pending' && a.status !== 'exempt')
    .reduce((sum, a) => sum + a.score, 0)
  const totalPossible = activeAssignments
    .filter(a => a.status !== 'pending' && a.status !== 'exempt')
    .reduce((sum, a) => sum + a.total, 0)

  return React.createElement(
    'div',
    {
      key: idx,
      className: 'border-t pt-2',
    },
    [
      React.createElement(CategoryHeader, {
        category,
        totalEarned,
        totalPossible,
        categoryPercentage
      }),
      React.createElement(
        'div',
        {
          className: 'ml-4 mt-2',
        },
        assignments.map((assignment, aIdx) =>
          React.createElement(AssignmentRow, {
            key: aIdx,
            assignment,
            isDropped: assignment === droppedQuiz
          })
        )
      ),
    ],
  )
}

window.CategorySection = CategorySection