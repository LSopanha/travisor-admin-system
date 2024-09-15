<template>
  <v-container>
    <v-col cols="12" class="pa-0">
      <h2 class="secondary--text text-decoration-underline my-3">
        User Management
      </h2>

      <!-- Chip group to toggle between Admin and Client -->
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
          value="client"
        >
          <v-icon class="mr-1">mdi-account</v-icon> Client
        </v-chip>
      </v-chip-group>
    </v-col>

    <!-- Admin Table -->
    <travisor-data-table
      v-if="selectedTab === 'admin' && admins.length"
      :title="'Admin'"
      :items="adminsWithIds"
      :headers="headers"
      :isLoading="isLoading"
      @add-click="handleAdminAddClick"
      @view-click="handleAdminViewClick"
      @edit-click="handleAdminEditClick"
      @deactivate-click="handleAdminDeactivateClick"
      @activate-click="handleAdminActivateClick"
    ></travisor-data-table>

    <!-- Client Table -->
    <travisor-data-table
      v-if="selectedTab === 'client' && clients.length"
      :title="'Client'"
      :items="clientsWithIds"
      :headers="headers"
      :isLoading="isLoading"
      @add-click="handleClientAddClick"
      @view-click="handleClientViewClick"
      @edit-click="handleClientEditClick"
      @deactivate-click="handleClientDeactivateClick"
      @activate-click="handleClientActivateClick"
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
        { text: "Profile", value: "profile_picture" },
        { text: "Status", value: "active" },
      ],
      isLoading: true,
    };
  },

  created() {
    const queryTab = this.$route.query.tab;
    if (queryTab === "client" || queryTab === "admin") {
      this.selectedTab = queryTab;
    }
  },

  watch: {
    selectedTab(newTab) {
      if (this.$route.query.tab !== newTab) {
        this.$router.push({ query: { ...this.$route.query, tab: newTab } });
      }
    },

    "$route.query.tab": {
      immediate: true,
      handler(newTab) {
        if (newTab === "client" || newTab === "admin") {
          this.selectedTab = newTab;
        }
      },
    },
  },

  computed: {
    ...mapState(useUserStore, {
      clients: "clients",
      admins: "admins",
    }),

    adminsWithIds() {
      return this.admins.map((admin, index) => ({ ...admin, id: index + 1 }));
    },

    clientsWithIds() {
      return this.clients.map((client, index) => ({
        ...client,
        id: index + 1,
      }));
    },
  },

  mounted() {
    this.getAdmins();
    this.getClients();
  },

  methods: {
    async getClients() {
      try {
        await this.userStore.fetchClients();
      } catch (error) {
        console.error("Error fetching clients:", error);
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

    handleAdminAddClick() {
      this.$router.push({
        name: "user-add",
        query: { tab: "admin", type: "admin" },
      });
    },

    handleAdminViewClick(id) {
      this.$router.push({
        name: "user-show",
        params: { id },
        query: { tab: "admin", adminId: id, type: "admin" },
      });
    },

    handleAdminEditClick(id) {
      this.$router.push({
        name: "user-edit",
        params: { id },
        query: { tab: "admin", adminId: id, type: "admin" },
      });
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
          this.getAdmins();
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
          this.getAdmins();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    handleClientAddClick() {
      this.$router.push({
        name: "user-add",
        query: { tab: "client", type: "client" },
      });
    },

    handleClientViewClick(id) {
      this.$router.push({
        name: "user-show",
        params: { id },
        query: { tab: "client", clientId: id, type: "client" },
      });
    },

    handleClientEditClick(id) {
      this.$router.push({
        name: "user-edit",
        params: { id },
        query: { tab: "client", clientId: id, type: "client" },
      });
    },

    async handleClientDeactivateClick(id) {
      try {
        const response = await this.userStore.deactivateUser("clients", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getClients();
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleClientActivateClick(id) {
      try {
        const response = await this.userStore.activateUser("clients", id);
        if (response.data && response.data.message) {
          this.$swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });
          this.getClients();
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
