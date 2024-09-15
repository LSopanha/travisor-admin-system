<template>
  <div v-if="country && Object.keys(country).length > 0">
    <country-form
      :title="`Edit Country`"
      :existingData="country"
      :editMode="true"
    />
  </div>
</template>

<script>
import CountryForm from "~/components/CountryForm.vue";
import { useCountryStore } from "~/store/country";
import { mapState } from "pinia";

export default {
  name: "EditCountryPage",
  components: {
    CountryForm,
  },
  data() {
    return { countryStore: useCountryStore() };
  },
  computed: {
    ...mapState(useCountryStore, {
      country: "country",
    }),
  },
  mounted() {
    const countryId = this.$route.query.countryId;
    this.getCountryAndContinents(countryId); // Fetch both country and continents
  },
  methods: {
    // Fetch country and continent options together
    async getCountryAndContinents(countryId) {
      try {
        await this.countryStore.fetchCountryById(countryId);
        await this.countryStore.fetchContinents(); // Ensure continents are fetched
      } catch (error) {
        console.error(`Error fetching country or continent data:`, error);
      }
    },
  },
};
</script>
