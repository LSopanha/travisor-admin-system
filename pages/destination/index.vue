<template>
  <v-container>
    <v-col cols="12" class="pa-0">
      <h2 class="secondary--text text-decoration-underline my-3">
        Destination Management
      </h2>
    </v-col>

    <travisor-data-table
      :title="'Destination'"
      :items="destinationsWithIds"
      :headers="headers"
      :isLoading="isLoading"
      @add-click="handleDestinationAddClick"
      @view-click="handleDestinationViewClick"
      @edit-click="handleDestinationEditClick"
      @deactivate-click="handleDestinationDeactivateClick"
      @activate-click="handleDestinationActivateClick"
    ></travisor-data-table>
  </v-container>
</template>

<script>
import { useDestinationStore } from "~/store/destination";
import { mapState } from "pinia";

export default {
  name: "UserPage",
  data() {
    return {
      destinationStore: useDestinationStore(),
      headers: [
        { text: "ID", value: "id" },
        { text: "Destination Name", value: "destination_name" },
        { text: "Description", value: "truncatedDescription" },
        { text: "Profile", value: "profile_picture" },
        { text: "Continent Name", value: "continent.continent_name" },
        { text: "Country Name", value: "country.country_name" },
        { text: "Status", value: "active" },
      ],
      isLoading: true,
    };
  },

  computed: {
    ...mapState(useDestinationStore, {
      destinations: "destinations",
      destination: "destinations",
    }),

    destinationsWithIds() {
      return this.destinations.map((destination, index) => ({
        ...destination,
        id: index + 1,
        truncatedDescription: this.truncateText(destination.description, 50), // Add truncation here
      }));
    },
  },

  mounted() {
    this.getDestinations();
  },

  methods: {
    async getDestinations() {
      try {
        await this.destinationStore.fetchDestinations();
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        this.isLoading = false;
      }
    },

    truncateText(text, length) {
      return text.length > length ? text.slice(0, length) + "..." : text;
    },

    handleDestinationAddClick() {
      this.$router.push({
        name: "destination-add",
      });
    },

    handleDestinationViewClick(id) {
      this.$router.push({
        name: "destination-show",
        params: { id },
        query: { destinationId: id },
      });
    },

    handleDestinationEditClick(id) {
      this.$router.push({
        name: "destination-edit",
        params: { id },
        query: { destinationId: id },
      });
    },

    async handleDestinationDeactivateClick(id) {
      try {
        const response = await this.destinationStore.deactivateDestination(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getDestinations();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleDestinationActivateClick(id) {
      try {
        const response = await this.destinationStore.activateDestination(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getDestinations();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

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
