<template >
    <div>
        <div v-if="components.componentType">List of {{components.componentType.name}}</div>
        <div class="rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->
            <ul  v-if="components.items">
                <li class="componententry" v-for="component in components.items" :key="component.id">
                    <ul v-if="component">
                        <li class="componentfield" v-for="attribute in component.attributes" :key="attribute.name">
                            <span class="smalllabel">{{attribute.name}}</span><br/><input class="componentfieldinput" :name="attribute.name" :value="attribute.value"/>
                        </li>
                    </ul>
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
      scrollerHeight: 300
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
    ...mapActions('componentTypes', {

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
    h2 { padding-left: 10px;}

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
        background-color:whitesmoke;
        padding:10px;
        border-top:1px solid grey;
    }
    ul.picklist {
        padding:0px;
        margin:0px;
    }
    li.componententry {
        clear:both;
    }
    li.componentfield {
        float:left;
        padding:5px;
        list-style-type: none;
        color:white;
    }
    .smalllabel {
        margin:0px;
        font-size: 9px;
        padding-left:6px;
        padding-right:6px;
        background-color: darkgrey;
    }

    input.componentfieldinput {
        margin: 0px;
        margin-top: -1px;
        border: 0px;
        float:left;
        padding:5px;
        list-style-type: none;
        font-size:12pt;
        background-color:darkgrey;
        color:white;
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