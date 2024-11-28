const CategoryHeader = ({category, totalEarned, totalPossible, categoryPercentage}) => {
   return React.createElement(
      'div',
      {
         className: 'font-semibold flex justify-between items-center',
      },
      [
         React.createElement(
            'span',
            null,
            category.name
         ),
         React.createElement(
            'div',
            {
               className: 'text-right text-sm',
            },
            [
               React.createElement(
                  'span',
                  {
                     className: 'font-mono',
                  },
                  `${totalEarned}/${totalPossible}`
               ),
               React.createElement(
                  'span',
                  {
                     className: 'text-gray-600 ml-2',
                  },
                  `(${categoryPercentage.toFixed(1)}%)`
               ),
               React.createElement(
                  'span',
                  {
                     className: 'text-gray-500 ml-2',
                  },
                  `Weight: ${category.weight}%`
               )
            ]
         )
      ]
   )
}

window.CategoryHeader = CategoryHeader