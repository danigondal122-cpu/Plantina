import {firestore} from '../firebase.config'
import { addDoc,collection } from 'firebase/firestore';

export const savePaymentInfo = async (data) => {
    const docRef = await addDoc(collection(firestore, 'payments'), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  };