<template>
  <user-form :title="'Add Admin'" :apiUrl="'admins'"> </user-form>
</template>

<script>
import UserForm from "~/components/UserForm.vue";
import { useUserStore } from "~/store/user";

export default {
  name: "AddUserPage",
  components: {
    UserForm,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
};
</script>
