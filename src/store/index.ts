import { createStore, } from 'vuex';

import modules from './modules';
import actions from './global/actions';
import getters from './global/getters';
import mutations from './global/mutations';
import state, { RootStateType, } from './global/state';

const store = createStore<RootStateType>({
  state,
  mutations,
  actions,
  getters,
  modules,
});

export default store;
