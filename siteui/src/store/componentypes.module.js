import { graphqlService } from '../services';

const state = {
    types: {},
    components:{},
    editingComponentType: null,
    editingComponentDefinition: null,
    editingAttributeType: null,
    newAttribute: null
  }
;

const done = "done";

const actions = {
  getAllComponentTypes({ commit }) {
    commit('getAllCompTypesRequest');

    graphqlService.graphQuery('getAllComponentTypes',{visibility:"all"},"{id name owlClass sets {setName members {name owlClass}} attributes {name value datatype editor setName owlClass}}")
      .then(
        componentTypes => commit('getAllCompTypesSuccess', componentTypes),
        error => commit('getAllCompTypesFailure', error)
      );
  },

  newComponent({commit}, editingComponentType) {
    commit('selectEditor', editingComponentType)
  },

  showNewAttribute({commit}) {
    commit('newAttribute');
  },

  closeAttribute({commit}) {
    commit('closeAttribute');
  },

  closeEditor({commit}) {
    commit('closeEditor')
  },

  listComponents({commit}, componentType){
    commit('getComponentsByTypeRequest', componentType);

    graphqlService.graphQuery('getComponentsByType',{ componentType: componentType.name},"{id componentType name owlClass  attributes {name value datatype editor owlClass}}")
      .then(
        components => commit('getComponentsByTypeSuccess', { list:components, type:componentType}),
        error => commit('getComponentsByTypeFailure', error)
      );
  },

/*    for (var componentType in this.state.componentTypes.types.items) {
      if (this.state.componentTypes.types.items[componentType].id == componentTypeId ) {
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
    graphqlService.graphMutation('saveNewComponent', 'create', component, "NewComponentRequestInput", "{id name  attributes { editor name owlClass datatype value}  owlClass componentType }")
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
    graphqlService.graphMutation('updateComponent', 'update', component, "UpdateComponentRequestInput", "{id name componentType }")
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
  },

  editComponentType({commit}, componentType){
    commit('editComponentTypeRequest');

    graphqlService.graphQuery('getComponentTypeByName',{ "name":componentType.name },"{id name visibility owlClass sets { setName members {name owlClass} } attributes {name value setName datatype editor owlClass}}")
      .then(
        componentType => commit('editComponentTypeSuccess', componentType),
        error => commit('editComponentTypeFailure', error)
      )
      .then(
        graphqlService.graphQuery('getComponentTypeByName',{ "name":"componenttypeattribute" },"{id name owlClass visibility sets { setName members {name owlClass} } attributes {name setName value datatype editor owlClass}}")
          .then(
            componentType => commit('selectEditor',componentType),
            error => commit('editComponentTypeFailure',error)
          )
// TODO: fill in the componenttypeattribute data into database and bootstrap.  def of a componentTypes attributes.
  );
  },


  updateComponentType({commit}, updateRequest) {
    commit('updateComponentTypeRequest', updateRequest);
    var component = updateRequest.component;
    delete(component.changed);
    var keepComponent = component;
    component.type = 'componenttype';
    graphqlService.graphMutation('updateComponentType', 'update', component, "UpdateComponentTypeRequestInput", "{id name owlClass visibility type componentType sets {setName members {name owlClass}} attributes {name setName value datatype editor owlClass}}")
      .then(
        componentType => {
          commit('updateComponentTypeSuccess', componentType);
          setTimeout(() => {
            //      dispatch('alert/success', 'Saved', {root: true})
          })
        },
        error => {
          commit('updateComponentTypeFailure', error);
          //       dispatch('alert/error', error, {root: true});
        }
      );
  },



};

const mutations = {

  editComponentTypeRequest( state)  {
    state.editingComponentDefinition = { loading : true};
  },

  editComponentTypeSuccess(state, componentType) {
    state.editingComponentDefinition = componentType;
    // TODO, put the editing Component Definition in a usable format for the uI.  method exists, use makeEditableAttributesComponentFrom
  },

  editComponentTypeFailure(state, error) {
    state.editingComponentDefinition = error;
  },

  newAttribute() {
    state.newAttribute = {"status": true};
  },

  closeAttribute() {
    state.newAttribute = null;
  },

  selectEditor (state, editingComponentType) {
    state.editingComponentType = editingComponentType;
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);
  },

  closeEditor (state) {
    state.editingComponentType = null;
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);
  },

  getAllCompTypesRequest(state) {
    state.types = { loading: true };
  },
  getAllCompTypesSuccess(state, componentTypes) {
    state.types = { items: componentTypes };
    window.setTimeout("window.dispatchEvent(new Event('resize'))",100);
  },
  getAllCompTypesFailure(state, error) {
    state.types = { error };
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
    state.components.saving = "true";
  },
  saveComponentSuccess(state,component) {
    if (!state.components.items) {
      state.components.items = [];
    }
    state.components.items.unshift(component);
    state.components.saving = "done";
    state.editingComponentType = null;
    window.setTimeout(this.closeEditor,100);
  },

  saveComponentFailure(state,error) {
    state.components.status = { items: state.components.items, error: error};
  },


  updateComponentRequest(state,updateRequest) {
    state.components = { items: state.components.items, updating: true, componentType: updateRequest.componentType};
    state.components.items = state.components.items.map(component =>
      component.id === updateRequest.component.id
        ? { ...component, updating: true }
        : component
    )
  },

  updateComponentFailure(state,error) {
    state.components.status = { items: state.components.items, error: error};
  },

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
  },


  updateComponentTypeRequest(state,updateRequest) {
    state.types = {
      items: state.types.items,
      updating: true,
      componentType: updateRequest.componentType
    };
    state.types.items = state.types.items.map(componentType =>
      componentType.id === updateRequest.componentType.id
        ? { ...componentType, updating: true }
        : componentType
    )
  },
  // TODO
  updateComponentTypeFailure(state,error) {
    state.components.status = { items: state.components.items, error: error};
  },
  // TODO
  updateComponentTypeSuccess(state,componentType) {

//    if (state.types.items. == componentType.id) {  // are we showing the same componenttype?
      if (state.types.items) {
        debugger;
        for (let [index,statecomponenttype] of state.types.items.entries()) {
          if (statecomponenttype.id == componentType.id ) {
            state.types.items.splice(index,1,{...componentType, changed:false})
          }
        }
      }
      state.editingComponentType = componentType;
      state.types.updating = "done";
//    } else {
//      state.types = {items: state.types.items, updating: "done"};
//    }
  },
};

export const componentTypes = {
  namespaced: true,
  state,
  actions,
  mutations
};
