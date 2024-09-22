<template>
  <div
    class="d-flex justify-center align-center"
    style="height: 80vh; overflow: hidden"
  >
    <v-card class="mx-auto mt-5 elevation-0" max-width="50%">
      <v-list-item>
        <v-col class="text-center">
          <v-row block class="mx-auto justify-center align-center">
            <v-img>
              <img
                src="../static/images/rocket.jpg"
                style="max-height: 200px; max-width: 200px"
              />
            </v-img>
          </v-row>
          <v-row block class="my-3">
            <v-list-item-title
              class="text-h5 font-weight-bold mb-1 secondary--text"
            >
              Coming soon...!
            </v-list-item-title>
            <v-list-item-subtitle widt class="text-wrap"
              >Our developers are working hard and expect to release the new
              feature in the future. Stay tuned for more updates, and be sure to
              check back soon!</v-list-item-subtitle
            >
          </v-row>
        </v-col>
      </v-list-item>

      <v-card-actions class="mx-auto justify-center align-center">
        <v-btn
          color="primary"
          class="white--text rounded-xl px-5"
          size="large"
          variant="elevated"
          @click="$router.go(-1)"
        >
          Go back
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
};
</script>
