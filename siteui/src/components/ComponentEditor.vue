<template >
    <div>
        <h1><router-link to="/admin">Admin</router-link> > Component Editor > {{ componentType.name}}</h1>
        <div>{{ componentType.name}}</div>
        <div class="rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->
            <ul class="componentfield" v-if="componentType.attributes">
                    <li v-for="attribute in componentType.attributes" :key="attribute.name">
                        <label>{{ attribute.name}}</label>
                        <input :name="attribute.name"/>
                    </li>
                </ul>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {

  props: ['componentType'],

  data() {
    return {
      scrollerHeight: 300
    }
  },
  computed: {
    ...mapState({
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
    ...mapActions('componentTypes', {
      getAll: 'getAll',
      deleteComponentType: 'delete',
      newComponent: 'newComponent'
    }),
    resize() {
      //this.scrollerHeight = window.innerHeight - this.$refs.scrollermain.offsetTop ;
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
        margin-left:25%;
        background-color:blue;
        padding:10px;
        border-top:1px solid grey;
    }
    ul.picklist {
        padding:0px;
        margin:0px;
    ;
    }

    li {
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

</style>