<template >
    <div>

        <div class="close" @click="closeEditor()">X</div>
        <h3 class="pagename" >New {{ componentType.name}} {{ component.name}}</h3>
        <div class="rightside scrolling editor" ref="scrollermain" >
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->

            <form id="componentForm" @submit.prevent="handleSubmit">
                <ul>
                    <li  class="editfield">
                        <div class="editfieldlabel">name</div>
                        <input class="newfieldinput"
                               v-model="component.name"
                               autocomplete="off" />
                    </li>
                </ul>
                <ul class="componentfield" v-if="componentType.attributes">
                    <li class="editfield" v-for="(attribute,key) in componentType.attributes" :key="attribute.name">
                        <div class="editfieldlabel">{{ attribute.name }}</div>
                        <input v-if="attribute.editor == 'string'" class="newfieldinput"
                               v-model="component.attributes[attribute.name]"
                               autocomplete="off" />
                        <input v-if="attribute.editor == 'color'" class="newcolorfieldinput"
                                      v-model="component.attributes[attribute.name]"
                                      autocomplete="off" />
                        <span v-if="attribute.editor == 'color'"
                              class="colorswatch"
                              v-bind:style="{backgroundColor: component.attributes[attribute.name]}">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                        <select v-if="attribute.editor == 'dropdown'" class="newfieldselect"
                             v-model="component.attributes[attribute.name]"
                             autocomplete="off" ><option v-for="(member, key, index) in componentType.sets[0].members" :value="member.name">{{member.name}}</option></select>
                        <input v-if="attribute.editor == 'price'" class="newfieldinput"
                             v-model="component.attributes[attribute.name]"
                             autocomplete="off"/>
                    </li>
                </ul>
                <div class="submitbutton"  @click="saveComponent(component,componentType)">Save</div>
            </form>

        </div>
    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import ColorPicker from 'vue-color'
// v-model="component.attributes[attribute.name]"
export default {

  props: ['componentType'],
  components: {
    ColorPicker: VueColor.Chrome
  },

    data() {
    return {
      scrollerHeight: 300,
      component: { name:"",attributes:{}},
      colors: "#ff0000"
    }
  },
  computed: {
    ...mapState({
    })
  },

  mounted() {
      //window.addEventListener('resize', this.resize);
      //Init
      //this.resize()
  },

  methods: {
    ...mapActions('componentTypes', ['storeComponent','closeEditor'])
    ,

    saveComponent(component,componentType) {
      var newComponentRequestInput = {};
      newComponentRequestInput.name = this.component.name;
      newComponentRequestInput.type = "component";
      newComponentRequestInput.componentType = componentType.name;
      newComponentRequestInput.attributes = [];

      for (var attribute in componentType.attributes) {
        var newAttribute = {};
        newAttribute.name = componentType.attributes[attribute].name;
        newAttribute.value = this.component.attributes[newAttribute.name];
        newComponentRequestInput.attributes.push(newAttribute);
      }
      this.storeComponent( newComponentRequestInput);

    },
    resize() {
      //this.scrollerHeight = window.innerHeight - this.$refs.scrollermain.offsetTop ;
    },

  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  }
};
</script>
<style>

    h3 {
        margin-left: 5px;
        margin-top:0px;
    }

    .editor {
        height: auto !important;
        padding-bottom: 10px;
        max-height: 300px;
        border-bottom:1px solid grey;
    }

    .editfieldlabel {
        float:left;
        margin-top:6px;
        margin-bottom:3px;
        margin-right:5px;
        min-width:50px;
        font-size: 16px;
        color:rgba(255,255,255,0.50);
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
        color:white;
        font-size:12pt;
        margin-top:3px;
    }
    .newcolorfieldinput {
        width:100px;
    }

    .newfieldselect {
        background-color: #111;
        color:white;
        padding-top: 6px;
        padding-left: 2px;
        border:0px;
        font-size:12pt;
        -webkit-appearance: none;
    }

    .submitbutton {
        float:left;
        padding:5px;
        margin:4px;
        border-radius: 5px;
        font-size:12pt;
        color:greenyellow;
        border:1px solid grey;
    }

    .submitbutton:hover {
        background-color: greenyellow;
        color:black;
    }

    .pagename {
        color:#eee;
    }

    .colorswatch {
        font-size:12pt;
        width:20px;
        height:20px;
    }

    .close, close:hover {
        border: 1px solid transparent;
        border-radius: 5px;
        padding:5px;
        float:right;
        color:white;
        font-size:16px;
    }
    .close:hover {
        border-color:grey;
    }

</style>