const CategorySection = ({category, idx, courseName, hypotheticalAssignments, onAddHypothetical, onUpdateHypothetical, onDeleteHypothetical, droppedAssignment}) => {
  let assignments = [...category.assignments]
  let allAssignments = [...assignments, ...hypotheticalAssignments]
  
  const activeAssignments = allAssignments.filter(a => 
    !droppedAssignment || 
    droppedAssignment.category !== category.name ||
    a.name !== droppedAssignment.name || 
    a.score !== droppedAssignment.score || 
    a.total !== droppedAssignment.total
  )

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
              isDropped: droppedAssignment && 
                droppedAssignment.category === category.name &&
                assignment.name === droppedAssignment.name && 
                assignment.score === droppedAssignment.score && 
                assignment.total === droppedAssignment.total
            })
          ),
          ...hypotheticalAssignments.map((assignment, aIdx) =>
            React.createElement(HypotheticalAssignmentRow, {
              key: `hypo-${aIdx}`,
              assignment,
              onUpdate: (updates) => onUpdateHypothetical(aIdx, updates),
              onDelete: () => onDeleteHypothetical(aIdx),
              isDropped: droppedAssignment && 
                droppedAssignment.category === category.name &&
                assignment.name === droppedAssignment.name && 
                assignment.score === droppedAssignment.score && 
                assignment.total === droppedAssignment.total
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