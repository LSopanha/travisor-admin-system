<template>
  <v-container class="pa-0 mb-16" fluid>
    <v-col cols="12" class="pa-0 d-flex justify-end">
      <div class="my-2">
        <v-btn
          class="white text-capitalize font-weight-bold pb-2"
          v-show="showAdd"
          @click="onAddClick"
          small
          elevation="0"
        >
          <v-icon color="primary" class="mr-1" dark> mdi-plus-circle </v-icon>
          <span class="font-size-16">Add {{ title }}</span>
        </v-btn>
      </div>
    </v-col>

    <div>
      <v-card elevation="2" class="pa-0 rounded-xl" outlined>
        <v-data-table
          :headers="headers"
          :items="items"
          loading-text="Loading... Please wait."
          item-key="id"
        >
          <template v-slot:item="{ item }">
            <v-tooltip bottom v-show="showActivate" v-if="item.active === 1">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onDeactivateClick(item.global_id)"
                  class="mx-1"
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-check
                </v-icon>
              </template>
              <span>Activate</span>
            </v-tooltip>
            <v-tooltip
              bottom
              v-show="showDeactivate"
              v-else-if="item.active === 0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onActivateClick(item.global_id)"
                  class="mx-1"
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-off
                </v-icon>
              </template>
              <span>Deactivate</span>
            </v-tooltip>

            <v-tooltip bottom v-show="showAuthorize" v-if="item.ban === 0">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onBanClick(item.global_id)"
                  class="mx-1"
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-key
                </v-icon>
              </template>
              <span>Authorize</span>
            </v-tooltip>
            <v-tooltip bottom v-show="showBan" v-else-if="item.ban === 1">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onAuthorizeClick(item.global_id)"
                  class="mx-1"
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-remove
                </v-icon>
              </template>
              <span>Ban</span>
            </v-tooltip>
            <v-tooltip bottom v-if="showEdit">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onEditClick(item.global_id)"
                  class="mx-1"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom v-if="showInvoice">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onInvoiceClick(item.global_id)"
                  class="mx-1"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-invoice-list-outline
                </v-icon>
              </template>
              <span>Invoice</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },

    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  computed: {
    headersWithActions() {
      return [
        ...this.headers,
        { text: "Actions", value: "actions", sortable: false },
      ];
    },
    showAdd() {
      return !!this.$listeners["add-click"];
    },
    showEdit() {
      return !!this.$listeners["edit-click"];
    },
    showInvoice() {
      return !!this.$listeners["invoice-click"];
    },
    showDeactivate() {
      return !!this.$listeners["deactivate-click"];
    },
    showActivate() {
      return !!this.$listeners["activate-click"];
    },
    showBan() {
      return !!this.$listeners["ban-click"];
    },
    showAuthorize() {
      return !!this.$listeners["authorize-click"];
    },
  },
  methods: {
    onAddClick() {
      this.$emit("add-click");
    },
    onEditClick(id) {
      this.$emit("edit-click", id);
    },
    onInvoiceClick(id) {
      this.$emit("invoice-click", id);
    },
    onDeactivateClick(id) {
      this.$emit("deactivate-click", id);
    },
    onActivateClick(id) {
      this.$emit("activate-click", id);
    },
    onBanClick(id) {
      this.$emit("ban-click", id);
    },
    onAuthorizeClick(id) {
      this.$emit("authorize-click", id);
    },
  },
};
</script>
