<template>
  <v-app dark>
    <v-navigation-drawer
      class="primary white--text pt-14"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          class="white--text px-6"
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar class="white" elevation="0" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-img
        src="/images/travisor-logo.png"
        alt="Travisor Logo"
        :max-width="200"
      />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-spacer />

      <!-- Admin profile -->
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="pa-0 ma-0" fluid>
        <Nuxt class="pa-0" fluid />
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <!-- Additional items here -->
      </v-list>
    </v-navigation-drawer>

    <v-footer class="d-flex justify-center primary white--text" fixed app>
      <span
        >Copyright &copy; {{ new Date().getFullYear() }} Travisor.com All Rights
        Reserved.
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { useAuthStore } from "~/store/auth";

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: "mdi-shape",
          title: "Dashboard",
          to: "/",
        },
        {
          icon: "mdi-account",
          title: "User",
          to: "/user",
        },
        {
          icon: "mdi-folder-multiple",
          title: "Category",
          to: "/category",
        },
        {
          icon: "mdi-map-legend",
          title: "Destination",
          to: "/destination",
        },
        {
          icon: "mdi-post",
          title: "Blog",
          to: "/blog",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    };
  },

  methods: {
    async logout() {
      const authStore = useAuthStore(this.$pinia);
      try {
        await authStore.logout();
        this.$router.push("/login");
      } catch (e) {
        this.error = e.response.data.error;
      }
    },
  },
};
</script>
