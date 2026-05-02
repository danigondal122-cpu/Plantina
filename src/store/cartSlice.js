const initialState = {
    items: [], // array of { id, name, quantity, price }
    totalQuantity: 0,
    totalPrice: 0,
  };
  
  export default function cartReducer(state = initialState, action) {
    switch (action.type) {
          
    case 'cart/addItem': {
        const existingItem = state.items.find(item => item.uid === action.payload.uid); 
        let updatedItems;
     
        if (!existingItem) {
        
          updatedItems = [...state.items, { ...action.payload, quantity:action.payload.quantity?? 1 }];
        } else {
        
          updatedItems = state.items;
        }
  
       
        const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  
        return {
          ...state,
          items: updatedItems,
          totalQuantity,
          totalPrice,
        };
      }
  
     
      case 'cart/removeItem': {
      
      
       
        const updatedItems = state.items.filter(item => item.uid !== action.payload.uid);
       
       
        const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  
        return {
          ...state,
          items: updatedItems,
          totalQuantity,
          totalPrice,
        };
      }
  
      
        
          case 'cart/increaseQuantity': {
            const updatedItems = state.items.map(item =>
              item.uid === action.payload
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
      
            const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
      
            return {
              ...state,
              items: updatedItems,
              totalQuantity,
              totalPrice,
            };
          }
      
        
          case 'cart/decreaseQuantity': {
            const updatedItems = state.items.map(item => {
              if (item.uid === action.payload) {
                if (item.quantity > 1) {
                  return { ...item, quantity: item.quantity - 1 };
                }
                return null;
              }
              return item;
            }).filter(item => item !== null); 
      
            const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
      
            return {
              ...state,
              items: updatedItems,
              totalQuantity,
              totalPrice,
            };
          }
  
      case 'cart/clear':
        return initialState;
  
      default:
        return state;
    }
  }
  

  export const incrementToCart = (item) => ({
    type: 'cart/addItem',
    payload: item,
  });
  
  export const decrementToCart = (id) => ({
    type: 'cart/removeItem',
    payload: id,
  });
  
  export const clearCart = () => ({
    type: 'cart/clear',
  });

  export const addItemToCart = (item) => ({
    type: 'cart/addItem',
    payload: {
      ...item,
      quantity: item.quantity ?? 1,
    }, 
  });

  
  export const removeItemFromCart = (uid) => ({
    type: 'cart/removeItem',
    payload: uid, 
  });
  