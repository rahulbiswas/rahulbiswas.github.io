const AssignmentRow = ({assignment, isDropped, dropNumber}) => {
   return React.createElement(
      'div',
      {
         className: `text-sm flex justify-between py-1 ${isDropped ? 'text-gray-400 line-through' : ''}`,
      },
      [
         React.createElement(
            'span',
            {
               className: isDropped ? 'text-gray-400' : 'text-gray-700',
            },
            [
               assignment.name,
               isDropped && React.createElement(
                  'span',
                  {
                     className: 'ml-2 text-xs text-gray-500 no-underline',
                  },
                  `(Dropped - Lowest Quiz #${dropNumber})`
               )
            ],
         ),
         React.createElement(
            'div',
            {
               className: 'text-right',
            },
            [
               React.createElement(
                  'span',
                  {
                     className: 'font-mono',
                  },
                  `${assignment.score}/${assignment.total}`,
               ),
               React.createElement(
                  'span',
                  {
                     className: 'text-gray-500 ml-2',
                  },
                  `(${((Number(assignment.score) / Number(assignment.total)) * 100).toFixed(1)}%)`,
               ),
               assignment.date && React.createElement(
                  'span',
                  {
                     className: 'text-gray-400 ml-2 text-xs',
                  },
                  formatDate(assignment.date),
               ),
            ],
         ),
      ],
   )
}

window.AssignmentRow = AssignmentRow
