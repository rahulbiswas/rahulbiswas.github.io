const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

const signIn = () => {
  auth.signInWithPopup(provider)
    .catch((error) => {
      console.error('Sign in error:', error)
    })
}

const signOut = () => {
  auth.signOut()
    .catch((error) => {
      console.error('Sign out error:', error)
    })
}

window.auth = auth
window.signIn = signIn
window.signOut = signOut