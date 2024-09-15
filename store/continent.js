import { defineStore } from 'pinia';

export const useContinentStore = defineStore('continent', {
   state: () => ({
      continents: [],
      continent: {},
   }),

   actions: {
      setContinents(continents) {
         this.continents = continents;
      },
      setContinent(continent) {
         this.continent = continent;
      },
      async fetchContinents() {
         const response = await this.$axios.get('continents');
         this.setContinents(response.data.data); 
         return response;
      },
      async fetchContinentById(id) {
         const response = await this.$axios.get(`continents/${id}`);
         this.setContinent(response.data.data);
         return response;
      },
      async addContinent(data) {
         const response = await this.$axios.post(`continents`, data);
         return response;
      },
      async updateContinent(id, data) {
         const response = await this.$axios.put(`continents/${id}`, data);
         return response;
      },
      async deactivateContinent(id) {
         const response = await this.$axios.put(`continents/${id}/deactivate`);
         return response;
      },
      async activateContinent(id) {
         const response = await this.$axios.put(`continents/${id}/activate`);
         return response;
      },
  },
});