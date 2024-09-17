<template>
  <div v-if="destination && Object.keys(destination).length > 0">
    <destination-form
      :title="`Edit Destination`"
      :existingData="destination"
      :editMode="true"
    />
  </div>
</template>

<script>
import DestinationForm from "~/components/DestinationForm.vue";
import { useDestinationStore } from "~/store/destination";
import { mapState } from "pinia";

export default {
  name: "EditDestinationPage",
  components: {
    DestinationForm,
  },
  data() {
    return { destinationStore: useDestinationStore() };
  },
  computed: {
    ...mapState(useDestinationStore, {
      destination: "destination",
    }),
  },
  mounted() {
    const destinationId = this.$route.query.destinationId;
    this.getDestinationById(destinationId);
  },
  methods: {
    async getDestinationById(destinationId) {
      try {
        await this.destinationStore.fetchDestinationById(destinationId);
      } catch (error) {
        console.error(`Error fetching destination data:`, error);
      }
    },
  },
};
</script>
