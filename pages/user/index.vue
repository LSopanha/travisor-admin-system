<template>
  <v-container>
    <v-col cols="12" class="pa-0">
      <h2 class="secondary--text text-decoration-underline my-3">
        User management
      </h2>
      <v-chip-group
        mandatory
        active-class="primary--text"
        v-model="selectedTab"
      >
        <v-chip
          class="justify-center"
          style="width: 125px"
          outlined
          value="admin"
        >
          <v-icon class="mr-1">mdi-account</v-icon> Admin
        </v-chip>
        <v-chip
          class="justify-center"
          style="width: 125px"
          outlined
          value="user"
        >
          <v-icon class="mr-1">mdi-account</v-icon>User
        </v-chip>
      </v-chip-group>
    </v-col>

    <travisor-data-table
      v-if="selectedTab === 'admin' && admins.length"
      :title="'admin'"
      :items="admins"
      :headers="headers"
      :isLoading="isLoading"
      @add-click="handleAdminAddClick"
      @view-click="handleAdminViewClick"
      @edit-click="handleAdminEditClick"
      @deactivate-click="handleAdminDeactivateClick"
      @activate-click="handleAdminActivateClick"
    ></travisor-data-table>

    <travisor-data-table
      v-if="selectedTab === 'user' && users.length"
      :title="'user'"
      :items="users"
      :headers="headers"
      :isLoading="isLoading"
      @add-click="handleUserAddClick"
      @view-click="handleUserViewClick"
      @edit-click="handleUserEditClick"
      @deactivate-click="handleUserDeactivateClick"
      @activate-click="handleUserActivateClick"
    ></travisor-data-table>
  </v-container>
</template>

<script>
import { useUserStore } from "~/store/user";
import { mapState } from "pinia";

export default {
  name: "UserPage",
  data() {
    return {
      userStore: useUserStore(),
      selectedTab: "admin",
      headers: [
        { text: "ID", value: "id" },
        { text: "First Name", value: "first_name" },
        { text: "Last Name", value: "last_name" },
        { text: "Gender", value: "gender" },
        { text: "Phone", value: "phone" },
        { text: "Email", value: "email" },
      ],
      isLoading: true,
    };
  },

  mounted() {
    // this.getUsers();
    this.getAdmins();
  },

  computed: {
    ...mapState(useUserStore, {
      users: "users",
      admins: "admins",
    }),
  },

  methods: {
    async getUsers() {
      try {
        await this.userStore.fetchUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getAdmins() {
      try {
        await this.userStore.fetchAdmins();
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Admin action handlers
    handleAdminAddClick() {
      this.$router.push("/user/add");
    },
    handleAdminViewClick() {
      this.$router.push("/user/show");
    },
    handleAdminEditClick(id) {
      this.$router.push({ name: "user-edit", params: { id } });
    },
    async handleAdminDeactivateClick(id) {
      try {
        const response = await this.userStore.deactivateUser("admins", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleAdminActivateClick(id) {
      try {
        const response = await this.userStore.activateUser("admins", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleAdminBanClick(id) {
      try {
        const response = await this.userStore.banUser("admins", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleAdminAuthorizeClick(id) {
      try {
        const response = await this.userStore.authorizeUser("admins", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    // User action handlers
    handleUserAddClick() {
      this.$router.push("/user/add");
    },
    handleUserViewClick() {
      this.$router.push("/user/show");
    },
    handleUserEditClick(id) {
      this.$router.push({ name: "user-edit", params: { id } });
    },
    async handleUserDeactivateClick(id) {
      try {
        const response = await this.userStore.deactivateUser("users", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleUserActivateClick(id) {
      try {
        const response = await this.userStore.activateUser("users", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleUserBanClick(id) {
      try {
        const response = await this.userStore.banUser("users", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleUserAuthorizeClick(id) {
      try {
        const response = await this.userStore.authorizeUser("users", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    // Error handling
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
