<template>
<div>
  <div class="title">FelinePride</div>
  <form @submit.prevent="handleSubmit" id="loginForm">
    
    <div class="form-group">
      <div id="username"><div><label for="username">Username</label></div><input v-model="username" name="username"  class="form-control" :class="{ 'is-invalid': submitted && !username }" autofocus/>      <div v-show="submitted && !username" class="invalid-feedback">Username is required</div></div>

    </div>
    <div class="form-group">
      <div id="password">Password<BR/>
        <input type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
            <div v-show="submitted && !password" class="invalid-feedback">Password is required</div></div>

    </div>

    <div class="form-group" >
      <img id="loginbutton" src="../assets/catpawprint.png" @click="submitForm"/>
      <div id="logintext" class="btn btn-primary"  @click="submitForm">Login</div>
      <img v-show="status.loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
    </div>

    <button id="hiddenSubmit" style="display:none" class="btn btn-primary" :disabled="status.loggingIn">Login</button>

    <a href="/register"><img id="signupbutton" src="../assets/catpawprint.png"></img><div id="signuptext" class="btn btn-link">Sign Up</div></a>
    
  </form>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data () {
        return {
            username: '',
            password: '',
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    created () {
        // reset login status
        this.logout();
    },
    methods: {
      ...mapActions('account', ['login', 'logout']),
      submitForm(e) {
        document.getElementById('hiddenSubmit').click();
      },
      handleSubmit (e) {
        this.submitted = true;
        const { username, password } = this;
        if (username && password) {
          this.login({ username, password })
        }
      }
    }
};
</script>

<style>

BODY {
   background-image: url('../assets/sockycat.jpg');
   background-position: 0% 15%;
   text-shadow: 4px 2px 4px black;
   font-size:10pt;
   background-size: 150%;
}

HTML {
   font-family:Herculanum;
   color:white;
}

INPUT {
   font-family:Herculanum;
   font-size:15pt;
   opacity:.8;
   box-shadow: 8px 8px 8px white;
}

INPUT:focus {
   opacity:1.0;
}


A { color:white;}


.title {
   position: relative;
   top: 30;
   left: 50;
   text-shadow: 4px 2px 4px black;
   font-size:24pt;
}


#username {
   position: relative;
   top: 60;
   left: 50;
   font-size:12pt;
}

#password {
   position: relative;
   top: 90;
   left: 50;
   font-size:12pt;
}

#loginbutton {
   position: relative;
   top: 120;
   left: 170;
   width:100;
   height:100;
}

#logintext {
   position: relative;
   top: 95;
   left: 195;
   font-size:12pt
}


#signupbutton {
   position: relative;
   top: 80;
   left: 50;
   width: 100;
   height:100;
}

#signuptext {
   position: relative;
   top: 55;
   left: 70;
   font-size:12pt
}

</style>
