const CourseDetail = ({course}) => {
  if (!course || !course.categories || course.categories.length === 0) return null

  return React.createElement(
    'div',
    {
      className: 'bg-white rounded-lg shadow-lg p-6',
    },
    [
      React.createElement(
        'h2',
        {
          className: 'text-xl font-bold mb-2',
        },
        `${course.name} - ${course.grade.toFixed(2)}%`,
      ),
      React.createElement(GradeProgress, {grade: course.grade}),
      React.createElement(
        'div',
        {
          className: 'space-y-4',
        },
        course.categories.map((category, idx) =>
          React.createElement(CategorySection, {
            key: idx,
            category,
            idx,
            courseName: course.name
          })
        )
      ),
    ],
  )
}

window.CourseDetail = CourseDetail