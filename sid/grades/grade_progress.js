const GradeProgress = ({grade}) => {
   const gradeInfo = getGradeInfo(grade)
   const GRADE_ORDER = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
   
   let currentIdx = GRADE_ORDER.indexOf(gradeInfo.current)
   if (currentIdx === -1) currentIdx = 0
   
   let midIdx = currentIdx
   if (midIdx === 0) midIdx = 1
   if (midIdx === GRADE_ORDER.length - 1) midIdx = GRADE_ORDER.length - 2
   
   const leftIdx = midIdx + 1
   const rightIdx = midIdx - 1
   
   const leftLabel = GRADE_ORDER[leftIdx]
   const midLabel = GRADE_ORDER[midIdx]
   const rightLabel = GRADE_ORDER[rightIdx]
   
   const leftVal = GRADE_CUTOFFS[leftLabel]
   const midVal = GRADE_CUTOFFS[midLabel]
   const rightVal = GRADE_CUTOFFS[rightLabel]
   
   const width = 100
   const range = rightVal - leftVal || 1
   const position = Math.min(Math.max(((grade - leftVal) / range) * width, 0), width)
   const midPosition = ((midVal - leftVal) / range) * width

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
            leftLabel,
         ),
         React.createElement(
            'span',
            {
               className:
                  'absolute top-3 -translate-x-1/2 text-xs text-yellow-700 font-medium',
               style: {left: `${midPosition}%`},
            },
            midLabel,
         ),
         React.createElement(
            'span',
            {
               className:
                  'absolute top-3 right-0 translate-x-1/2 text-xs text-green-600 font-medium',
            },
            rightLabel,
         ),
      ],
   )
}

window.GradeProgress = GradeProgress
