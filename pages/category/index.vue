<template>
  <v-container>
    <v-col cols="12" class="pa-0">
      <h2 class="secondary--text text-decoration-underline my-3">
        Category Management
      </h2>
      <v-chip-group
        mandatory
        active-class="primary--text"
        v-model="selectedTab"
      >
        <v-chip
          class="justify-center"
          style="width: 125px"
          outlined
          value="continent"
        >
          <v-icon class="mr-1">mdi-earth</v-icon> Continent
        </v-chip>
        <v-chip
          class="justify-center"
          style="width: 125px"
          outlined
          value="country"
        >
          <v-icon class="mr-1">mdi-earth-box </v-icon> Country
        </v-chip>
      </v-chip-group>
    </v-col>

    <travisor-data-table
      v-if="selectedTab === 'continent' && continents.length"
      :title="'Continent'"
      :items="continentsWithIds"
      :headers="continentHeaders"
      :isLoading="isLoading"
      @add-click="handleContinentAddClick"
      @view-click="handleContinentViewClick"
      @edit-click="handleContinentEditClick"
      @deactivate-click="handleContinentDeactivateClick"
      @activate-click="handleContinentActivateClick"
    ></travisor-data-table>

    <travisor-data-table
      v-if="selectedTab === 'country' && countries.length"
      :title="'Country'"
      :items="countriesWithIds"
      :headers="countryHeaders"
      :isLoading="isLoading"
      @add-click="handleCountryAddClick"
      @view-click="handleCountryViewClick"
      @edit-click="handleCountryEditClick"
      @deactivate-click="handleCountryDeactivateClick"
      @activate-click="handleCountryActivateClick"
    ></travisor-data-table>
  </v-container>
</template>

<script>
import { useContinentStore } from "~/store/continent";
import { useCountryStore } from "~/store/country";

export default {
  name: "CategoryPage",
  data() {
    return {
      selectedTab: "continent",
      continentHeaders: [
        { text: "ID", value: "id" },
        { text: "Continent Name", value: "continent_name" },
        //   { text: "Description", value: "description" },
        { text: "Number of Countries", value: "country_count" },
        { text: "Profile Picture", value: "profile_picture" },
        { text: "Status", value: "active" },
      ],
      countryHeaders: [
        { text: "ID", value: "id" },
        { text: "Country Name", value: "country_name" },
        //   { text: "Description", value: "description" },
        { text: "Continent Name", value: "continent.continent_name" },
        { text: "Profile Picture", value: "profile_picture" },
        { text: "Status", value: "active" },
      ],
      isLoading: true,
    };
  },

  created() {
    this.selectedTab = this.$route.query.tab || "continent";
  },

  watch: {
    selectedTab(newTab) {
      this.$router.push({ query: { ...this.$route.query, tab: newTab } });
    },
  },

  computed: {
    continents() {
      const continentStore = useContinentStore();
      return continentStore.continents;
    },
    countries() {
      const countryStore = useCountryStore();
      return countryStore.countries;
    },

    continentsWithIds() {
      return this.continents.map((continent, index) => ({
        ...continent,
        id: index + 1,
      }));
    },

    countriesWithIds() {
      return this.countries.map((country, index) => ({
        ...country,
        id: index + 1,
      }));
    },
  },

  mounted() {
    this.getContinents();
    this.getCountries();
  },

  methods: {
    async getContinents() {
      const continentStore = useContinentStore();
      try {
        await continentStore.fetchContinents();
      } catch (error) {
        console.error("Error fetching continents:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getCountries() {
      const countryStore = useCountryStore();
      try {
        await countryStore.fetchCountries();
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Continent action handlers
    handleContinentAddClick() {
      this.$router.push({
        name: "category-continent-add",
        query: { tab: "continent" },
      });
    },

    handleContinentViewClick(id) {
      this.$router.push({
        name: "category-continent-show",
        params: { id },
        query: { tab: "continent", continentId: id },
      });
    },

    handleContinentEditClick(id) {
      this.$router.push({
        name: "category-continent-edit",
        params: { id },
        query: { tab: "continent", continentId: id },
      });
    },

    async handleContinentDeactivateClick(id) {
      const continentStore = useContinentStore();
      try {
        const response = await continentStore.deactivateContinent(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getContinents();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleContinentActivateClick(id) {
      const continentStore = useContinentStore();
      try {
        const response = await continentStore.activateContinent(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getContinents();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    handleCountryAddClick() {
      this.$router.push({
        name: "category-country-add",
        query: { tab: "country" },
      });
    },

    handleCountryViewClick(id) {
      this.$router.push({
        name: "category-country-show",
        params: { id },
        query: { tab: "country", countryId: id },
      });
    },

    handleCountryEditClick(id) {
      this.$router.push({
        name: "category-country-edit",
        params: { id },
        query: { tab: "country", countryId: id },
      });
    },

    async handleCountryDeactivateClick(id) {
      const countryStore = useCountryStore();
      try {
        const response = await countryStore.deactivateCountry(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getCountries();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleCountryActivateClick(id) {
      const countryStore = useCountryStore();
      try {
        const response = await countryStore.activateCountry(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getCountries();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    // Error handling
    handleError(error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        this.$swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
        });
      } else {
        console.error("Unexpected error:", error);
      }
    },
  },
};
</script>

<style scoped></style>
