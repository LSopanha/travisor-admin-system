<template>
  <v-container class="my-10">
    <v-card-title class="justify-end px-0">
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card-title>

    <v-card class="pa-6 rounded-xl" v-if="blog">
      <div class="d-flex flex-column align-center justify-center mb-16">
        <!-- Blog Title -->
        <v-row>
          <v-col>
            <h2 class="text-h5 font-weight-bold">
              {{ blog.title }}
            </h2>
          </v-col>
        </v-row>

        <!-- Author, Date, and Total Likes -->
        <v-row>
          <v-col class="d-flex align-center" cols="auto">
            <v-img
              :src="
                blog.user?.profile_image ||
                '/images/default-profile-picture.PNG'
              "
              alt="Author profile"
              class="rounded-circle"
              max-width="40"
            ></v-img>
          </v-col>
          <v-col cols="auto">
            <div class="d-flex flex-column">
              <span class="text-subtitle-2 font-weight-bold secondary--text">
                {{ blog.user?.first_name }} {{ blog.user?.last_name }}
              </span>
              <span class="caption grey--text">
                {{ formattedDate(blog.created_at) }} - {{ blog.likes }} likes
              </span>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Blog Content -->
      <v-row>
        <v-col>
          <h3 class="text-h6 font-weight-bold">
            Destination: {{ blog.destination?.destination_name }}
          </h3>
          <p class="subtitle-2 font-weight-medium">
            {{ blog.short_description }}
          </p>
          <p>{{ blog.text }}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { useBlogStore } from "~/store/blog";
import { mapState } from "pinia";

export default {
  data() {
    return {
      blogStore: useBlogStore(),
    };
  },

  computed: {
    ...mapState(useBlogStore, {
      blog: "blog",
    }),
  },

  created() {
    const blogId = this.$route.query.blogId;
    if (blogId) {
      this.fetchBlogDetails(blogId);
    }
  },

  methods: {
    async fetchBlogDetails(id) {
      try {
        await this.blogStore.fetchBlogById(id);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    },

    formattedDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
h2,
h3 {
  margin: 0;
}

v-card {
  border-radius: 16px;
}

.rounded-circle {
  border-radius: 50%;
}
</style>
