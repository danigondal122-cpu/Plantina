import { createStore,combineReducers } from 'redux';
import { persistStore, persistReducer, } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import cartReducer from './cartSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, 
  debug: true,
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
