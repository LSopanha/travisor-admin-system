import { defineStore } from 'pinia';

export const useBlogStore = defineStore('blog', {
   state: () => ({
      blogs: [],
      blog: {},
   }),

   actions: {
      setBlogs(blogs) {
         this.blogs = blogs;
      },
      setBlog(blog) {
         this.blog = blog;
      },
      async fetchBlogs() {
         const response = await this.$axios.get('blogs');
         this.setBlogs(response.data.data); 
         return response;
      },
      async fetchBlogById(id) {
         const response = await this.$axios.get(`blogs/${id}`);
         this.setBlog(response.data.data);
         return response;
      },
      async deactivateBlog(id) {
         const response = await this.$axios.put(`blogs/${id}/deactivate`);
         return response;
      },
      async activateBlog(id) {
         const response = await this.$axios.put(`blogs/${id}/activate`);
         return response;
      },
  },
});