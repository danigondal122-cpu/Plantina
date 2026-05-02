import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyClLfXNs5CfJAfcCoef66mkiK9rSa-YQ5U',
  projectId: 'plantina-c243c',
  messagingSenderId: '62801117250',
  appId: '1:280922894812:android:b7f87c9760be6cdf941f19',
};


let app;

if (getApps().length === 0) {

  app = initializeApp(firebaseConfig);
} else {
  
  app = getApps()[0]; 
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { auth, firestore, storage ,functions,httpsCallable};
export default app;
