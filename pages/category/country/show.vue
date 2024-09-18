<template>
  <v-container>
    <!-- Back Button -->
    <v-card-title class="justify-end px-0">
      <v-btn color="black" class="white--text" @click="$router.go(-1)"
        >Back</v-btn
      >
    </v-card-title>

    <!-- Country Details -->
    <v-row>
      <v-col cols="12" md="12">
        <v-card class="pt-10">
          <!-- Country Image -->
          <v-img
            :src="country.profile_picture"
            alt="Country Image"
            class="white--text"
            height="300px"
            contain
          ></v-img>

          <!-- Country Information -->
          <v-card-title
            class="headline text-center aling-center justify-center font-weight-bold"
          >
            {{ country.country_name }}
          </v-card-title>
          <v-card-subtitle class="text-center">
            {{ country.description }}
          </v-card-subtitle>

          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Continent</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ country.continent?.continent_name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Status</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                      :color="country.active ? 'green' : 'red'"
                      class="white--text"
                      small
                    >
                      {{ country.active ? "Active" : "Inactive" }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useCountryStore } from "~/store/country";
import { mapState } from "pinia";

export default {
  name: "CountryShow",
  data() {
    return {
      countryStore: useCountryStore(),
    };
  },
  computed: {
    ...mapState(useCountryStore, {
      country: "country",
    }),
  },
  created() {
    const countryId = this.$route.query.countryId;
    console.log(countryId);
    if (countryId) {
      this.fetchCountryDetail(countryId);
    }
  },
  methods: {
    async fetchCountryDetail(id) {
      try {
        await this.countryStore.fetchCountryById(id);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-card-title,
.v-card-subtitle {
  margin-bottom: 16px;
}

.v-img {
  display: block;
  margin: 0 auto;
}

.v-card {
  text-align: center;
}

.font-weight-bold {
  font-weight: bold;
}
</style>
