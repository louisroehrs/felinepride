<template >
    <div>
        <h3 class="pagename" v-if="components.componentType">List of {{components.componentType.name}}</h3>
        <div class="rightside scrolling" ref="scrollermain" v-bind:style="{ height: this.scrollerHeight+'px'}">
<!--        <em v-if="componentTypes.loading">Loading componentTypes...</em>
        <span v-if="componentTypes.error" class="text-danger">ERROR: {{componentTypes.error}}</span>-->
            <ul  v-if="components.items">
                <!--
                <li class="componententry" v-for="component in components.items" :key="component.id">
                    <ul v-if="component">
                        <li class="componentfield"  >
                            <span class="smalllabel">name</span><br/><input class="componentfieldinput" name="name" :value="component.name"/>
                        </li>
                        <li class="componentfield" v-for="attribute in component.attributes" :key="attribute.name">
                        <span class="smalllabel">{{attribute.name}}</span><br/><input class="componentfieldinput" :name="attribute.name" :value="attribute.value"/>
                        </li>
                    </ul>
                </li> -->
                <li class="componententry" v-for="component in components.items" :key="component.id" >
                    <div v-if="component">
                        <ul>
                            <li class="editfield" >
                                <div class="smalllabel">name</div>
                                <input class="componentfieldinput" name="name" :value="component.name"/>
                            </li>
                        </ul>
                        <ul>
                            <li class="editfield" v-for="attribute in component.attributes" :key="attribute.name">
                                <div class="smalllabel">{{attribute.name}}</div>
                                <input class="componentfieldinput" :name="attribute.name" :value="attribute.value"/>
                            </li>
                        </ul>
                        <ul>
                            <li class="buttonfield" >
                                <div class="deletebutton">X</div>
                            </li>
                            <li class="buttonfield" >
                                <div class="savebutton">O</div>
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
        background-color:black;
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
        padding: 5px;
        color: white;
        list-style-type: none;
    }

    .deletebutton,.savebutton {
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

    .savebutton:hover {
        background-color: greenyellow;
        color:white;
    }
    .savebutton {
        color:greenyellow;
    }

</style>