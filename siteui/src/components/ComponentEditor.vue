<template >
    <div>
        <h3>New {{ componentType.name}}</h3>
        <div class="editor rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->
            <ul class="componentfield" v-if="componentType.attributes">
                <li class="editfield" v-for="attribute in componentType.attributes" :key="attribute.name">
                    <div class="editfieldlabel">{{ attribute.name}}</div>
                    <input :name="attribute.name"/>
                </li>
            </ul>
            <div class="savebutton">Save</div>
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
    h1 { padding: 10px;}

    div.scrolling {
        overflow: scroll;
        display: block;
    }

    div.editfieldlabel {
        float:left;
        text-align:right;
        margin-right:5px;
        min-width:50px;
        font-size: 16px;
    }
    li.editfield {
        padding:10px;
        list-style-type: none;
        font-size:12pt;
    }

    div.editor {
        border-bottom:1px solid grey;
    }

    div.savebutton {
        float:left;
        padding:5px;
        margin-left:10px;
        border-radius: 5px;
        font-size:12pt;
        background-color: magenta;
        border-right:1px;
    }


</style>