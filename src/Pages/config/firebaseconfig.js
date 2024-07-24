import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDwkdLLak3JKgqrrxQOZxrshrY6dQ6Axg",
  authDomain: "authentication-8f7cd.firebaseapp.com",
  projectId: "authentication-8f7cd",
  storageBucket: "authentication-8f7cd.appspot.com",
  messagingSenderId: "774847416031",
  appId: "1:774847416031:web:b631c2ac0a388528254b6a"
};

// Inicializa o Firebase apenas se ainda não foi inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
