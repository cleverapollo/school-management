import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/auth';
import adminPanelReducer from './slices/adminPanel';
import calendarReducer from './slices/calendar';

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
  calendar: calendarReducer,
});

export { rootPersistConfig, rootReducer };
