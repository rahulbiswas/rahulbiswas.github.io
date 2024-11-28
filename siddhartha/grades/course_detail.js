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