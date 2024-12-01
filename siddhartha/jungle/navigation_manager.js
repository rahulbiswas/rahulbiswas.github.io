class NavigationManager {
  handleMenuNavigation(clickX, clickY, currentWindow, setCurrentWindow) {
    if (currentWindow === 'home') {
      if (clickX > HOME_LOCAL_X_START &&
        clickX < HOME_LOCAL_X_END &&
        clickY > HOME_LOCAL_Y_START &&
        clickY < HOME_LOCAL_Y_END) {
        setCurrentWindow('game')
      }
    }
  }
}

window.navigationManager = new NavigationManager()