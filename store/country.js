import { defineStore } from 'pinia';

export const useCountryStore = defineStore('country', {
   state: () => ({
      countries: [],
      country: {},
   }),

   actions: {
      setCountries(countries) {
         this.countries = countries;
      },
      setCountry(country) {
         this.country = country;
      },
      async fetchCountries() {
         const response = await this.$axios.get('countries');
         this.setCountries(response.data.data); 
         return response;
      },
      async fetchCountryById(id) {
         const response = await this.$axios.get(`countries/${id}`);
         this.setCountry(response.data.data);
         return response;
      },
      async addCountry(data) {
         const response = await this.$axios.post(`countries`, data);
         return response;
      },
      async updateCountry(id, data) {
         const response = await this.$axios.put(`countries/${id}`, data);
         return response;
      },
      async deactivateCountry(id) {
         const response = await this.$axios.put(`countries/${id}/deactivate`);
         return response;
      },
      async activateCountry(id) {
         const response = await this.$axios.put(`countries/${id}/activate`);
         return response;
      },
  },
});