import { graphqlService } from '../services';

const state = {
  all: {},
  editingComponentType:null,
  components:{}
};

const done = "done";

const actions = {
  getAll({ commit }) {
    commit('getAllCompTypesRequest');

    graphqlService.graphQuery('getAllComponentTypes',null,"{id name owlClass sets {setName members {name owlClass}} attributes {name value type editor setName owlClass}}")
      .then(
        componentTypes => commit('getAllCompTypesSuccess', componentTypes),
        error => commit('getAllCompTypesFailure', error)
      );
  },

  newComponent({commit}, editingComponentType) {
    commit('selectEditor', editingComponentType)
  },

  closeEditor({commit}) {
    commit('closeEditor')
  },

  listComponents({commit}, componentType){
    commit('getComponentsByTypeRequest', componentType);

    graphqlService.graphQuery('getComponentsByType',{ componentType: componentType.name },"{id componentType name owlClass attributes {name value type editor owlClass}}")
      .then(
        components => commit('getComponentsByTypeSuccess', { list:components, type:componentType}),
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

  storeComponent({commit}, component) {
    commit('saveComponentRequest', component)
    var keepComponent = component;
    component.type = 'component';
    graphqlService.graphMutation('saveNewComponent', 'create', component, "NewComponentRequestInput", "{id name attributes { editor name owlClass type value}  owlClass componentType }")
      .then(
        component => {
          commit('saveComponentSuccess', component);
          setTimeout(() => {
            //      dispatch('alert/success', 'Saved', {root: true})
          })
        },
        error => {
          commit('saveComponentFailure', error);
          //       dispatch('alert/error', error, {root: true});
        }
      );
  },


  updateComponent({commit}, updateRequest) {
    commit('updateComponentRequest', updateRequest);
    var component = updateRequest.component;
    delete(component.changed);
    var keepComponent = component;
    component.type = 'component';
    graphqlService.graphMutation('updateComponent', 'update', component, "UpdateComponentRequestInput", "{id name componentType}")
      .then(
        component => {
          commit('updateComponentSuccess', keepComponent);
          setTimeout(() => {
            //      dispatch('alert/success', 'Saved', {root: true})
          })
        },
        error => {
          commit('updateComponentFailure', error);
          //       dispatch('alert/error', error, {root: true});
        }
      );
  },

  deleteComponent({ commit }, component) {
    commit('deleteCompRequest', component);

    graphqlService.graphMutation('deleteComponent','delete', {id: component.id}, "DeleteComponentRequestInput", "{id}")
      .then(
        component => commit('deleteCompSuccess', component.id),
        error => commit('deleteCompFailure', {id:component.id, error: error.toString() })
      );
  }
};

const mutations = {

  selectEditor (state, editingComponentType) {
    state.editingComponentType = editingComponentType;
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);
  },

  closeEditor (state) {
    state.editingComponentType = null;
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);
  },

  getAllCompTypesRequest(state) {
    state.all = { loading: true };
  },
  getAllCompTypesSuccess(state, componentTypes) {
    state.all = { items: componentTypes };
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);
  },
  getAllCompTypesFailure(state, error) {
    state.all = { error };
  },


  getComponentsByTypeRequest(state) {
    state.components = { loading: true};
  },
  getComponentsByTypeSuccess(state, components) {
    state.components = { items: components.list, componentType: components.type};
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);

  },
  getComponentsByTypeFailure(state, error) {
    state.components = { error};
  },

  // Save/ update a component.

  saveComponentRequest(state,component) {
    state.components = { items: state.components.items, saving: true};
  },
  saveComponentSuccess(state,component) {
    if (state.editingComponentType.name == component.componentType) {
      if (!state.components.items) {
        state.components.items = [];
      }
      state.components.items.push(component);
      state.components.saving = done;
      state.components.componentType = state.editingComponentType;
    } else {
      state.components = {items: state.components.items, saving: done};
    }
  },

  saveComponentFailure(state,error) {
    state.components.status = { items: state.components.items, error: error};
  },

  // TODO
  updateComponentRequest(state,updateRequest) {
    state.components = { items: state.components.items, updating: true, componentType: updateRequest.componentType};
    state.components.items = state.components.items.map(component =>
      component.id === updateRequest.component.id
        ? { ...component, updating: true }
        : component
    )
  },
  // TODO
  updateComponentFailure(state,error) {
    state.components.status = { items: state.components.items, error: error};
  },
  // TODO
  updateComponentSuccess(state,component) {
    if (state.components.componentType.name == component.componentType) {
      if (state.components.items) {
        for (let [index,statecomponent] of state.components.items.entries()) {
          if (statecomponent.id == component.id ) {
            state.components.items.splice(index,1,{...component, changed:false})

          }
        }
      }
      state.components.updating = done;
    } else {
      state.components = {items: state.components.items, updating: done};
    }
  },

  deleteCompRequest(state, id) {
    // add 'deleting:true' property to user being deleted
    state.components.items = state.components.items.map(component =>
        component.id === id
          ? { ...component, deleting: true }
          : component
    )
  },
  deleteCompSuccess(state, id) {
    // remove deleted user from state
    state.components.items = state.components.items.filter(component => component.id !== id)
  },
  deleteCompFailure(state, { id, error }) {
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.components.items = state.components.items.map(component => {
            if (component.id === id) {
              // make copy of component without 'deleting:true' property
              const { deleting, ...componentCopy } = component;
              // return copy of component with 'deleteError:[error]' property
              return { ...component, deleteError: error };
            }
      return component;
    })
  }
};

export const componentTypes = {
  namespaced: true,
  state,
  actions,
  mutations
};
