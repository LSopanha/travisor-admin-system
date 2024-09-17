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
          <!-- Continent Name -->
          <v-col cols="12" md="12">
            <v-text-field
              v-model="formData.continent_name"
              :counter="50"
              :rules="continentNameRules"
              label="Continent Name"
              required
            ></v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12" md="12">
            <v-textarea
              v-model="formData.description"
              :counter="500"
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
import { useContinentStore } from "~/store/continent";

export default {
  data() {
    return {
      continentStore: useContinentStore(),
      formData: {
        continent_name: "",
        description: "",
        profile_picture: "",
        active: false,
      },
      // menu: false,
      continentNameRules: [
        (value) =>
          value?.length <= 50 || "Continent name is limited to 50 characters.",
      ],
      descriptionRules: [
        (value) =>
          value?.length <= 500 || "Description is limited to 500 characters.",
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
  },

  methods: {
    async submitForm() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        try {
          let response;
          if (this.editMode) {
            response = await this.continentStore.updateContinent(
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
            response = await this.continentStore.addContinent(this.formData);
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

    populateForm(data) {
      if (this.editMode && Object.keys(data).length > 0) {
        this.formData.continent_name = data.continent_name || "";
        this.formData.description = data.description || "";
        this.formData.profile_picture = data.profile_picture || "";
        this.formData.active = data.active || false;
      }
    },
  },
};
</script>
