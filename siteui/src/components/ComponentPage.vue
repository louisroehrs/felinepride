<template> 
    <div>
        <h2><router-link to="/admin">Admin</router-link> | Entity Editor | <router-link to="/comptypeeditor">Entity Definition Editor</router-link></h2>
        <div></div>
        <div class="leftside scrolling" ref="scroller" v-bind:style="{ height: this.scrollerHeight+'px'}">
            <em v-if="componentTypes.loading">Loading componentTypes...</em>
            <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>
            <ul class="picklist" v-if="componentTypes.items">
                    <li class="componentType" v-for="componentType in componentTypes.items" :key="componentType.id">
                        <a @click="listComponents(componentType)">{{ componentType.name}}</a>
                        <span v-if="componentType.deleting"><em> - Deleting...</em></span>
                        <span v-else-if="componentType.deleteError" class="text-danger"> - ERROR: {{componentType.deleteError}}</span>
                    </li>
                </ul>

        </div>
        <div class="bottombar" ref="bottombox"><div class="bottombutton">+</div><div class="bottombutton">-</div></div>
        <div class="editarea">
            <ComponentList v-if="components" v-bind:components="components" ></ComponentList>
        </div>

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      scrollerHeight: 300
    }
  },
  computed: {
    ...mapState({
      componentTypes: state => state.componentTypes.types,
      components: state => state.componentTypes.components,
      editingComponentType : state => state.componentTypes.editingComponentType
    })
  },
  created () {
    this.getAllComponentTypes();
  },

  mounted() {
      window.addEventListener('resize', this.resize);
      //Init
      this.resize()
  },


  methods: {
    ...mapActions('componentTypes', {
      getAllComponentTypes: 'getAllComponentTypes',
      listComponents: 'listComponents',
      closeEditor: 'closeEditor'
    }),
    resize() {
      this.scrollerHeight = window.innerHeight - this.$refs.scroller.offsetTop - this.$refs.bottombox.offsetHeight;
    }

  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  }
}
</script>
<style>
    body, html, div, ul , li {margin:0;padding:0;
        font: 12px plex-sans-regular;
        box-sizing: border-box;
        text-shadow: none;
        color:black;
        background-image: none;
    }
    input {
        box-shadow: none;
    }

    a {
        color: black;
    }
    h2 { padding-left: 10px;}


    div.leftside {
        border-top:1px solid grey;
        background-color: blue-grey;
        width:15%;
        float:left;
    }


    ul.picklist {
        padding:0px;
        margin:0px;
    }

    li.componentType {
        padding:15px;
        border-bottom:1px solid #8b8b8b;
        list-style-type: none;
        font-size:12pt;
    }

    div.bottombar {
        position:fixed;
        bottom:0px;
        height:30px;
        border-top:1px solid #454545;
        font-size:20pt;
        line-height:.75;
        font-weight:bold;
        width:15%;
        padding-left:10px;
        background: #f8f8f8;
    }

    div.bottombutton {
        float:left;
        width: 25px;
        font-size:20pt;
        line-height:.75;
        font-weight:bold;
        border-right:1px;
    }

    div.editarea {
        width:85%;
        margin-left:15%;
        background-color:rgb(31, 36, 42);
        padding:10px;
        border-top:1px solid grey;

    }

    div.newbutton {
        float:right;
        font-size:20pt;
        line-height:.5;
        font-weight:bold
    }

</style>
