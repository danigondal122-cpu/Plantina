import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, doc, setDoc,getDoc } from 'firebase/firestore';

import {firestore,auth} from '../config/firebase.config'
import { Alert } from 'react-native';
import { setUser, setLoading, setError, logout } from "../store/authSlice";





export const registerUser = async (username, email, password) => {
    try {
   
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
     
      
   
      await setDoc(doc(firestore, "users", user.uid), {
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
       
      });

        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
       
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();

    
    const userWithDetails = {
      uid: user.uid,
      email: user.email,
      name: userData.username, 
    };


    

    
  
     
      return { success: true, user: userWithDetails };
  
    
    } catch (error) {
      console.error("❌ Registration failed:", error.message);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'Email is already in use.' };
    }
    if (error.code === 'auth/invalid-email') {
      return { success: false, error: 'Invalid email format.' };
  }

  if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Password is too weak.' };
  }
     
      return { success: false, error: error.message };
    }
  };



  export const loginUser = async (email, password) => {
    try {
    
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
     
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
  
      const userData = userDoc.data();
  
    
      const userWithDetails = {
        uid: user.uid,
        email: user.email,
        ...userData,
      };
  
     
  
      return { success: true, user: userWithDetails };
    } catch (error) {
      console.error("❌ Login failed:", error.message);
     
      return { success: false, error: error.message };
    }
  };