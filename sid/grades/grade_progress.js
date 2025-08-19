const GradeProgress = ({grade}) => {
   const width = 100
   const position = Math.min(
      Math.max(
         ((grade - GRADE_CUTOFFS['B+']) /
            (GRADE_CUTOFFS.A - GRADE_CUTOFFS['B+'])) *
         width,
         0,
      ),
      width,
   )

   return React.createElement(
      'div',
      {
         className: 'relative h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full my-4',
      },
      [
         React.createElement('div', {
            className:
               'absolute h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full transition-all duration-300',
            style: {width: `${position}%`},
         }),
         React.createElement(
            'span',
            {
               className:
                  'absolute top-3 left-0 -translate-x-1/2 text-xs text-yellow-600 font-medium',
            },
            'B+',
         ),
         React.createElement(
            'span',
            {
               className:
                  'absolute top-3 left-1/2 -translate-x-1/2 text-xs text-yellow-700 font-medium',
            },
            'A-',
         ),
         React.createElement(
            'span',
            {
               className:
                  'absolute top-3 right-0 translate-x-1/2 text-xs text-green-600 font-medium',
            },
            'A',
         ),
      ],
   )
}
