const GRADE_CUTOFFS = {
  'A': 92.5,
  'A-': 89.5,
  'B+': 86.5,
  'B': 82.5,
  'B-': 79.5,
  'C+': 76.5,
  'C': 72.5,
  'C-': 69.5,
  'D+': 66.5,
  'D': 62.5,
  'D-': 59.5,
  'F': 0.0
}

const GRADE_ORDER = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

const getGradeInfo = (currentGrade) => {
  let currentIndex = GRADE_ORDER.length - 1
  for (let i = 0; i < GRADE_ORDER.length; i++) {
    if (currentGrade >= GRADE_CUTOFFS[GRADE_ORDER[i]]) {
      currentIndex = i
      break
    }
  }

  const current = GRADE_ORDER[currentIndex]
  const higher = currentIndex > 0 ? GRADE_ORDER[currentIndex - 1] : null
  const lower = currentIndex < GRADE_ORDER.length - 1 ? GRADE_ORDER[currentIndex + 1] : null

  return {
    current: current,
    difference: higher ? GRADE_CUTOFFS[higher] - currentGrade : null,
    higher: higher,
    lower: lower,
    buffer: current !== 'F' ? currentGrade - GRADE_CUTOFFS[current] : null,
  }
}

window.GRADE_CUTOFFS = GRADE_CUTOFFS
window.getGradeInfo = getGradeInfo
