<template>
<div>
  <div class="title">Register to Feline Pride</div>
  <form @submit.prevent="handleSubmit">
    
    <div class="form-group">
      <div id="userName">
        <div><label for="userName">Make a Username</label></div>
        <input type="text" v-model="user.userName" v-validate="'required'" name="userName" class="form-control" :class="{ 'is-invalid': submitted && errors.has('userName') }" />
        <div v-if="submitted && errors.has('userName')" class="invalid-feedback">{{ errors.first('userName') }}</div>
      </div>
    </div>
    <div class="form-group">
      <div id="password">
        <div><label htmlFor="password">Make a Password</label></div>
        <input type="password" v-model="user.password" v-validate="{ required: true, min: 6 }" name="password" class="form-control" :class="{ 'is-invalid': submitted && errors.has('password') }" />
        <div v-if="submitted && errors.has('password')" class="invalid-feedback">{{ errors.first('password') }}</div>
      </div>
    </div>
    
    <div class="form-group">
      <div id="email">
        <div><label for="email">Enter your email address</label></div>
        <input type="text" v-model="user.email" v-validate="'required'" name="email" class="form-control" :class="{ 'is-invalid': submitted && errors.has('email') }" />
        <div v-if="submitted && errors.has('email')" class="invalid-feedback">{{ errors.first('email') }}</div>
      </div>
    </div>

      <div class="form-group">
        <img id="signupbutton" src="../assets/catpawprint.png" @click="submitForm"></img>
        <div id="signuptext" class="btn btn-link" @click="submitForm">Next Step</div></a>
    
        <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
      </div>

    <button id="hiddenSubmit" style="display:none" class="btn btn-primary" :disabled="status.registering">register</button>

  </form>
  <router-link id="cancelRegister" to="/login" class="btn btn-link">Cancel</router-link>

</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      user: {
        email: '',
        userName: '',
        password: ''
      },
      submitted: false
    }
  },
  computed: {
    ...mapState('account', ['status'])
  },
  methods: {
    ...mapActions('account', ['register']),
    submitForm(e) {
      document.getElementById('hiddenSubmit').click();
    },
    handleSubmit(e) {
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          this.register(this.user);
        }
      });
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


#userName {
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

#email {
   position: relative;
   top: 120;
   left: 50;
   font-size:12pt;
}

#signupbutton {
   position: relative;
   top: 160;
   left: 50;
   width: 120;
   height:120;
}

#signuptext {
   position: relative;
   top: 135;
   left: 70;
   font-size:12pt
}


#cancelRegister {
   position: relative;
   top: 170;
   left: 50;
   width: 120;
   height:120;
   font-size:12pt;
}

</style>
