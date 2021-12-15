"use strict";

var bookClubApp = new Vue({
  el: "#bookClubApp",
  data: {
    spaceId: "cdz6eysa4lme",
    accessToken: "VoJLz9Wgu5ZR_2oKTnQmns2ApuKjUNpAIgNWJr0lMgM",
    booksRaw: "",
    books: "",
    sortorder: "asc",
    sortByField: "readDate",
  },
  created: function created() {},
  mounted: function mounted() {
    var _this = this;
    var client = contentful.createClient({
      space: this.spaceId,
      accessToken: this.accessToken,
    });
    client
      .getEntries()
      .then(function (response) {
        return (_this.booksRaw = response.items);
      })
      .catch(console.error);
  },
  computed: {},
  watch: {
    booksRaw: function booksRaw() {
      this.books = this.booksRaw.map(function (_ref) {
        return _ref.fields;
      });
      this.books.forEach((book) => {
        book.avgGrade = (
          (book.tomasGrade + book.mathiasGrade + book.eriksGrade) /
          3
        ).toFixed(2);

        book.readDate = book.readDate.substring(0, book.readDate.length - 3);
      });
      bookClubApp.sort(this.sortByField);
    },
  },
  methods: {
    sort: function sort(field) {
      if (field !== this.sortByField) {
        this.sortorder = "asc";
        this.sortByField = field;
      } else {
        this.sortorder === "desc"
          ? (this.sortorder = "asc")
          : (this.sortorder = "desc");
      }

      this.books.sort(this.sortBy(field));
    },
    sortBy: function sortBy(property) {
      console.log("sorting");
      var that = this;

      return function (a, b) {
        var varA =
          typeof a[property] === "string"
            ? a[property].toUpperCase()
            : a[property];
        var varB =
          typeof b[property] === "string"
            ? b[property].toUpperCase()
            : b[property];
        var comparison = 0;
        if (varA > varB) comparison = 1;
        else if (varA < varB) comparison = -1;
        return that.sortorder === "desc" ? comparison * -1 : comparison;
      };
    },
  },
});
