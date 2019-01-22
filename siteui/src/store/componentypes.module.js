import { graphqlService } from '../services';

const state = {
  all: {},
  editingComponentType:null,
  components:{}
};

const actions = {
  getAll({ commit }) {
    commit('getAllCompTypesRequest');

    graphqlService.graphQuery('getAllComponentTypes',null,"{id name attributes {name value type}}")
      .then(
        componentTypes => commit('getAllCompTypesSuccess', componentTypes),
        error => commit('getAllCompTypesFailure', error)
      );
  },

  newComponent({commit}, editingComponentType) {
    commit('selectEditor', editingComponentType)
  },

  listComponents({commit}, componentType){
    commit('getComponentsByTypeRequest', componentType);

    graphqlService.graphQuery('getComponentsByType',{ componentType: componentType.name },"{id componentType name attributes {name value }}")
      .then(
        components => commit('getComponentsByTypeSuccess', components),
        error => commit('getComponentsByTypeFailure', error)
      );
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

  getAllCompTypesRequest(state) {
    state.all = { loading: true };
  },
  getAllCompTypesSuccess(state, componentTypes) {
    state.all = { items: componentTypes };
  },
  getAllCompTypesFailure(state, error) {
    state.all = { error };
  },


  getComponentsByTypeRequest(state) {
    state.components = { loading: true};
  },
  getComponentsByTypeSuccess(state, components) {
    state.components = { items: components};
  },
  getComponentsByTypeFailure(state, error) {
    state.components = { error};
  },


  deleteCompRequest(state, id) {
    // add 'deleting:true' property to user being deleted
    state.all.items = state.all.items.map(componentType =>
        componentType.id === id
          ? { ...componentType, deleting: true }
          : componentType
    )
  },
  deleteCompSuccess(state, id) {
    // remove deleted user from state
    state.all.items = state.all.items.filter(componentType => componentType.id !== id)
  },
  deleteCompFailure(state, { id, error }) {
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
