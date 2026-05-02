
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore } from "../firebase.config"; 
export const fetchUserFavourites = async (userId) => {
    try {
 
      const favQuery = query(
        collection(firestore, "favourites"),
        where("userUid", "==", userId)
      );
      const favSnapshot = await getDocs(favQuery);
      const favouriteDocs = favSnapshot.docs;
  
      if (favouriteDocs.length === 0) return [];
  
    
      const plantPromises = favouriteDocs.map(async (favDoc) => {
        const { plantUid } = favDoc.data();
        const plantQuery = query(
          collection(firestore, "plants"),
          where("uid", "==", plantUid)
        );
        const plantSnapshot = await getDocs(plantQuery);
  
        const plantDoc = plantSnapshot.docs[0];
        if (plantDoc) {
          return { id: plantDoc.id, ...plantDoc.data() };
        }
  
        return null;
      });
  
      const plants = await Promise.all(plantPromises);
  
     
      return plants.filter(plant => plant !== null);
  
    } catch (error) {
      console.error("Error fetching user favourite plants:", error);
      return [];
    }
  };
  
