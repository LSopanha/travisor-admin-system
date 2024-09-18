<template>
  <v-container>
    <!-- Back Button -->
    <v-card-title class="justify-end px-0 pb-10">
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card-title>

    <!-- Main Content Row -->
    <v-row>
      <!-- Continent Details -->
      <v-col cols="12" md="6" class="pa-0 pr-2">
        <v-card>
          <v-card-title class="headline">Continent Details</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Continent Name</v-list-item-title>
                  <v-list-item-subtitle>{{
                    continent.continent_name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Number of Countries</v-list-item-title>
                  <v-list-item-subtitle>{{
                    continent.country_count
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Description</v-list-item-title>
                  <v-list-item-subtitle>{{
                    continent.description || "No description provided"
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Status</v-list-item-title>
                  <v-list-item-subtitle>{{
                    continent.active ? "Active" : "Inactive"
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Profile Picture</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-img
                      :src="continent.profile_picture"
                      alt="Continent Profile Picture"
                      max-width="100px"
                    />
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Countries List -->
      <v-col cols="12" md="6">
        <v-row>
          <v-col
            v-for="country in continent.countries"
            :key="country.id"
            cols="12"
            sm="12"
            class="pa-2"
          >
            <v-card>
              <v-row>
                <!-- Country Image -->
                <v-col cols="4">
                  <v-img
                    :src="country.profile_picture"
                    alt="Country Profile Picture"
                    height="150px"
                    contain
                  />
                </v-col>

                <!-- Country Info -->
                <v-col cols="8">
                  <v-card-title
                    class="headline pt-0 text-center font-weight-bold"
                    >{{ country.country_name }}</v-card-title
                  >
                  <v-card-subtitle>{{
                    truncateDescription(country.description, 100)
                  }}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      @click="viewCountryDetails(country.global_id)"
                      color="primary"
                      >View Details</v-btn
                    >
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useContinentStore } from "~/store/continent";
import { mapState } from "pinia";

export default {
  name: "ContinentShow",
  data() {
    return {
      continentStore: useContinentStore(),
    };
  },
  computed: {
    ...mapState(useContinentStore, {
      continent: "continent",
    }),
  },
  async mounted() {
    const continentId = this.$route.query.continentId;

    try {
      await this.fetchContinentDetail(continentId);
    } catch (error) {
      console.error("Error fetching continent details:", error);
    }
  },
  methods: {
    async fetchContinentDetail(id) {
      try {
        await this.continentStore.fetchContinentById(id);
      } catch (error) {
        console.error("Error fetching continent:", error);
      }
    },
    viewCountryDetails(countryId) {
      this.$router.push({
        name: "category-country-show",
        params: { countryId },
        query: { tab: "country", countryId: countryId },
      });
    },
    truncateDescription(description, length) {
      if (!description) return "No description provided";
      return description.length > length
        ? description.substring(0, length) + "..."
        : description;
    },
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}

.v-card-subtitle {
  color: grey;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
