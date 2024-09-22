<template>
  <user-form
    :title="`Edit ${userType === 'admin' ? 'Admin' : 'Client'} User`"
    :apiUrl="`${userType}s`"
    :existingData="user"
    :editMode="true"
  />
</template>

<script>
import UserForm from "~/components/UserForm.vue";
import { useUserStore } from "~/store/user";
import { mapState } from "pinia";

export default {
  name: "EditUserPage",
  components: {
    UserForm,
  },
  data() {
    return {
      userType: "admin",
    };
  },
  computed: {
    user() {
      return this.userType === "admin" ? this.admin : this.client;
    },
    ...mapState(useUserStore, {
      client: "client",
      admin: "admin",
    }),
  },
  mounted() {
    const userType = this.$route.query.type || "client";
    this.userType = userType;

    const userId = this.$route.query.id;
    if (userId) {
      this.getUser(userType, userId);
    }
  },
  methods: {
    async getUser(userType, userId) {
      const userStore = useUserStore();
      try {
        await userStore.fetchUserById(`${userType}s`, userId);
      } catch (error) {
        console.error(`Error fetching ${userType} data:`, error);
      }
    },
  },
};
</script>
