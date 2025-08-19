class CourseDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hypotheticalAssignments: {}
    }
  }

  addHypotheticalAssignment = (courseName, categoryName) => {
    this.setState(prevState => {
      let hypotheticalKey = courseName + categoryName
      const categoryHypotheticals = prevState.hypotheticalAssignments[hypotheticalKey] || []
      return {
        hypotheticalAssignments: {
          ...prevState.hypotheticalAssignments,
          [hypotheticalKey]: [...categoryHypotheticals, {
            name: `Hypothetical ${categoryName} #${categoryHypotheticals.length + 1}`,
            score: 0,
            total: 0
          }]
        }
      }
    })
  }

  updateHypotheticalAssignment = (courseName, categoryName, index, updates) => {
    let hypotheticalKey = courseName + categoryName
    this.setState(prevState => {
      const categoryHypotheticals = [...(prevState.hypotheticalAssignments[hypotheticalKey] || [])]
      categoryHypotheticals[index] = {...categoryHypotheticals[index], ...updates}
      return {
        hypotheticalAssignments: {
          ...prevState.hypotheticalAssignments,
          [hypotheticalKey]: categoryHypotheticals
        }
      }
    })
  }

  deleteHypotheticalAssignment = (courseName, categoryName, index) => {
    let hypotheticalKey = courseName + categoryName
    this.setState(prevState => {
      const categoryHypotheticals = [...(prevState.hypotheticalAssignments[hypotheticalKey] || [])]
      categoryHypotheticals.splice(index, 1)
      return {
        hypotheticalAssignments: {
          ...prevState.hypotheticalAssignments,
          [hypotheticalKey]: categoryHypotheticals
        }
      }
    })
  }

  render() {
    const {course} = this.props
    if (!course || !course.categories || course.categories.length === 0) return null

    const courseGrade = calculateCourseGrade(course.categories, course.name, this.state.hypotheticalAssignments)
    const droppedAssignments = findDroppedAssignments(course.categories, course.name, this.state.hypotheticalAssignments)

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
              hypotheticalAssignments: this.state.hypotheticalAssignments[course.name + category.name] || [],
              onAddHypothetical: () => this.addHypotheticalAssignment(course.name, category.name),
              onUpdateHypothetical: (index, updates) => 
                this.updateHypotheticalAssignment(course.name, category.name, index, updates),
              onDeleteHypothetical: (index) => 
                this.deleteHypotheticalAssignment(course.name, category.name, index),
              droppedAssignments: droppedAssignments
            })
          )
        ),
      ],
    )
  }
}

window.CourseDetail = CourseDetail
