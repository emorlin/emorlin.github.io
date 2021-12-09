var bookClubApp = new Vue({
  el: "#bookClubApp",

  data: {
    spaceId: "cdz6eysa4lme",
    accessToken: "VoJLz9Wgu5ZR_2oKTnQmns2ApuKjUNpAIgNWJr0lMgM",
    booksRaw: "",
    books: "",
  },
  created: function () {},
  mounted: function () {
    const client = contentful.createClient({
      space: this.spaceId,
      accessToken: this.accessToken,
    });

    client
      .getEntries()
      .then((response) => (this.booksRaw = response.items))
      .catch(console.error);
  },
  computed: {},
  watch: {
    booksRaw: function () {
      this.books = this.booksRaw.map(({ fields }) => fields);
      bookClubApp.sort("readDate");
    },
  },
  methods: {
    sort: function (field) {
      this.books.sort(this.sortBy(field));
    },

    sortBy: function (property, order) {
      console.log("sorting");
      if (typeof order === "undefined") order = "asc";

      return function (a, b) {
        const varA =
          typeof a[property] === "string"
            ? a[property].toUpperCase()
            : a[property];
        const varB =
          typeof b[property] === "string"
            ? b[property].toUpperCase()
            : b[property];

        let comparison = 0;
        if (varA > varB) comparison = 1;
        else if (varA < varB) comparison = -1;
        return order === "desc" ? comparison * -1 : comparison;
      };
    },
  },
});
