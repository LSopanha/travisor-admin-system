<template>
  <v-card elevation="2" class="ma-16" outlined shaped>
    <v-card-title class="justify-space-between px-10">
      <div class="primary--text font-weight-bold">{{ title }}</div>
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card-title>
    <v-form @submit.prevent="submitForm" ref="form">
      <v-container class="px-10 pb-10" fluid>
        <v-row>
          <!-- First Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.first_name"
              :counter="100"
              :rules="fnameRules"
              label="First Name"
              required
            ></v-text-field>
          </v-col>

          <!-- Last Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.last_name"
              :counter="100"
              :rules="lnameRules"
              label="Last Name"
              required
            ></v-text-field>
          </v-col>

          <!-- Date of Birth -->
          <v-col cols="12" md="6">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formData.dob"
                  label="Date of Birth"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.dob"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <!-- Username -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.username"
              :rules="usernameRules"
              label="Username"
            ></v-text-field>
          </v-col>

          <!-- Gender -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.gender"
              :items="genderOptions"
              label="Gender"
            ></v-select>
          </v-col>

          <!-- Phone -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.phone"
              :counter="10"
              :rules="phoneRules"
              label="Phone Number"
              required
            ></v-text-field>
          </v-col>

          <!-- Email -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="E-mail"
            ></v-text-field>
          </v-col>

          <!-- Password -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.password"
              :counter="100"
              :rules="computedPasswordRules"
              label="Password"
              type="password"
            ></v-text-field>
          </v-col>

          <!-- Profile Picture -->
          <v-col cols="12" md="12">
            <v-text-field
              v-model="formData.profile_picture"
              :counter="500"
              :rules="profileRules"
              label="Profile Picture"
            ></v-text-field>
          </v-col>

          <!-- Role -->
          <v-col cols="12" md="12">
            <v-select
              v-show="!showAdminRole"
              v-model="formData.role_id"
              :items="roleOptions"
              item-text="role_name"
              item-value="global_id"
              label="Role"
              :disabled="showAdminRole && !editMode"
              required
            ></v-select>
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
import { useUserStore } from "~/store/user";
import { mapState } from "pinia";

export default {
  data() {
    return {
      userStore: useUserStore(),
      roleOptions: [],
      formData: {
        first_name: "",
        last_name: "",
        username: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
        role_id: "",
        profile_picture: "",
        active: false,
      },
      menu: false,
      genderOptions: ["Male", "Female"],
      phoneRules: [
        (value) => !!value || "Phone number is required.",
        (value) =>
          /^\d+$/.test(value) ||
          "Phone number must contain only numeric digits.",
        (value) =>
          value?.length === 9 ||
          value?.length === 10 ||
          "Phone number must be 9 or 10 digits in length.",
      ],
      fnameRules: [(value) => !!value || "First Name is required."],
      lnameRules: [(value) => !!value || "Last Name is required."],
      usernameRules: [
        (value) =>
          value?.length >= 5 || "Username must be greater than 5 characters.",
      ],
      emailRules: [
        (value) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
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
    apiUrl: {
      type: String,
      default: false,
      required: true,
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

  computed: {
    isEditMode() {
      return this.editMode;
    },
    ...mapState(useUserStore, {
      roles: "roles",
    }),
    computedPasswordRules() {
      if (this.isEditMode) {
        return [];
      } else {
        return [
          (value) =>
            value?.length >= 8 || "Password must be at least 8 characters.",
        ];
      }
    },
    showAdminRole() {
      return this.apiUrl == "admins" && !this.editMode;
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

  mounted() {
    this.getRleOptions();
  },

  methods: {
    async submitForm() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        try {
          let response;
          if (this.isEditMode) {
            console.log(this.apiUrl);
            response = await this.userStore.updateUser(
              this.apiUrl,
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
            response = await this.userStore.addUser(this.apiUrl, this.formData);
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
            console.error("Error data:", error);
          }
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
      if (this.isEditMode && Object.keys(data).length > 0) {
        this.formData.first_name = data.first_name;
        this.formData.last_name = data.last_name;
        this.formData.dob = data.dob || "";
        this.formData.username = data.username || "";
        this.formData.gender = data.gender || "";
        this.formData.email = data.email || "";
        this.formData.password = "";
        this.formData.phone = data.phone || "";
        this.formData.profile_picture = data.profile_picture || "";
        this.formData.role_id = data.role.global_id;
        this.formData.active = data.active || false;
      }
    },

    async getRleOptions() {
      try {
        const roles = await this.userStore.fetchRoleOptions();
        if (roles.status === 200 && roles.data) {
          this.roleOptions = roles.data.data;

          if (this.showAdminRole) {
            console.log(1);
            const adminRole = this.roleOptions.find(
              (role) => role.role_name === "admin"
            );
            if (adminRole) {
              this.formData.role_id = adminRole.global_id;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
  },
};
</script>
