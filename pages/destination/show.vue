<template>
  <v-container class="my-10">
    <!-- Back button -->
    <v-card-title class="justify-end px-0">
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card-title>

    <!-- Destination Details -->
    <v-card class="pa-6 rounded-xl" v-if="destination">
      <v-row>
        <!-- Destination Profile Picture -->
        <v-col cols="12" sm="4" class="d-flex justify-center align-center">
          <v-img
            :src="destination.profile_picture || placeholderImage"
            alt="Destination Profile Picture"
            class="elevation-3"
            max-width="300"
            aspect-ratio="1"
            contain
          />
        </v-col>

        <!-- Destination Info -->
        <v-col cols="12" sm="8">
          <v-row>
            <v-col cols="12">
              <h1 class="text-h5 font-weight-bold">
                {{ destination.destination_name }}
              </h1>
              <p class="text-subtitle-1 mb-2">
                <strong>Continent:</strong>
                {{ destination.continent?.continent_name || "N/A" }}<br />
                <strong>Country:</strong>
                {{ destination.country?.country_name || "N/A" }}<br />
                <strong>Status:</strong>
                <v-chip
                  :color="destination.active ? 'green' : 'red'"
                  class="white--text"
                  small
                >
                  {{ destination.active ? "Active" : "Inactive" }}
                </v-chip>
              </p>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>

            <!-- Destination Description -->
            <v-col cols="12">
              <h3 class="text-h6 font-weight-bold">Description</h3>
              <p>
                {{ destination.description || "No description available." }}
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { useDestinationStore } from "~/store/destination";
import { mapState } from "pinia";

export default {
  data() {
    return {
      destinationStore: useDestinationStore(),
      placeholderImage: "https://via.placeholder.com/300", // Fallback image if profile picture is missing
    };
  },

  computed: {
    ...mapState(useDestinationStore, {
      destination: "destination", // Fetching the single destination
    }),
  },

  created() {
    const destinationId = this.$route.query.destinationId;
    if (destinationId) {
      this.fetchDestinationDetails(destinationId);
    }
  },

  methods: {
    async fetchDestinationDetails(id) {
      try {
        await this.destinationStore.fetchDestinationById(id);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.font-weight-bold {
  font-weight: bold;
}

.text-h5 {
  font-size: 1.5rem;
}

.text-h6 {
  font-size: 1.25rem;
}

.text-subtitle-1 {
  font-size: 1rem;
}

.v-divider {
  margin: 1rem 0;
}

.v-img {
  border-radius: 12px;
}
</style>
