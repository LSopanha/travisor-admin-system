import { defineStore } from 'pinia';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('admin', {
  state: () => ({
    admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null,
    token: Cookies.get('token') || null,
    redirectRoute: null,
  }),

  actions: {
    setAdmin(admin) {
      this.admin = admin;
      localStorage.setItem('admin', JSON.stringify(admin));
    },

    setToken(token) {
      this.token = token;
      Cookies.set('token', token);
    },

    setRedirectRoute(route) {
      console.log('Setting redirect route:', route);
      this.redirectRoute = route;
    },

    clearRedirectRoute() {
      console.log('Clearing redirect route');
      this.redirectRoute = null;
    },

    clearAdminSession() {
      this.setAdmin(null);
      this.setToken(null);
      Cookies.remove('token');
      localStorage.removeItem('admin');
    },

    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:8000/api/admin/login', { email, password });
              
        if (response.status === 200 && response.data.access_token) {
          const accessToken = response.data.access_token;
      
          if (!accessToken) {
            throw new Error('No token found');
          }
          else { // refresh the 5 minutes expired token
            const refreshToken = await this.$axios.post('token-refresh', {}, {
              headers: {Authorization: `Bearer ${accessToken}`}
            });
            
            if (refreshToken.status === 200 && refreshToken.data.refresh_token) {
              this.setAdmin(response.data.data.user);
              this.setToken(refreshToken.data.refresh_token);
            }
          }
        } else {
          throw new Error('Invalid credentials');
        }
      } 
      catch (error) {  
        throw error;
      }
    },

    async fetchAdmin() {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await this.$axios.post('user-information');

        if (response.status === 401 && response.data.message === "Unauthenticated.") {
          this.logout();
          this.isAuthenticated = false;
          return false; 
        } 
        else {
          this.setAdmin(response.data);
          return true; 
        }
      } 
      catch (error) {
        if (error.response) {
          console.log('Error: ' + error.response.data.message); // Token expired
        }
        else {
          console.log('Error: ' + error.message);
        }
        this.logout();
        return false; 
      }
    },

    async logout() {
      const token = Cookies.get('token');
      if (!token) {
        console.log('Logged out without token!');
      } 
      else {
        try {
          const response = await this.$axios.post('logout');
  
          if (response.status === 200) {
            console.log(response.data.message); 
            this.clearAdminSession();
            return true;
          }
        }
        catch (error) {
          console.log('Error: ' + error.message);
        }
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token, // check if there is token 
    getRedirectRoute: (state) => state.redirectRoute,
  }
});