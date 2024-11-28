const firebaseConfig = {
  apiKey: 'AIzaSyCmxOvD5gal1uG2VVJaPbxiW-cCJjlAzuk',
  authDomain: 'siddharthagrades.firebaseapp.com',
  projectId: 'siddharthagrades',
  storageBucket: 'siddharthagrades.firebasestorage.app',
  messagingSenderId: '331910912977',
  appId: '1:331910912977:web:3e1c3f6f32a6bea20f1ef0'
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
window.db = db