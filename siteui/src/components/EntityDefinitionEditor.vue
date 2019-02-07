<template >
    <div>
        <h3 class="pagename" v-if="entityDefinition">
            <label class="editbutton" v-if="entityDefinition" @click="newThisAttribute()">New Attribute</label>
            <label v-bind:class="{ toggleediton: toggleedit, toggleeditoff:!toggleedit}">Edit <input type="checkbox" v-model="toggleedit"/></label>
            Entity Definition for {{entityDefinition.name}}
        </h3>

        <div class="rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
            <div class="makeyway"
                 v-if="newAttribute">
                <EditableRow
                        v-if="newAttribute"
                        :component="entityDefinition.name ? component:entityDefinition"
                        :component-type="componentType"
                        :save-component="saveComponentAttributeDefinition"
                        :close-editor="closeThisEditor"
                        :blankform="true"
                />
            </div>
            <ul  v-if="entityDefinition && entityDefinition.attributes">
                <li class="componententry" v-for="(attribute,index) in entityDefinition.attributes" :key="index">
                    <div v-if="componentType">
                        <!-- TODO: make each row from an attribute like it is a separate component -->
                        <EditableRow :component="makeEditableAttributesComponentFrom(attribute,index)"
                                     :component-type="componentType"
                                     :save-component="saveComponentAttributeDefinition"
                                     :update-component="updateThisComponentAttributeDefinition"
                                     :delete-component="deleteThisComponentAttributeDefinition"
                                     :blankform="false"
                                     :toggleedit="toggleedit"
                        />

                    </div>
                </li>

            </ul>
        </div>
    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {

  props: ['entityDefinition','componentType'],

  data() {
    return {
      scrollerHeight: 300,
      toggleedit:false,
      component: {name:"", attributes:{}},
      componentDefinitionAttributes: [],
      editableAttributeAsComponent: null,
    }
  },
  computed: {
    ...mapState({
      editingComponentType : state => state.componentTypes.editingComponentType,
      newAttribute : state => state.componentTypes.newAttribute

    })
  },

  mounted() {
      window.addEventListener('resize', this.resize);
      //Init
      this.resize()
  },

  methods: {
    ...mapActions('componentTypes', ['deleteComponentType','updateComponentType','showNewAttribute','storeComponentType','closeAttribute']),

    newThisAttribute() {
      this.showNewAttribute();
    },

    resize() {
      this.scrollerHeight = window.innerHeight - this.$refs.scrollermain.offsetTop-10 ;
    },

    closeThisEditor() {
      this.component = {name:"", attributes:{}};
      this.closeAttribute();
    },

    // TODO: make maybe create a new datastructure to present and then convert back when saving.
    makeEditableAttributesComponentFrom(attribute, index) {
      var tempEditableAttributeAsComponent = {};
      console.log(JSON.stringify(attribute))
      console.log(JSON.stringify(this.editingComponentType))
     // tempEditableAttributeAsComponent.name = attribute.name;
      var tempEditableAttribute = {}
      for (var componentTypeAttribute of this.editingComponentType.attributes) {
        tempEditableAttribute[componentTypeAttribute.name]= attribute[componentTypeAttribute.name];
      }
      tempEditableAttributeAsComponent.attributes = tempEditableAttribute;
      tempEditableAttributeAsComponent.index = index
      this.editableAttributeAsComponent= tempEditableAttributeAsComponent;

      return tempEditableAttributeAsComponent;
    },



/*
    makeNewComponentType() {
      this.componentType.name = prompt("Name your new component type.");
      this.componentType = {name:"", attributes:{}};
      this.newComponentType(componentType);
    },
*/
    flattenComponentType(componentType) {
      let tmpattributes = componentType.attributes;
      if (tmpattributes.map) {  // may have already flattened the attributes which would kill map.
        let newattributes = {};
        tmpattributes.map(attribute => (newattributes[attribute.name] = attribute.value));
        componentType.attributes = newattributes;
      }
      return component;
    },

    attributeRequestInput(ari) {
      var componentType = ari.componentType;
      var attributes = ari.attributes;
      var newAttributes = [];
      for (var attribute in componentType.attributes) {
        var newAttribute = {};
        newAttribute.name = componentType.attributes[attribute].name;
        newAttribute.owlClass = componentType.attributes[attribute].owlClass;
        newAttribute.type = componentType.attributes[attribute].type;
        newAttribute.editor = componentType.attributes[attribute].editor;
        newAttribute.value = attributes[newAttribute.name];
        newAttributes.push(newAttribute);
      }
      return newAttributes;
    },
    // Goal.  update this.entityDefinition with a single attribute and save
    // by calling updateComponent type:componentType id: componentType: <name>
    updateThisComponentAttributeDefinition(updateRequest) {
      debugger;
      var updateComponentRequestInput = {};
      var updatedAttribute = updateRequest.component;
      var componentType = updateRequest.componentType;
      debugger;  // this.entityDefinition needs to be updated and saved.

     
      updateComponentRequestInput = this.entityDefinition;
      //overlay fixed properties.
      updateComponentRequestInput.type = "componenttype";
      updateComponentRequestInput.componentType = "componenttype";

      updateComponentRequestInput.attributes[updatedAttribute.index] = updatedAttribute.attributes;
 //     updateComponentRequestInput.attributes = this.attributeRequestInput({attributes: updateComponentRequestInput.attributes,componentType:componentType});
      this.updateComponentType( {component:updateComponentRequestInput, componentType:componentType});
    },
/* TODO: This next.  save the component as an attribute. */
    saveComponentAttributeDefinition() {
      var newComponentRequestInput = {};
      debugger;
      newComponentRequestInput.name = this.componentType.name;
      newComponentRequestInput.type = "component";
      newComponentRequestInput.componentType = this.components.componentType.name;
      newComponentRequestInput.owlClass = this.components.componentType.owlClass;
      newComponentRequestInput.attributes = this.attributeRequestInput({attributes:this.componentType.attributes,componentType:this.components.componentType});
      this.storeComponent( newComponentRequestInput);
    },


    deleteThisComponentAttributeDefinition(attribute) {
      //this.deleteComponent(attribute);
    }

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  }
};
</script>
<style>

    .pagename {
        margin:1px;
        height:40px;
    }
    div.scrolling {
        height: 200px;
        white-space: nowrap;
    }

    .makeyway {
        clear:both
    }


    .pagename {
        color:#eee;
        font-size:16px;
        margin-bottom:7px;
    }



</style>