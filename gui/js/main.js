"use strict";

var bookClubApp = new Vue({
  el: "#bookClubApp",
  data: {
    spaceId: "cdz6eysa4lme",
    accessToken: "VoJLz9Wgu5ZR_2oKTnQmns2ApuKjUNpAIgNWJr0lMgM",
    booksRaw: "",
    books: ""
  },
  created: function created() {},
  mounted: function mounted() {
    var _this = this;

    var client = contentful.createClient({
      space: this.spaceId,
      accessToken: this.accessToken
    });
    client.getEntries().then(function (response) {
      return _this.booksRaw = response.items;
    }).catch(console.error);
  },
  computed: {},
  watch: {
    booksRaw: function booksRaw() {
      this.books = this.booksRaw.map(function (_ref) {
        var fields = _ref.fields;
        return fields;
      });
      bookClubApp.sort("readDate");
    }
  },
  methods: {
    sort: function sort(field) {
      this.books.sort(this.sortBy(field));
    },
    sortBy: function sortBy(property, order) {
      console.log("sorting");
      if (typeof order === "undefined") order = "asc";
      return function (a, b) {
        var varA = typeof a[property] === "string" ? a[property].toUpperCase() : a[property];
        var varB = typeof b[property] === "string" ? b[property].toUpperCase() : b[property];
        var comparison = 0;
        if (varA > varB) comparison = 1;else if (varA < varB) comparison = -1;
        return order === "desc" ? comparison * -1 : comparison;
      };
    }
  }
});
