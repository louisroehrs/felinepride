<template >
    <div>

        <h3 class="pagename" v-if="components.componentType"><span class="toggleedit">Edit <input  type="checkbox" v-model="toggleedit"/></span>List of {{components.componentType.name}}</h3>

        <div class="rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->
            <ul  v-if="components.items">
                <li class="componententry" v-for="component in components.items" :key="component.id">
                    <div v-if="component">
                        <div class="row" v-bind:class="{ deleting: component.deleting,updating: component.updating , changed: component.changed }"></div>
                        <ul>
                            <li class="editfield" >
                                <div class="smalllabel">name</div>
                                <input class="componentfieldinput"
                                       name="name"
                                       v-model="component.name"
                                       v-bind:disabled="!toggleedit"
                                       @input="component.changed=true"
                                />
                            </li>
                        </ul>
                        <ul>
                            <li class="editfield" v-for="attribute in component.attributes" :key="attribute.name">
                                <div class="smalllabel">{{attribute.name}}</div>
                                <input class="componentfieldinput"
                                       :name="attribute.name"
                                       v-model="attribute.value"
                                       v-bind:disabled="!toggleedit"
                                       @input="component.changed=true"
                                />
                            </li>
                        </ul>
                        <ul v-if="toggleedit">
                            <li class="buttonfield" >
                                <div @click="deleteComponent(component)" class="deletebutton">X</div>
                            </li>
                            <li class="buttonfield" >
                                <div @click="updateComponent({component:component,componentType:components.componentType})" class="updatebutton">O</div>
                            </li>
                        </ul>
                    </div>
                </li>

            </ul>
        </div>
    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {

  props: ['components'],

  data() {
    return {
      scrollerHeight: 300,
      toggleedit:false
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
    ...mapActions('componentTypes', ['deleteComponent','updateComponent']),
    resize() {
      this.scrollerHeight = window.innerHeight - this.$refs.scrollermain.offsetTop-10 ;
    }

  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  }
};
</script>
<style>
    body, html, div, ul , li {margin:0;padding:0;
        font: 12px "IBM Plex Sans";
        box-sizing: border-box;
        background-image: none;
    }

    h2 { padding-left: 10px;}

    div.scrolling {
        height: 200px;
        white-space: nowrap;
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
        color:white;
    }
    .updatebutton {
        color:greenyellow;
    }

    .row {
        height:2px;
    }
    .toggleedit {
        float:right;
    }
    input[disabled] {
        color:white;
        opacity:1;
        -webkit-text-fill-color:#ffffff;
        background-color: transparent;
    }

</style>