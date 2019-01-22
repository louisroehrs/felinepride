<template> 
    <div>
         <div class="leftside scrolling" ref="scroller" v-bind:style="{ height: this.scrollerHeight+'px'}">
        <em v-if="things.loading">Loading...</em>
        <span v-if="things.error" class="text-danger">ERROR: {{things.error}}</span>
            <ul class="picklist" v-if="things">
                    <li class="element" v-for="listitem in things.items" :key="listitem.id">
                {{ listitem.name}}
                        <span v-if="listitem.deleting"><em> - Deleting...</em></span>
                        <span v-else-if="listitem.deleteError" class="text-danger"> - ERROR: {{listitem.deleteError}}</span>
                    </li>
                </ul>
        </div>
        <div class="bottombar" ref="bottombox"><div class="bottombutton">+</div><div class="bottombutton">-</div></div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'


export default {

  props: [ "things"],
  data() {
    return {
      scrollerHeight: 300,
    }
  },

  computed: {
    ...mapState({
//      componentTypes: state => state.componentTypes.all
//      editingComponentType : state => state.componentTypes.editingComponentType
    })
  },

  created () {
    this.getAll();
  },

  mounted() {
      window.addEventListener('resize', this.resize);
      //Init
      this.resize()
  },

  methods: {
//        ...mapActions('componentTypes', {
      getAll: 'getAll',
//      deleteComponentType: 'delete',
//      newComponent: 'newComponent'
//    }),
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
        margin-left:25%;
        padding:10px;
        border-top:1px solid grey;
    }
    ul.picklist {
        padding:0px;
        margin:0px;
    ;
    }

    li.element {
        padding:25px;
        border-bottom:1px solid grey;
        list-style-type: none;
        font-size:12pt;
    }

    div.bottombar {
        position:fixed;
        bottom:0px;
        height:30px;
        border-top:1px solid grey;
        font-size:20pt;
        line-height:.75;
        font-weight:bold;
        width:25%;
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

    div.newbutton {
        float:right;
        font-size:20pt;
        line-height:.5;
        font-weight:bold
    }

    .fpbutton {
        padding:7px;
        background-color: #ff33f1;
        border-radius:5px;
        font-size:16px;
    }
</style>