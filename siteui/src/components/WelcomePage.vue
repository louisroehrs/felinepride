<template> 
    <div>
        <h1>Welcome {{account.user.firstName}}!</h1>
        <p>You're on the Welcome page</p>
        <router-link to="/login">Logout</router-link>
        Hey          Hey  {{account.user.firstName}}
        <div v-if="account.user.isAdmin">

          <router-link to="/admin">Admin Page</router-link>   
        </div>
        Hey
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  created () {
    this.getAll();
  },
  methods: {
    ...mapActions('users', {
      getAll: 'getAll',
      deleteUser: 'delete'
    })
  }
};
</script>
