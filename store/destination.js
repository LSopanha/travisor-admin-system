import { defineStore } from 'pinia';

export const useDestinationStore = defineStore('destination', {
   state: () => ({
      destinations: [],
      destination: {},
   }),

   actions: {
      setDestinations(destinations) {
         this.destinations = destinations;
      },
      setDestination(destination) {
         this.destination = destination;
      },
      async fetchDestinations() {
         const response = await this.$axios.get('destinations');
         this.setDestinations(response.data.data); 
         return response;
      },
      async fetchDestinationById(id) {
         const response = await this.$axios.get(`destinations/${id}`);
         this.setDestination(response.data.data);
         return response;
      },
      async addDestination(data) {
         const response = await this.$axios.post(`destinations`, data);
         return response;
      },
      async updateDestination(id, data) {
         const response = await this.$axios.put(`destinations/${id}`, data);
         return response;
      },
      async deactivateDestination(id) {
         const response = await this.$axios.put(`destinations/${id}/deactivate`);
         return response;
      },
      async activateDestination(id) {
         const response = await this.$axios.put(`destinations/${id}/activate`);
         return response;
      },
  },
});