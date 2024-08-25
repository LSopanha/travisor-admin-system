<template>
  <v-sheet class="pa-12 primary" rounded>
    <v-card class="mx-auto px-6 py-8 rounded-lg" max-width="400">
      <v-col class="d-flex flex-row align-center justify-center pa-0">
        <v-img
          src="/images/travisor-logo.png"
          alt="Travisor Logo"
          :max-width="200"
        />
      </v-col>
      <p class="black--text text-center ma-0 my-5">Welcome back!</p>

      <v-form v-model="form" @submit.prevent="login">
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Email"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Password"
          type="password"
          placeholder="Enter your password"
          clearable
        ></v-text-field>

        <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>

        <br />

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="black"
          class="white--text rounded-lg"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script>
import { useAuthStore } from "~/store/auth";

export default {
  layout: "login",

  data: () => ({
    form: false,
    email: null,
    password: null,
    loading: false,
    error: null,
  }),

  methods: {
    required(v) {
      return !!v || "Field is required";
    },

    async login() {
      const authStore = useAuthStore(this.$pinia);
      this.loading = true;
      this.error = null;
      try {
        await authStore.login(this.email, this.password).then(() => {
          this.$router.push("/");
        });
      } catch (e) {
        console.log(e);
        if (!e.reposne && e.code == "ERR_NETWORK") {
          this.error = e.message;
        } else {
          this.error = e.response.data.error;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
