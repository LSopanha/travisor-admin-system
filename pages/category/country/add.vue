<template>
  <country-form :title="'Add Country'"> </country-form>
</template>

<script>
import CountryForm from "~/components/CountryForm.vue";
import { useCountryStore } from "~/store/country";

export default {
  name: "AddCountryPage",
  components: {
    CountryForm,
  },
  data() {
    return {
      countryStore: useCountryStore(),
    };
  },
};
</script>
