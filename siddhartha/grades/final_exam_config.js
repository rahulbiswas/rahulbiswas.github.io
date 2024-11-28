const FINAL_EXAM_CONFIG = {
}

function calculateRequiredFinalScore(currentGrade, targetGrade, finalWeight) {
    return (targetGrade * 100 - currentGrade * (100-finalWeight)) / finalWeight
}

window.FINAL_EXAM_CONFIG = FINAL_EXAM_CONFIG
window.calculateRequiredFinalScore = calculateRequiredFinalScore