
const firebaseConfig = {
  apiKey: "AIzaSyDb-54wgx8PXjzHlyI2SDeM6gA-NQ5laAc",
  authDomain: "tienda-yeni.firebaseapp.com",
  databaseURL: "https://tienda-yeni-default-rtdb.firebaseio.com",
  projectId: "tienda-yeni",
  storageBucket: "tienda-yeni.firebasestorage.app",
  messagingSenderId: "282014670835",
  appId: "1:282014670835:web:65c86f1ccfc0aa32eefc86",
  measurementId: "G-8BY4YBL167"
};
// 🔥 ESTO ES CLAVE
firebase.initializeApp(firebaseConfig);

// servicios
const db = firebase.database();
const auth = firebase.auth();