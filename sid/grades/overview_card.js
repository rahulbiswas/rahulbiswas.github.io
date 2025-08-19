const OverviewCard = ({course}) => {
  const gradeInfo = getGradeInfo(course.grade)

  return React.createElement(
    'div',
    {
      className:
        'bg-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow',
    },
    [
      React.createElement(
        'h2',
        {
          className: 'text-xl font-bold mb-2',
        },
        course.name,
      ),
      React.createElement(GradeProgress, {grade: course.grade}),
      React.createElement(GradeStatus, {
        grade: course.grade,
        gradeInfo: gradeInfo
      })
    ],
  )
}

window.OverviewCard = OverviewCard