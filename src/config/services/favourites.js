import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase.config";

export const toggleFavorite = async (userUid, plantUid, setLiked) => {
  const favoriteDocRef = doc(firestore, "favourites", `${userUid}_${plantUid}`);
  const docSnap = await getDoc(favoriteDocRef);

  if (docSnap.exists()) {
   
    await deleteDoc(favoriteDocRef);
    setLiked(false);
  } else {
    
    await setDoc(favoriteDocRef, {
      userUid,
      plantUid,
      timestamp: Date.now()
    });
    setLiked(true);
  }
};

export const isFavorite = async (userUid, plantUid) => {
  const favoriteDocRef = doc(firestore, "favourites", `${userUid}_${plantUid}`);
  const docSnap = await getDoc(favoriteDocRef);
  return docSnap.exists();
};
