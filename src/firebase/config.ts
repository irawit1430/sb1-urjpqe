import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBro6sEvqHQdD807Rx-8LpEwutSfNmhQlg",
  authDomain: "vast-arena-409018.firebaseapp.com",
  projectId: "vast-arena-409018",
  storageBucket: "vast-arena-409018.appspot.com",
  messagingSenderId: "481316107175",
  appId: "1:481316107175:web:266ab9232b8d84e156fc82",
  measurementId: "G-1M4N5TCSFG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;