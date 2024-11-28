const FINAL_EXAM_CONFIG = {
  'English 3': 10,
  'AP United States History': 10,
  'Mandarin 3': 15,
  'AP Calculus BC': 10,
}

function calculateRequiredFinalScore(currentGrade, targetGrade, finalWeight) {
    return (targetGrade * 100 - currentGrade * (100-finalWeight)) / finalWeight
}

window.FINAL_EXAM_CONFIG = FINAL_EXAM_CONFIG
window.calculateRequiredFinalScore = calculateRequiredFinalScore