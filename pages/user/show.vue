<template>
  <v-container>
    <user-card
      v-if="selectedUser"
      :user="selectedUser"
      :userType="userType"
    ></user-card>
  </v-container>
</template>

<script>
import { useUserStore } from "~/store/user";
import { mapState } from "pinia";
import UserCard from "~/components/UserCard.vue";

export default {
  components: {
    UserCard,
  },
  data() {
    return {
      selectedUser: null,
      userType: null,
    };
  },

  async created() {
    const id = this.$route.params.id;
    const type = this.$route.query.type;

    await this.fetchUserDetails(id, `${type}s`);
  },

  computed: {
    ...mapState(useUserStore, {
      client: "client",
      admin: "admin",
    }),
  },

  methods: {
    async fetchUserDetails(globalId, userType) {
      const userStore = useUserStore();
      this.userType = userType;

      console.log(globalId);
      console.log(userType);

      await userStore.fetchUserById(userType, globalId);

      if (userType === "clients") {
        this.selectedUser = userStore.client;
      } else if (userType === "admins") {
        this.selectedUser = userStore.admin;
        console.log(userStore.admin);
      }
    },
  },
};
</script>
