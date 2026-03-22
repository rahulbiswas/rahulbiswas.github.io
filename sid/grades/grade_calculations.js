const calculateAssignmentPercentage = (assignments) => {
  if (!assignments || assignments.length === 0) return NaN

  const validAssignments = assignments.filter(
    (assignment) =>
      assignment.status !== 'pending' && assignment.status !== 'exempt'
  )

  if (validAssignments.length === 0) return NaN

  const totalPoints = validAssignments.reduce(
    (sum, assignment) => sum + Number(assignment.total),
    0
  )

  if (totalPoints === 0) return NaN

  const earnedPoints = validAssignments.reduce(
    (sum, assignment) => sum + Number(assignment.score),
    0
  )

  return (earnedPoints / totalPoints) * 100
}

const findDroppedAssignments = (categories, courseName, hypotheticalAssignments = {}) => {
  let allCompletedAssignments = []
  categories.forEach(category => {
    let assignments = [...category.assignments]
    let hypotheticalKey = courseName + category.name;
    if (hypotheticalAssignments[hypotheticalKey]) {
      assignments = [...assignments, ...hypotheticalAssignments[hypotheticalKey]]
    }
    const completed = assignments.filter(a => 
      (a.status !== 'pending' && a.status !== 'exempt') || 
      !('status' in a)
    ).map(a => ({...a, category: category.name}))
    allCompletedAssignments = [...allCompletedAssignments, ...completed]
  })

  const numDrops = getNumDrops(courseName)
  if (numDrops === 0) return []

  const eligibleAssignments = allCompletedAssignments.filter(a => 
    isEligibleForDropping(courseName, a.category, a)
  )
  
  if (eligibleAssignments.length === 0) return []

  return eligibleAssignments
    .sort((a, b) => (a.score / a.total) - (b.score / b.total))
    .slice(0, numDrops)
}

const calculateCourseGrade = (categories, courseName, hypotheticalAssignments = {}) => {
  if (!categories || categories.length === 0) return 0

  let totalWeight = 0
  let weightedSum = 0
  let totalEarnedPoints = 0
  let totalPossiblePoints = 0
  
  const droppedAssignments = findDroppedAssignments(categories, courseName, hypotheticalAssignments)

  categories.forEach((category) => {
    let assignments = [...category.assignments]

    let hypotheticalKey = courseName + category.name;
    if (hypotheticalAssignments[hypotheticalKey]) {
      assignments = [...assignments, ...hypotheticalAssignments[hypotheticalKey]]
    }

    assignments = assignments.filter(a => 
      !droppedAssignments.some(dropped => 
        dropped.category === category.name &&
        dropped.name === a.name &&
        dropped.score === a.score &&
        dropped.total === a.total
      )
    )

    const validAssignments = assignments.filter(
      (a) => a.status !== 'pending' && a.status !== 'exempt'
    )

    validAssignments.forEach((a) => {
      totalEarnedPoints += Number(a.score)
      totalPossiblePoints += Number(a.total)
    })

    const percentage = calculateAssignmentPercentage(assignments)
    if (!isNaN(percentage)) {
      weightedSum += percentage * (category.weight / 100)
      totalWeight += category.weight / 100
    }
  })

  if (totalWeight > 0) {
    return weightedSum / totalWeight
  }

  return totalPossiblePoints > 0 ? (totalEarnedPoints / totalPossiblePoints) * 100 : 0
}

window.calculateAssignmentPercentage = calculateAssignmentPercentage
window.calculateCourseGrade = calculateCourseGrade
window.findDroppedAssignments = findDroppedAssignments
