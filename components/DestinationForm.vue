<template>
  <v-card elevation="2" class="ma-16" outlined shaped>
    <v-card-title class="justify-space-between px-10">
      <div class="primary--text font-weight-bold">{{ title }}</div>
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)">
          Back
        </v-btn>
      </div>
    </v-card-title>

    <v-form @submit.prevent="submitForm" ref="form">
      <v-container class="px-10 pb-10" fluid>
        <v-row>
          <!-- Destination Name -->
          <v-col cols="12" md="12">
            <v-text-field
              v-model="formData.destination_name"
              :counter="50"
              :rules="destinationNameRules"
              label="Destination Name"
              required
            ></v-text-field>
          </v-col>

          <!-- Continent -->
          <v-col cols="12" md="12">
            <v-select
              v-model="formData.continent_id"
              :items="continentOptions"
              item-text="continent_name"
              item-value="global_id"
              label="Continent"
              :rules="continentRules"
              required
              :loading="continentOptions.length === 0"
            ></v-select>
          </v-col>

          <!-- Country -->
          <v-col cols="12" md="12">
            <v-select
              v-model="formData.country_id"
              :items="countryOptions"
              item-text="country_name"
              item-value="global_id"
              label="Country"
              :rules="countryRules"
              required
              :loading="countryOptions.length === 0"
              :disabled="!formData.continent_id"
            ></v-select>
          </v-col>

          <!-- Description -->
          <v-col cols="12" md="12">
            <v-textarea
              v-model="formData.description"
              :counter="1000"
              :rules="descriptionRules"
              label="Description"
              required
            ></v-textarea>
          </v-col>

          <!-- Profile Picture -->
          <v-col cols="12" md="12">
            <v-text-field
              v-model="formData.profile_picture"
              :counter="500"
              :rules="profileRules"
              label="Profile Picture URL"
            ></v-text-field>
          </v-col>

          <!-- Status -->
          <v-col cols="12" md="6">
            <v-switch
              v-model="formData.active"
              label="Status (Active)"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row class="justify-end px-3 pt-5">
          <v-btn color="primary" @click="submitForm">Submit</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { useCountryStore } from "~/store/country";
import { useContinentStore } from "~/store/continent";
import { useDestinationStore } from "~/store/destination";

export default {
  data() {
    return {
      countryStore: useCountryStore(),
      continentStore: useContinentStore(),
      destinationStore: useDestinationStore(),
      formData: {
        destination_name: "",
        description: "",
        profile_picture: "",
        continent_id: "",
        country_id: "",
        active: false,
      },
      continentOptions: [],
      countryOptions: [],
      destinationNameRules: [
        (value) =>
          value?.length <= 50 ||
          "Destination name is limited to 50 characters.",
      ],
      continentRules: [(value) => !!value || "Continent is required."],
      countryRules: [(value) => !!value || "Country is required."],
      descriptionRules: [
        (value) =>
          value?.length <= 1000 || "Description is limited to 1000 characters.",
      ],
      profileRules: [
        (value) =>
          value?.length <= 500 ||
          "Profile picture URL must be less than 500 characters.",
      ],
    };
  },

  props: {
    title: {
      type: String,
      default: "Form",
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    existingData: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    existingData: {
      immediate: true,
      handler(newData) {
        this.populateForm(newData);
      },
    },
    "formData.continent_id": function (newVal) {
      if (newVal) {
        this.fetchCountriesByContinent(newVal);
      } else {
        this.countryOptions = [];
      }
    },
  },

  created() {
    this.getContinentOptions();
    if (this.editMode) {
      this.populateForm(this.existingData);
    }
  },

  methods: {
    async submitForm() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        try {
          let response;
          if (this.editMode) {
            response = await this.destinationStore.updateDestination(
              this.existingData.global_id,
              this.formData
            );
            this.$swal
              .fire({
                title: "Success!",
                text: response.data.message,
                icon: "success",
              })
              .then(() => {
                this.$router.go(-1);
              });
          } else {
            response = await this.destinationStore.addDestination(
              this.formData
            );
            this.$swal
              .fire({
                title: "Success!",
                text: response.data.message,
                icon: "success",
              })
              .then(() => {
                this.$router.go(-1);
              });
          }
        } catch (error) {
          this.$swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "An error occurred.",
            icon: "error",
          });
        }
      } else {
        this.$swal.fire({
          title: "Error!",
          text: "Form is not valid!",
          icon: "error",
        });
      }
    },

    async populateForm(data) {
      if (this.editMode && Object.keys(data).length > 0) {
        this.formData.destination_name = data.destination_name || "";
        this.formData.description = data.description || "";
        this.formData.profile_picture = data.profile_picture || "";
        this.formData.continent_id =
          data.continent_id || data.continent?.global_id || "";
        this.formData.country_id =
          data.country_id || data.country?.global_id || "";
        this.formData.active = data.active || false;

        // Fetch countries if continent is already selected
        if (this.formData.continent_id) {
          await this.fetchCountriesByContinent(this.formData.continent_id);
        }
      }
    },

    async getContinentOptions() {
      try {
        const response = await this.continentStore.fetchContinents();
        if (response.status === 200 && response.data) {
          this.continentOptions = response.data.data;

          // Fetch countries if continent is already set in edit mode
          if (this.editMode && this.formData.continent_id) {
            await this.fetchCountriesByContinent(this.formData.continent_id);
          }
        }
      } catch (error) {
        console.error("Error fetching continents:", error);
      }
    },

    async fetchCountriesByContinent(continentId) {
      try {
        const response = await this.countryStore.fetchCountriesByContinent(
          continentId
        );
        if (response.status === 200 && response.data) {
          this.countryOptions = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    },
  },
};
</script>
