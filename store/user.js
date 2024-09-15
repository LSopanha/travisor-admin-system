import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    admins: [],
    user: {},
    admin: {},
    instructor: {},
    roles : []
  }),

  actions: {
    async fetchRoleOptions() {
      const response = await this.$axios.get('roles');
      this.roles = response.data.data;
      return response;
    },
    setUsers(users) {
      this.users = users;
    },
    setUser(user) {
      this.user = user;
    },
    setAdmins(admins) {
      this.admins = admins;
    },
    setAdmin(admin) {
      this.admin = admin;
    },
    async fetchAdmins() {
      const response = await this.$axios.get('admins');
      this.setAdmins(response.data.data); 
      return response;
    },
    async fetchUsers() {
      const response = await this.$axios.get('users');
      this.setUsers(response.data.data); 
      return response;
    },
    async fetchUserById(api, id) {
      const response = await this.$axios.get(`${api}/${id}`);
      if (api === "users") {
        this.setUser(response.data.data);
      } else if (api === "instructors") {
        this.setInstructor(response.data.data);
      }
      return response;
    },
    async addUser(api, data) {
      const response = await this.$axios.post(`${api}`, data);
      return response;
    },
    async updateUser(api, id, data) {
      const response = await this.$axios.put(`${api}/${id}`, data);
      return response;
    },
    async deactivateUser(api, id) {
      const response = await this.$axios.put(`${api}/${id}/deactivate`);
      const index = this.users.findIndex(user => user.global_id === id);
      if (index !== -1) {
        this.users[index].active = 0;
      }
      return response;
    },
    async activateUser(api, id) {
      const response = await this.$axios.put(`${api}/${id}/activate`);
      const index = this.users.findIndex(user => user.global_id === id);
      if (index !== -1) {
        this.users[index].active = 1;
      }
      return response;
    },
    async banUser(api, id) {
      const response = await this.$axios.put(`${api}/${id}/ban`);
      const index = this.users.findIndex(user => user.global_id === id);
      if (index !== -1) {
        this.users[index].ban = 1;
        this.users[index].active = 0;
      }
      return response;
    },
    async authorizeUser(api, id) {
      const response = await this.$axios.put(`${api}/${id}/authorize`);
      const index = this.users.findIndex(user => user.global_id === id);
      if (index !== -1) {
        this.users[index].ban = 0;
        this.users[index].active = 1;
      }
      return response;
    },
  },

  getters: {

  }
});