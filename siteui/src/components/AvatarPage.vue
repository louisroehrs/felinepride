<template>
    <div>
      <h2>Create an avatar</h2>
      <h3>Step 2</h3>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="firstName">Make a Username</label>
                <input type="text" v-model="user.username" v-validate="'required'" name="username" class="form-control" :class="{ 'is-invalid': submitted && errors.has('username') }" />
                <div v-if="submitted && errors.has('username')" class="invalid-feedback">{{ errors.first('username') }}</div>
            </div>
            <div class="form-group">
                <label htmlFor="password">Make a Password</label>
                <input type="password" v-model="user.password" v-validate="{ required: true, min: 6 }" name="password" class="form-control" :class="{ 'is-invalid': submitted && errors.has('password') }" />
                <div v-if="submitted && errors.has('password')" class="invalid-feedback">{{ errors.first('password') }}</div>
            </div>
            <div class="form-group">
                <label for="lastName">Enter your email address</label>
                <input type="text" v-model="user.emailAddress" v-validate="'required'" name="emailAddress" class="form-control" :class="{ 'is-invalid': submitted && errors.has('emailAddress') }" />
                <div v-if="submitted && errors.has('emailAddress')" class="invalid-feedback">{{ errors.first('emailAddress') }}</div>
            </div>

            <a href="/tac"><img id="signupbutton" src="../assets/catpawprint.png"></img>
<div id="signuptext" class="btn btn-link">Next Step</div></a>

            <div class="form-group">
                <button class="btn btn-primary" :disabled="status.registering">Register</button>
                <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                <router-link to="/login" class="btn btn-link">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data () {
        return {
            user: {
                firstName: '',
                lastName: '',
                username: '',
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

<style lang="css">

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
