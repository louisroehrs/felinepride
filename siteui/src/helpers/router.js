import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../components/HomePage'
import AdminPage from '../components/AdminPage'
import LoginPage from '../components/LoginPage'
import RegisterPage from '../components/RegisterPage'
import AvatarPage from '../components/AvatarPage'
import TacPage from '../components/TacPage'
import WelcomePage from '../components/WelcomePage'
import ComponentPage from '../components/ComponentPage'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: WelcomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/avatar', component: AvatarPage },
    { path: '/tac', component: TacPage },
    { path: '/welcome', component: WelcomePage },
    { path: '/admin', component: AdminPage },
    { path: '/compeditor', component: ComponentPage },

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register','/avatar','/tac'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})
