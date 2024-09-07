<template>
  <v-app class="m-0">
    <v-main class="background-image d-flex align-center justify-center">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.background-image {
  background-image: url("/images/login-background.jpg");
  background-color: rgba(1, 1, 1, 0.5);
  background-blend-mode: overlay;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
</style>
