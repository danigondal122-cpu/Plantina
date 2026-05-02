import { firestore } from '../firebase.config'; 
import { collection, query, where, getDocs } from 'firebase/firestore';


export const fetchUserPlants = async (userId) => {
  try {
  
    const plantsRef = collection(firestore, 'user_plants');
   
    const q = query(plantsRef, where('createdBy', '==', userId));
   
    const querySnapshot = await getDocs(q);

   
    const plants = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data(), 
    }));

    return plants;
  } catch (error) {
    console.error('Error fetching user plants:', error);
    throw new Error('Unable to fetch plants');
  }
};
