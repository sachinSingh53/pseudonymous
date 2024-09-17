import firebase from 'firebase'

const firebaseConfig = {
  databaseURL: "https://twitterclone-94878-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyBZzEPaFEuD0TMOSkNs_yETbYgDHOnbf_4",
  authDomain: "twitterclone-94878.firebaseapp.com",
  projectId: "twitterclone-94878",
  storageBucket: "twitterclone-94878.appspot.com",
  messagingSenderId: "695980274396",
  appId: "1:695980274396:web:9f6fca8db7bc08cc1e3a19",
  measurementId: "G-DW4EZBZ97X"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, provider }

export default db




