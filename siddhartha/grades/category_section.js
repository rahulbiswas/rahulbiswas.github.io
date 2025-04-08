const CategorySection = ({category, idx, courseName, hypotheticalAssignments, onAddHypothetical, onUpdateHypothetical, onDeleteHypothetical, droppedAssignments}) => {
  let assignments = [...category.assignments]
  let allAssignments = [...assignments, ...hypotheticalAssignments]
  
  const activeAssignments = allAssignments.filter(a => 
    !droppedAssignments.some(dropped => 
      dropped.category === category.name &&
      a.name === dropped.name &&
      a.score === dropped.score &&
      a.total === dropped.total
    )
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
          ...assignments.map((assignment, aIdx) => {
            const dropIndex = droppedAssignments.findIndex(dropped => 
              dropped.category === category.name &&
              assignment.name === dropped.name &&
              assignment.score === dropped.score &&
              assignment.total === dropped.total
            )
            return React.createElement(AssignmentRow, {
              key: `real-${aIdx}`,
              assignment,
              isDropped: dropIndex !== -1,
              dropNumber: dropIndex + 1
            })
          }),
          ...hypotheticalAssignments.map((assignment, aIdx) => {
            const dropIndex = droppedAssignments.findIndex(dropped => 
              dropped.category === category.name &&
              assignment.name === dropped.name &&
              assignment.score === dropped.score &&
              assignment.total === dropped.total
            )
            return React.createElement(HypotheticalAssignmentRow, {
              key: `hypo-${aIdx}`,
              assignment,
              onUpdate: (updates) => onUpdateHypothetical(aIdx, updates),
              onDelete: () => onDeleteHypothetical(aIdx),
              isDropped: dropIndex !== -1,
              dropNumber: dropIndex + 1
            })
          }),
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
