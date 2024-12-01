class NavigationManager {
  handleMenuNavigation(clickX, clickY, currentWindow, setCurrentWindow) {
    if (currentWindow === 'home') {
      if (clickX > 35 &&
        clickX < 65 &&
        clickY > 44 &&
        clickY < 56) {
        setCurrentWindow('game')
      }
    }
  }
}

window.navigationManager = new NavigationManager()