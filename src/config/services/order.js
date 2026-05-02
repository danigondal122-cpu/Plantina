
import { getFirestore, collection, addDoc, Timestamp,query,where,getDocs,orderBy,limit, updateDoc ,doc ,getDoc} from "firebase/firestore";


import {firestore} from '../firebase.config'


export const createOrder = async ({ cartItems, userId }) => {
    
    if (!userId) {
        throw new Error("Missing user ID");
      }
    
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error("Cart is empty or invalid");
      }
    
  
    const deliveryFee = 9.0;
  
    const simplifiedItems = cartItems.map(item => ({
      uid: item.uid,
      name: item.name,
      price: item.price,
      image: item.image,
    }));
  
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const itemsTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const totalPrice = itemsTotal + deliveryFee;
  
    const orderData = {
      userId,
      items: simplifiedItems,
      numberOfItems: totalItems,
      totalPrice: totalPrice.toFixed(2),
      createdAt: Timestamp.now(),
      status: 'pending',
    };
  
    try {
      const docRef = await addDoc(collection(firestore, 'orders'), orderData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };


  export const updateOrder = async (orderId, data) => {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, data);
  };







  export const getOrder = async (userId) => {
    if (!userId) throw new Error("Missing user ID");
  
    const ordersRef = collection(firestore, "orders");
  
    const q = query(
        ordersRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(1)
      );
  
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) return null;
  
    const doc = snapshot.docs[0];
    const data = doc.data();
   
    return {
      id: doc.id,
      ...data,
      subtotal: (parseFloat(data.totalPrice) - 9.0).toFixed(2),
      delivery: 9.0,
      total: parseFloat(data.totalPrice),
    };
  };




  export const getOrderByOrderId = async (orderId) => {
    if (!orderId) throw new Error("Missing order ID");
  
    const orderRef = doc(firestore, "orders", orderId);
  
    try {
      const snapshot = await getDoc(orderRef);
  
      if (!snapshot.exists()) {
        return null;
      }
  
      const data = snapshot.data();
  
      return {
        id: snapshot.id,
        ...data,
        subtotal: (parseFloat(data.totalPrice) - 9.0).toFixed(2),
        delivery: 9.0,
        total: parseFloat(data.totalPrice),
      };
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  };
  






  
export const getOrdersByStatus = async (userId, status) => {
    
    if (!userId) throw new Error("Missing user ID");
  
    const ordersRef = collection(firestore, "orders");
  
    
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      where("status", "==", status)
    );
   
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) return [];
  
    const orders = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.());
    return orders;
  };
  


  export const getOrderById = async (orderId) => {
    if (!orderId) throw new Error("Missing order ID");
  
    const orderRef = doc(firestore, "orders", orderId);
  
    try {
      const snapshot = await getDoc(orderRef);
  
      if (!snapshot.exists()) {
        return null;
      }
  
      const data = snapshot.data();
  
      return {
        id: snapshot.id,
        ...data,
        subtotal: (parseFloat(data.totalPrice) - 9.0).toFixed(2),
        delivery: 9.0,
        total: parseFloat(data.totalPrice),
      };
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  };






  export const completeOrder = async ({ orderId, stripePaymentId }) => {
   
    if (!orderId || !stripePaymentId) {
      throw new Error("Missing order ID or Stripe payment ID");
    }
  
    const orderRef = doc(firestore, "orders", orderId);
  
    try {
      await updateDoc(orderRef, {
        status: "completed",
        stripePaymentId,
        completedAt: Timestamp.now(),
      });
      
      return true;
    } catch (error) {
      console.error("Error completing order:", error);
      throw error;
    }
  };