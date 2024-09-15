<template>
  <div v-if="continent && Object.keys(continent).length > 0">
    <continent-form
      :title="`Edit Continent`"
      :existingData="continent"
      :editMode="true"
    />
  </div>
</template>

<script>
import ContinentForm from "~/components/ContinentForm.vue";
import { useContinentStore } from "~/store/continent";
import { mapState } from "pinia";

export default {
  name: "EditContinentPage",
  components: {
    ContinentForm,
  },
  data() {
    return { continentStore: useContinentStore() };
  },
  computed: {
    ...mapState(useContinentStore, {
      continent: "continent",
    }),
  },
  mounted() {
    const continentId = this.$route.query.continentId;
    this.getContinent(continentId);
  },
  methods: {
    async getContinent(continentId) {
      try {
        await this.continentStore.fetchContinentById(continentId);
      } catch (error) {
        console.error(`Error fetching continent data:`, error);
      }
    },
  },
};
</script>
