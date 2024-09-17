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

    // Fetch all countries
    async fetchCountries() {
      const response = await this.$axios.get('countries');
      this.setCountries(response.data.data);
      return response;
    },

    // Fetch a single country by its ID
    async fetchCountryById(id) {
      const response = await this.$axios.get(`countries/${id}`);
      this.setCountry(response.data.data);
      return response;
    },

    // Fetch countries based on continent ID
    async fetchCountriesByContinent(continentId) {
      const response = await this.$axios.get(`countries/${continentId}/list`);
      this.setCountries(response.data.data); 
      return response;
    },

    // Add a new country
    async addCountry(data) {
      const response = await this.$axios.post('countries', data);
      return response;
    },

    // Update a country by ID
    async updateCountry(id, data) {
      const response = await this.$axios.put(`countries/${id}`, data);
      return response;
    },

    // Deactivate a country
    async deactivateCountry(id) {
      const response = await this.$axios.put(`countries/${id}/deactivate`);
      return response;
    },

    // Activate a country
    async activateCountry(id) {
      const response = await this.$axios.put(`countries/${id}/activate`);
      return response;
    },
  },
});
