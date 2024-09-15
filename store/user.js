import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    clients: [],
    admins: [],
    client: {},
    admin: {},
    roles : []
  }),

  actions: {
    async fetchRoleOptions() {
      const response = await this.$axios.get('roles');
      this.roles = response.data.data;
      return response;
    },
    setClients(clients) {
      this.clients = clients;
    },
    setClient(client) {
      this.client = client;
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
    async fetchClients() {
      const response = await this.$axios.get('clients');
      this.setClients(response.data.data); 
      return response;
    },
    async fetchUserById(api, id) {
      const response = await this.$axios.get(`${api}/${id}`);
      if (api === "clients") {
        this.setClient(response.data.data);
      } else if (api === "admins") {
        this.setAdmin(response.data.data);
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
      return response;
    },
    async activateUser(api, id) {
      const response = await this.$axios.put(`${api}/${id}/activate`);
      return response;
    },
  },

});