<template>
  <continent-form :title="'Add Continent'"> </continent-form>
</template>

<script>
import ContinentForm from "~/components/ContinentForm.vue";
import { useContinentStore } from "~/store/continent";

export default {
  name: "AddContinentPage",
  components: {
    ContinentForm,
  },
  data() {
    return {
      continentStore: useContinentStore(),
    };
  },
};
</script>
