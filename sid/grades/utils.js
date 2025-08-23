const parseXMLData = (xmlDoc) => {
  const courses = Array.from(xmlDoc.getElementsByTagName('course'))

  return courses
    .map((course) => {
      const courseName = course.getAttribute('name')
      const categories = Array.from(
        course.getElementsByTagName('category')
      ).map((category) => ({
        name: category.getAttribute('name'),
        weight: Number(category.getAttribute('weight')),
        assignments: Array.from(
          category.getElementsByTagName('assignment')
        ).map((assignment) => ({
          name: assignment.getAttribute('name'),
          score: Number(assignment.getAttribute('score')),
          total: Number(assignment.getAttribute('total')),
          date: assignment.getAttribute('date'),
          status: assignment.getAttribute('status'),
        })).filter(
          (assignment) =>
            assignment.score !== 0 || assignment.total !== 0
        ),
      }))

      const courseGrade = calculateCourseGrade(categories, courseName)

      return {
        name: courseName,
        grade: courseGrade,
        categories: categories,
      }
    })
    .sort((a, b) => b.grade - a.grade)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  })
}

window.parseXMLData = parseXMLData
window.formatDate = formatDate