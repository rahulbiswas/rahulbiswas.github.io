const GRADE_CUTOFFS = {
  'A': 92.5,
  'A-': 89.5,
  'B+': 86.5,
}

const getGradeInfo = (currentGrade) => {
  if (currentGrade >= GRADE_CUTOFFS.A) {
    return {
      current: 'A',
      difference: currentGrade - GRADE_CUTOFFS.A,
      higher: null,
      lower: 'A-',
      buffer: currentGrade - GRADE_CUTOFFS['A'],
    }
  }
  if (currentGrade >= GRADE_CUTOFFS['A-']) {
    return {
      current: 'A-',
      difference: GRADE_CUTOFFS.A - currentGrade,
      higher: 'A',
      lower: 'B+',
      buffer: currentGrade - GRADE_CUTOFFS['A-'],
    }
  }
  if (currentGrade >= GRADE_CUTOFFS['B+']) {
    return {
      current: 'B+',
      difference: GRADE_CUTOFFS['A-'] - currentGrade,
      higher: 'A-',
      lower: 'B',
      buffer: currentGrade - GRADE_CUTOFFS['B+'],
    }
  }
  return {
    current: 'B',
    difference: GRADE_CUTOFFS['B+'] - currentGrade,
    higher: 'B+',
    lower: null,
    buffer: null,
  }
}

window.GRADE_CUTOFFS = GRADE_CUTOFFS
window.getGradeInfo = getGradeInfo