const HypotheticalAssignmentRow = ({assignment, onUpdate, onDelete, isDropped}) => {
   return React.createElement(
      'div',
      {
         className: `text-sm flex justify-between py-1 bg-blue-50 rounded px-2 ${isDropped ? 'opacity-50' : ''}`,
      },
      [
         React.createElement(
            'span',
            {
               className: 'text-gray-700 italic',
            },
            [
               assignment.name,
               isDropped && React.createElement(
                  'span',
                  {
                     className: 'ml-2 text-xs text-gray-500 no-underline',
                  },
                  '(Dropped - Lowest Quiz)'
               )
            ]
         ),
         React.createElement(
            'div',
            {
               className: 'text-right flex items-center gap-2',
            },
            [
               React.createElement(
                  'div',
                  {
                     className: 'font-mono flex items-center gap-1',
                  },
                  [
                     React.createElement(
                        'input',
                        {
                           type: 'number',
                           value: assignment.score,
                           min: 0,
                           className: 'w-16 bg-white rounded px-1 py-0.5',
                           onChange: (e) => onUpdate({
                              score: Math.max(0, Number(e.target.value))
                           })
                        }
                     ),
                     '/',
                     React.createElement(
                        'input',
                        {
                           type: 'number',
                           value: assignment.total,
                           min: 0,
                           className: 'w-16 bg-white rounded px-1 py-0.5',
                           onChange: (e) => onUpdate({
                              total: Math.max(0, Number(e.target.value))
                           })
                        }
                     )
                  ]
               ),
               React.createElement(
                  'span',
                  {
                     className: 'text-gray-500',
                  },
                  assignment.total === 0 ? 
                     '(0%)' : 
                     `(${((Number(assignment.score) / Number(assignment.total)) * 100).toFixed(1)}%)`
               ),
               React.createElement(
                  'button',
                  {
                     className: 'text-gray-400 hover:text-red-500',
                     onClick: onDelete
                  },
                  '×'
               )
            ]
         )
      ]
   )
}

window.HypotheticalAssignmentRow = HypotheticalAssignmentRow