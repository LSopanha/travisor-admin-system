<template>
  <v-container>
    <v-col cols="12" class="pa-0">
      <h2 class="secondary--text text-decoration-underline my-3">
        Blog Management
      </h2>
    </v-col>

    <travisor-data-table
      :title="'Blog'"
      :items="blogsWithIds"
      :headers="headers"
      :isLoading="isLoading"
      @view-click="handleBlogViewClick"
      @deactivate-click="handleBlogDeactivateClick"
      @activate-click="handleBlogActivateClick"
    ></travisor-data-table>
  </v-container>
</template>

<script>
import { useBlogStore } from "~/store/blog";
import { mapState } from "pinia";

export default {
  name: "UserPage",
  data() {
    return {
      blogStore: useBlogStore(),
      headers: [
        { text: "ID", value: "id" },
        { text: "User Name", value: "userName" },
        { text: "Destination", value: "destination.destination_name" },
        { text: "Title", value: "title" },
        { text: "Text", value: "truncatedText" },
        { text: "Likes", value: "likes" },
        { text: "Status", value: "active" },
      ],
      isLoading: true,
    };
  },

  computed: {
    ...mapState(useBlogStore, {
      blogs: "blogs",
      blog: "blog",
    }),

    blogsWithIds() {
      return this.blogs.map((blog, index) => ({
        ...blog,
        id: index + 1,
        userName: this.concatUserName(
          blog.user?.first_name,
          blog.user?.last_name
        ), // Concatenate user name
        truncatedText: this.truncateText(blog.text, 100),
      }));
    },
  },

  mounted() {
    this.getBlogs();
  },

  methods: {
    async getBlogs() {
      try {
        await this.blogStore.fetchBlogs();
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        this.isLoading = false;
      }
    },

    truncateText(text, length) {
      return text.length > length ? text.slice(0, length) + "..." : text;
    },

    concatUserName(firstName, lastName) {
      return `${firstName || ""} ${lastName || ""}`.trim();
    },

    handleBlogViewClick(id) {
      this.$router.push({
        name: "blog-show",
        params: { id },
        query: { blogId: id },
      });
    },

    async handleBlogDeactivateClick(id) {
      try {
        const response = await this.blogStore.deactivateBlog(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getBlogs();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleBlogActivateClick(id) {
      try {
        const response = await this.blogStore.activateBlog(id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getBlogs();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    handleError(error) {
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
        console.error("Unexpected error:", error);
      }
    },
  },
};
</script>
