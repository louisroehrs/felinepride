<template >
    <div>
        <h3 class="pagename" v-if="entityDefinition">
            <label class="editbutton" vd-if="entityDefinition" @click="makeNewAttribute()">NewAttribute</label>
            <label v-bind:class="{ toggleediton: toggleedit, toggleeditoff:!toggleedit}">Edit <input type="checkbox" v-model="toggleedit"/></label>
            Entity Definition for {{entityDefinition.name}}
        </h3>

        <div class="rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
            <div class="makeyway"
                 v-if="componentType">
                <EditableRow
                        v-if="componentType"
                        :component="entityDefinition.name ? component:entityDefinition"
                        :component-type="componentType"
                        :save-component="saveComponentAttributeDefinition"
                        :close-editor="closeThisEditor"
                        :blankform="true"
                />
            </div>
            <ul  v-if="entityDefinition && entityDefinition.attributes">
                <li class="componententry" v-for="attribute in entityDefinition.attributes" :key="attribute.name">
                    <div v-if="componentType">
                        <!-- TODO: make each row from an attribute like it is a separate component -->
                        <EditableRow :component="makeComponentFrom(attribute,componentType)"
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
      componentDefinitionAttributes: []
    }
  },
  computed: {
    ...mapState({

    })
  },

  mounted() {
      window.addEventListener('resize', this.resize);
      //Init
      this.resize()
  },

  methods: {
    ...mapActions('componentTypes', ['deleteComponentType','updateComponentType','newComponentType','storeComponentType','closeEditor']),
    resize() {
      this.scrollerHeight = window.innerHeight - this.$refs.scrollermain.offsetTop-10 ;
    },

    closeThisEditor() {
      this.component = {name:"", attributes:{}};
      this.closeEditor();
    },

    makeComponentFrom(attribute,componentType) {
      var editableAttributeAsComponent = {};
      console.log(JSON.stringify(attribute))
      console.log(JSON.stringify(componentType))
      editableAttributeAsComponent.name = attribute.name;
      var tempEditableAttribute = {}
      for (var componentTypeAttribute of componentType.attributes) {
        tempEditableAttribute[componentTypeAttribute.name]= attribute[componentTypeAttribute.name];
      }
      editableAttributeAsComponent.attributes = tempEditableAttribute;
      return editableAttributeAsComponent;

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

    updateThisComponentAttributeDefinition(updateRequest) {
      var updateComponentRequestInput = {};
      var component = updateRequest.component;
      var componentType = updateRequest.componentType;
      updateComponentRequestInput.id = component.id;
      updateComponentRequestInput.name = component.name;
      updateComponentRequestInput.type = "component";
      updateComponentRequestInput.componentType = componentType.name;
      updateComponentRequestInput.owlClass = componentType.owlClass;
      updateComponentRequestInput.attributes = this.attributeRequestInput({attributes: component.attributes,componentType:componentType});
      this.updateComponent( {component:updateComponentRequestInput, componentType:componentType});
    },

    saveComponentAttributeDefinition() {
      var newComponentRequestInput = {};
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

    li.componententry {
        clear:both;
    }
    .smalllabel {
        float: left;
        margin-top:5px;
        margin-right: 5px;
        min-width: 50px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.50);
    }

    input.componentfieldinput {
        margin:0px;
        border: 0px;
        float:left;
        padding:5px;
        font-size:12pt;
        background-color:#111;
        color:white;
    }
    .pagename {
        color:#eee;
        font-size:16px;
        margin-bottom:7px;
    }

    .editfield {
        margin: 0px;
        border: 0px;
        float: left;
        padding: 5px;
        font-size: 16pt;
        background-color: black;
        color: white;
        list-style-type: none;
    }

    .buttonfield {
        margin: 0px;
        border: 0px;
        float: left;
        padding-left: 5px;
        color: white;
        list-style-type: none;
    }

    .deletebutton,.updatebutton {
        border-radius:5px;
        padding:5px;
        font-size:16px;
    }
    .deletebutton:hover {
        background-color: red;
        color:white;
    }

    .deletebutton {
        color: red;
    }

    .deleting {
        background-color: burlywood;
    }
    .updating {
        background-color: blue;
    }
    .changed {
        background-color: greenyellow;
    }
    .updatebutton:hover {
        background-color: greenyellow;
        color:black;
    }
    .updatebutton {
        color:greenyellow;
    }

    .row {
        height:2px;
    }
    .editbutton, .toggleediton, .toggleeditoff {
        float:right;
        display: block;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        color:grey;
        padding: 4px;
        margin: 4px;
        border-radius: 5px;
        font-size: 12pt;
        font-weight: normal;
        border: 1px solid grey;
    }

    .toggleediton {
        background-color: red;
        color:black;
    }

    .editbutton input, .toggleediton input, .toggleeditoff input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    input[disabled] {
        color:white;
        opacity:1;
        -webkit-text-fill-color:#ffffff;
        background-color: transparent;
    }

</style>