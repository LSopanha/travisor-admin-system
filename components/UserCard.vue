<template>
  <v-container class="user-card-container" fluid>
    <v-card-title class="justify-center px-10">
      <!-- <div class="primary--text font-weight-bold">{{ title }}</div> -->
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card-title>

    <v-card
      max-width="400"
      class="mx-auto py-4 px-4 primary lighten-1 text-center"
    >
      <!-- Wrapping avatar and name in a row with justify-center -->
      <v-row justify="center" class="pt-5">
        <v-avatar class="mb-4" size="120">
          <v-img
            :src="
              user.profile_picture
                ? user.profile_picture
                : '/images/default-profile-picture.PNG'
            "
            alt="User Profile"
          ></v-img>
        </v-avatar>
      </v-row>

      <v-row justify="center" class="pa-0 ma-0">
        <v-card-title class="text-center white--text pa-0 pt-2 ma-0">
          <strong>{{ user.first_name }} {{ user.last_name }}</strong>
        </v-card-title>
      </v-row>

      <v-row justify="center" class="pa-0 ma-0">
        <v-card-subtitle
          class="text-center font-size-20 text-capitalize font-weight-bold info--text pa-0 pb-2 ma-0"
        >
          {{ user.role.role_name }}
        </v-card-subtitle>
      </v-row>

      <!-- User details -->
      <v-card-text class="card-info">
        <div class="info-item">
          <strong>ID No:</strong>
          <span>{{ user.global_id }}</span>
        </div>

        <div class="info-item">
          <strong>Email:</strong>
          <span>{{ user.email }}</span>
        </div>

        <div class="info-item">
          <strong>Phone:</strong>
          <span>{{ user.phone }}</span>
        </div>

        <div class="info-item">
          <strong>Date of Birth:</strong>
          <span>{{ user.dob }}</span>
        </div>

        <div class="info-item">
          <strong>Status:</strong>
          <span>{{ user.active ? "Active" : "Inactive" }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>

<style scoped>
.card-info {
  background-color: white;
  border-radius: 8px;
  color: black;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-item strong {
  color: #f4931e;
}

.info-item span {
  color: #333;
}
</style>
