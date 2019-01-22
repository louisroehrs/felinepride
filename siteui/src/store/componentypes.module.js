import { graphqlService } from '../services';

const state = {
  all: {},
  editingComponentType:null
};

const actions = {
  getAll({ commit }) {
    commit('getAllRequest');

    graphqlService.graphQuery('getAllComponentTypes',null,"{id name attributes {name value type}}")
      .then(
        componentTypes => commit('getAllSuccess', componentTypes),
        error => commit('getAllFailure', error)
      );
  },

  newComponent({commit}, editingComponentType) {
    commit('selectEditor', editingComponentType)
  },
/*    for (var componentType in this.state.componentTypes.all.items) {
      if (this.state.componentTypes.all.items[componentType].id == componentTypeId ) {
        this.store.commit('selectEditor', componentType);
      }
    }
    // something about assign this component typ  is this.
  },
*/
  delete({ commit }, id) {
    commit('deleteRequest', id);

    graphqlService.delete(id)
      .then(
        componentType => commit('deleteSuccess', id),
        error => commit('deleteSuccess', { id, error: error.toString() })
      );
  }
};

const mutations = {

  selectEditor (state, editingComponentType) {
    state.editingComponentType = editingComponentType;
  },
  getAllRequest(state) {
    state.all = { loading: true };
  },
  getAllSuccess(state, componentTypes) {
    state.all = { items: componentTypes };
  },
  getAllFailure(state, error) {
    state.all = { error };
  },
  deleteRequest(state, id) {
    // add 'deleting:true' property to user being deleted
    state.all.items = state.all.items.map(componentType =>
        componentType.id === id
          ? { ...componentType, deleting: true }
          : componentType
    )
  },
  deleteSuccess(state, id) {
    // remove deleted user from state
    state.all.items = state.all.items.filter(componentType => componentType.id !== id)
  },
  deleteFailure(state, { id, error }) {
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(componentType => {
            if (componentType.id === id) {
              // make copy of user without 'deleting:true' property
              const { deleting, ...componentTypeCopy } = componentType;
              // return copy of user with 'deleteError:[error]' property
              return { ...componentTypeCopy, deleteError: error };
            }
      return componentType;
    })
  }
};

export const componentTypes = {
  namespaced: true,
  state,
  actions,
  mutations
};
