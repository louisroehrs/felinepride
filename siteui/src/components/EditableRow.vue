<template>
    <form id="componentForm" @submit.prevent="handleSubmit">
        <div class="row" v-bind:class="{ deleting: component.deleting,updating: component.updating , changed: component.changed }"></div>
        <ul>
            <li class="editfield">
                <div class="editfieldlabel">name</div>
                <input class="newfieldinput"
                       v-model="component.name"
                       autocomplete="off"
                       @input="component.changed=true"
                />
            </li>
        </ul>
        <ul class="componentfield" v-if="componentType.attributes">
            <li class="editfield" v-for="(attribute,key) in componentType.attributes" :key="attribute.name">
                <div class="editfieldlabel">{{ attribute.name }}</div>
                <input v-if="attribute.editor == 'string'"
                       class="newfieldinput"
                       v-model="component.attributes[attribute.name]"
                       autocomplete="off"
                       @input="component.changed=true"
                />
                <input v-if="attribute.editor == 'color'" class="newcolorfieldinput"
                       v-model="component.attributes[attribute.name]"
                       autocomplete="off"
                       @input="component.changed=true"
                />
                <span v-if="attribute.editor == 'color'"
                      class="colorswatch"
                      v-bind:style="{backgroundColor: component.attributes[attribute.name]}">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                <select v-if="attribute.editor == 'dropdown'" class="newfieldselect"
                        v-model="component.attributes[attribute.name]"
                        autocomplete="off"
                        @change="component.changed=true"
                >
                    <option v-for="(member, key, index) in componentType.sets.filter(set => set.setName == attribute.setName)[0].members" :value="member.name">
                        {{member.name}}
                    </option>
                </select>
                <input v-if="attribute.editor == 'price'" class="newfieldinput"
                       v-model="component.attributes[attribute.name]"
                       autocomplete="off"
                       @input="component.changed=true"
                />
                <div :class="'switch' + ((component.attributes[attribute.name] == 'true')? 'on' : '')"
                     v-if="attribute.editor == 'switch'"
                     v-model="component.attributes[attribute.name]"
                     @input="component.changed=true"
                ><div :class="'switchthumb' + ((component.attributes[attribute.name] == 'true')? 'on' : '')" ></div></div>
            </li>
        </ul>


        <div  v-if="toggleedit" @click="deleteComponent(component)" class="deletebutton">delete</div>
        <div v-if="component.changed && !blankform"
             @click="updateComponent({component:component, componentType:componentType})"
             class="submitbutton">Save
        </div>
        <div v-if="blankform" class="submitbutton" @click="saveComponent">Save</div>
        <div v-if="blankform" class="closebutton" @click="closeMyEditor">Cancel</div>
    </form>
</template>
<script>

  export default {
    name: 'EditableRow',
    props: {
      component: { name:"",attributes:{}},
      componentType: {},
      saveComponent: {},
      updateComponent: {},
      deleteComponent: {},
      closeEditor:{},
      blankform: true,
      toggleedit: false
    },
    methods: {
      closeMyEditor () {
        this.closeEditor();
      }
    }
  }
</script>
<style>

    h3 {
        margin-left: 5px;
        margin-top: 0px;
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

    .editfieldlabel {
        float: left;
        margin-top: 6px;
        margin-bottom: 3px;
        margin-right: 5px;
        min-width: 50px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.50);
    }

    .editfield {
        margin: 0px;
        border: 0px;
        float: left;
        padding: 5px;
        font-size: 12pt;
        background-color: black;
        color: white;
        list-style-type: none;
    }

    .newfieldinput, .newcolorfieldinput {
        background-color: #111;
        color: white;
        font-size: 12pt;
        margin-top: 3px;
    }

    .newcolorfieldinput {
        width: 100px;
    }

    .newfieldselect {
        background-color: #111;
        color: white;
        padding-top: 6px;
        padding-left: 2px;
        border: 0px;
        font-size: 12pt;
        -webkit-appearance: none;
    }

    .submitbutton, .closebutton,.deletebutton {
        float: left;
        padding: 4px;
        margin: 4px;
        border-radius: 5px;
        font-size: 12pt;
        color: greenyellow;
        border: 1px solid grey;
    }

    .deletebutton {
        color:red;
        border-color:red;
    }

    .closebutton {
        color: grey;
    }
    .closebutton:hover {
        color: white;
    }

    .submitbutton:hover {
        background-color: greenyellow;
        color: black;
    }

    .colorswatch {
        font-size: 12pt;
        width: 20px;
        height: 20px;
    }

    .switch,.switchon {
        height: 20px;
        background-color:#333;
        width: 35px;
        display: block;
        float: right;
        margin-top: 6px;
        border-radius: 14px;
    }
    .switchthumb,.switchthumbon {
        height: 20px;
        background-color: gray;
        width: 20px;
        display: block;
        float: right;
        /* margin-top: 6px; */
        border-radius: 14px;
        border:1px solid gray;
    }

    .switchon {
        background-color: greenyellow;
        border:1px inset gray;
    }

    .switchthumbon {
        float:left;

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