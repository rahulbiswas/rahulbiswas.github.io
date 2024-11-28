const CategorySection = ({category, idx, courseName, hypotheticalAssignments, onAddHypothetical, onUpdateHypothetical, onDeleteHypothetical}) => {
  const isQuizCategory = category.name === 'Quizzes' && courseName === 'AP Microeconomics'
  let assignments = [...category.assignments]
  let allAssignments = [...assignments, ...hypotheticalAssignments]
  let droppedQuiz = null

  if (isQuizCategory) {
    const completedQuizzes = allAssignments.filter(a => 
      (a.status !== 'pending' && a.status !== 'exempt') || 
      !('status' in a)
    )
    if (completedQuizzes.length > 0) {
      droppedQuiz = completedQuizzes.reduce((lowest, current) =>
        (current.score / current.total) < (lowest.score / lowest.total) ? current : lowest
      )
    }
  }

  const activeAssignments = isQuizCategory ?
    allAssignments.filter(a => a !== droppedQuiz) :
    allAssignments

  const categoryPercentage = calculateAssignmentPercentage(activeAssignments)

  const totalEarned = activeAssignments
    .filter(a => a.status !== 'pending' && a.status !== 'exempt')
    .reduce((sum, a) => sum + Number(a.score), 0)
  const totalPossible = activeAssignments
    .filter(a => a.status !== 'pending' && a.status !== 'exempt')
    .reduce((sum, a) => sum + Number(a.total), 0)

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
        [
          ...assignments.map((assignment, aIdx) =>
            React.createElement(AssignmentRow, {
              key: `real-${aIdx}`,
              assignment,
              isDropped: assignment === droppedQuiz
            })
          ),
          ...hypotheticalAssignments.map((assignment, aIdx) =>
            React.createElement(HypotheticalAssignmentRow, {
              key: `hypo-${aIdx}`,
              assignment,
              onUpdate: (updates) => onUpdateHypothetical(aIdx, updates),
              onDelete: () => onDeleteHypothetical(aIdx),
              isDropped: assignment === droppedQuiz
            })
          ),
          React.createElement(
            'button',
            {
              className: 'mt-2 text-sm text-blue-500 hover:text-blue-700 whitespace-normal text-left',
              onClick: onAddHypothetical
            },
            `Add Item to Hypothetical ${category.name}`
          )
        ]
      ),
    ],
  )
}

window.CategorySection = CategorySection