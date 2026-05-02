const initialState = {
    user: null,
    loading: false,
    error: null,
  };
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case 'auth/setUser':
        return { ...state, user: action.payload };
      case 'auth/logout':
        return { ...initialState };
      default:
        return state;
    }
  }
  
  export const setUser = (user) => ({ type: 'auth/setUser', payload: user });
  export const setLogout = () => ({ type: 'auth/logout' });
  