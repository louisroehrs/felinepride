<template> 
    <div>
        <h1><router-link to="/admin">Admin</router-link> > Component Editor</h1>
        <div></div>
        <div class="leftside scrolling" ref="scroller" v-bind:style="{ height: this.scrollerHeight+'px'}">
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->
            <ul class="picklist" v-if="componentTypes.items">
                    <li v-for="componentType in componentTypes.items" :key="componentType.id">
                {{ componentType.name}}
                        <span v-if="componentType.deleting"><em> - Deleting...</em></span>
                        <span v-else-if="componentType.deleteError" class="text-danger"> - ERROR: {{componentType.deleteError}}</span>
                    <!--    <span v-else> - <a @click="deleteComponentType(componentType.id)" class="text-danger">Delete</a></span> -->
                        <div class="newbutton"><a @click="newComponent(componentType.id)" class="text-danger">+</a></div>
                    </li>
                </ul>

        </div>
        <div class="bottombox" ref="bottombox">+|-</div>
        <div class="editarea">stuff</div>

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
      componentTypes: state => state.componentTypes.all
    })
  },
  created () {
    this.picklistHeight = document.getElementsByClassName("scrolling")
    this.getAll();
  },
  mounted() {
      window.addEventListener('resize', this.resize);
      //Init
      this.resize()
  },

  methods: {
    ...mapActions('componentTypes', {
      getAll: 'getAll',
      deleteComponentType: 'delete'
    }),
    resize() {
      this.scrollerHeight = window.innerHeight - this.$refs.scroller.offsetTop - this.$refs.bottombox.offsetHeight;
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

    }
    h1 { padding: 10px;}

    div.scrolling {
        overflow: scroll;
        display: block;
        height: 200px;
    }

    div.leftside {
        border-top:1px solid grey;
        background: #eee;
        width:25%;
        float:left;
    }

    div.editarea {
        width:75%;
        padding:10px;
        border-top:1px solid grey;
    }
    ul.picklist {
        padding:0px;
        margin:0px;
    ;
    }
    li {
        padding:35px;
        border-bottom:1px solid grey;
        list-style-type: none;
        font-size:12pt;
    }

    div.bottombox {
        position:fixed;
        bottom:0px;
        height:25px;
        border-top:1px solid grey;
        font-size:12pt;
        width:25%;
    }

    div.newbutton {
        float:right;
        font-size:20pt;
        line-height:.5;
        font-weight:bold
    }

</style>