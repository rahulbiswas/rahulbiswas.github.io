class CourseDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hypotheticalAssignments: {}
    }
  }

  addHypotheticalAssignment = (categoryName) => {
    this.setState(prevState => {
      const categoryHypotheticals = prevState.hypotheticalAssignments[categoryName] || []
      return {
        hypotheticalAssignments: {
          ...prevState.hypotheticalAssignments,
          [categoryName]: [...categoryHypotheticals, {
            name: `Hypothetical ${categoryName} #${categoryHypotheticals.length + 1}`,
            score: 0,
            total: 0
          }]
        }
      }
    })
  }

  updateHypotheticalAssignment = (categoryName, index, updates) => {
    this.setState(prevState => {
      const categoryHypotheticals = [...(prevState.hypotheticalAssignments[categoryName] || [])]
      categoryHypotheticals[index] = {...categoryHypotheticals[index], ...updates}
      return {
        hypotheticalAssignments: {
          ...prevState.hypotheticalAssignments,
          [categoryName]: categoryHypotheticals
        }
      }
    })
  }

  deleteHypotheticalAssignment = (categoryName, index) => {
    this.setState(prevState => {
      const categoryHypotheticals = [...(prevState.hypotheticalAssignments[categoryName] || [])]
      categoryHypotheticals.splice(index, 1)
      return {
        hypotheticalAssignments: {
          ...prevState.hypotheticalAssignments,
          [categoryName]: categoryHypotheticals
        }
      }
    })
  }

  render() {
    const {course} = this.props
    if (!course || !course.categories || course.categories.length === 0) return null

    const courseGrade = calculateCourseGrade(course.categories, course.name, this.state.hypotheticalAssignments)

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
          `${course.name} - ${courseGrade.toFixed(2)}%`,
        ),
        React.createElement(GradeProgress, {grade: courseGrade}),
        FINAL_EXAM_CONFIG[course.name] && React.createElement(
          'div',
          { className: 'mt-4 p-4 bg-gray-50 rounded-lg' },
          [
            React.createElement(
              'h3',
              { className: 'font-bold mb-3 text-lg' },
              'Required Final Exam Scores'
            ),
            React.createElement(
              'div',
              { className: 'text-sm text-gray-600 mb-2' },
              `Final Exam is worth ${FINAL_EXAM_CONFIG[course.name]}% of your final grade`
            ),
            Object.entries(GRADE_CUTOFFS).map(([grade, cutoff]) => {
              const required = calculateRequiredFinalScore(courseGrade, cutoff, FINAL_EXAM_CONFIG[course.name])
              return React.createElement(
                'div',
                { 
                  className: 'py-1 flex justify-between items-center border-b last:border-0 border-gray-200',
                  key: grade 
                },
                [
                  React.createElement(
                    'span',
                    { className: 'font-medium' },
                    `For ${grade} (${cutoff}%):`
                  ),
                  React.createElement(
                    'span',
                    { 
                      className: required <= 100 
                        ? 'font-mono' 
                        : 'text-red-500 font-medium'
                    },
                    required <= 100 
                      ? `${Math.max(0, required).toFixed(1)}% needed`
                      : 'Not possible'
                  )
                ]
              )
            })
          ]
        ),
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
              courseName: course.name,
              hypotheticalAssignments: this.state.hypotheticalAssignments[category.name] || [],
              onAddHypothetical: () => this.addHypotheticalAssignment(category.name),
              onUpdateHypothetical: (index, updates) => 
                this.updateHypotheticalAssignment(category.name, index, updates),
              onDeleteHypothetical: (index) => 
                this.deleteHypotheticalAssignment(category.name, index)
            })
          )
        ),
      ],
    )
  }
}

window.CourseDetail = CourseDetail