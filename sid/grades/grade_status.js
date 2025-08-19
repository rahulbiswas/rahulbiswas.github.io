const GradeStatus = ({grade, gradeInfo}) => {
  return React.createElement(
    'div',
    {
      className: 'grid grid-cols-[auto,1fr] gap-x-4 gap-y-2',
    },
    [
      React.createElement(
        'div',
        {
          className: 'text-sm text-gray-600',
        },
        'Current Grade:',
      ),
      React.createElement(
        'div',
        {
          className: 'font-bold text-right',
        },
        `${grade.toFixed(2)}% (${gradeInfo.current})`,
      ),

      gradeInfo.higher &&
      React.createElement(React.Fragment, {}, [
        React.createElement(
          'div',
          {
            className: 'text-sm text-gray-600',
          },
          'Higher:',
        ),
        React.createElement(
          'div',
          {
            className: 'flex items-center justify-end gap-1',
          },
          [
            gradeInfo.higher,
            React.createElement(
              'span',
              {
                className:
                  gradeInfo.difference < 3
                    ? 'text-yellow-500'
                    : 'text-red-500',
              },
              React.createElement(ArrowUpIcon),
            ),
            React.createElement(
              'span',
              {
                className: 'text-sm text-gray-600',
              },
              `${gradeInfo.difference.toFixed(2)}% away`,
            ),
          ],
        ),
      ]),

      gradeInfo.lower &&
      React.createElement(React.Fragment, {}, [
        React.createElement(
          'div',
          {
            className: 'text-sm text-gray-600',
          },
          'Buffer:',
        ),
        React.createElement(
          'div',
          {
            className: 'flex items-center justify-end gap-1',
          },
          [
            gradeInfo.lower,
            React.createElement(
              'span',
              {
                className:
                  gradeInfo.buffer < 3
                    ? 'text-yellow-500'
                    : 'text-gray-400',
              },
              React.createElement(ArrowDownIcon),
            ),
            React.createElement(
              'span',
              {
                className: 'text-sm text-gray-600',
              },
              `${gradeInfo.buffer.toFixed(2)}% buffer`,
            ),
          ],
        ),
      ]),
    ],
  )
}

window.GradeStatus = GradeStatus