class NavigationManager {
  handleMenuNavigation(clickX, clickY, currentWindow, setCurrentWindow) {
    if (currentWindow === 'home') {
      if (clickX > HOME_LOCAL_X_START &&
        clickX < HOME_LOCAL_X_END &&
        clickY > HOME_LOCAL_Y_START &&
        clickY < HOME_LOCAL_Y_END) {
        setCurrentWindow('game')
      } else if (clickX > HOME_RULES_X_START &&
        clickX < HOME_RULES_X_END &&
        clickY > HOME_RULES_Y_START &&
        clickY < HOME_RULES_Y_END) {
        setCurrentWindow('agilityrules')
      }
    } else if (window.ruleScreens.includes(currentWindow)) {
      if (clickX > BACK_X_START &&
        clickX < BACK_X_END &&
        clickY > BACK_Y_START &&
        clickY < BACK_Y_END) {
        setCurrentWindow('home')
      } else if (currentWindow !== 'traps' &&
        clickX > NEXT_X_START &&
        clickX < NEXT_X_END &&
        clickY > NEXT_Y_START &&
        clickY < NEXT_Y_END) {
        const currentIndex = window.ruleScreens.indexOf(currentWindow)
        setCurrentWindow(window.ruleScreens[currentIndex + 1])
      }
    }
  }
}

window.navigationManager = new NavigationManager()