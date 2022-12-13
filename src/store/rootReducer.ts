import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/auth';
import adminPanelReducer from './slices/adminPanel';
import mailReducer from './slices/mail';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['auth'],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  adminPanel: adminPanelReducer,
  mail: mailReducer,
});

export { rootPersistConfig, rootReducer };
