"use strict";

var bookClubApp = new Vue({
  el: "#bookClubApp",
  data: {
    spaceId: "cdz6eysa4lme",
    accessToken: "VoJLz9Wgu5ZR_2oKTnQmns2ApuKjUNpAIgNWJr0lMgM",
    booksRaw: "",
    booksFixed: "",
    books: "",
    sortorder: "asc",
    sortByField: "readDate",
    showBooksBy: "All",
    showFilter: false,
    fullRoundsOnly: true,
    bookCount: {
      all: "",
      erik: "",
      mathias: "",
      tomas: "",
    },
  },
  created: function created() {},
  mounted: function mounted() {
    var that = this;

    var client = contentful.createClient({
      space: this.spaceId,
      accessToken: this.accessToken,
    });
    client
      .getEntries()
      .then(function (response) {
        return (that.booksRaw = response.items);
      })
      .catch(console.error);
  },
  computed: {
    recievedScore: function () {
      var score = {
        Erik: 0,
        Tomas: 0,
        Mathias: 0,
      };

      this.books.forEach(function (book) {
        if (book.pickedBy === "Erik") {
          score.Erik += book.eriksGrade + book.tomasGrade + book.mathiasGrade;
        } else if (book.pickedBy === "Tomas") {
          score.Tomas += book.eriksGrade + book.tomasGrade + book.mathiasGrade;
        } else if (book.pickedBy === "Mathias") {
          score.Mathias +=
            book.eriksGrade + book.tomasGrade + book.mathiasGrade;
        }
      });
      return this.sortByValue(score);
    },
    recievedScoreNotSelf: function () {
      var score = {
        Erik: 0,
        Tomas: 0,
        Mathias: 0,
      };

      this.books.forEach(function (book) {
        if (book.pickedBy === "Erik") {
          score.Erik += book.tomasGrade + book.mathiasGrade;
        } else if (book.pickedBy === "Tomas") {
          score.Tomas += book.eriksGrade + book.mathiasGrade;
        } else if (book.pickedBy === "Mathias") {
          score.Mathias += book.tomasGrade + book.mathiasGrade;
        }
      });
      return this.sortByValue(score);
    },
    givenScores: function () {
      var score = {
        Erik: 0,
        Tomas: 0,
        Mathias: 0,
      };

      this.books.forEach(function (book) {
        score.Erik += book.eriksGrade;
        score.Tomas += book.tomasGrade;
        score.Mathias += book.mathiasGrade;
      });
      return this.sortByValue(score);
    },
    givenScoresOwnBooks: function () {
      var score = {
        Erik: 0,
        Tomas: 0,
        Mathias: 0,
      };

      this.books.forEach(function (book) {
        if (book.pickedBy === "Erik") {
          score.Erik += book.eriksGrade;
        } else if (book.pickedBy === "Tomas") {
          score.Tomas += book.tomasGrade;
        } else if (book.pickedBy === "Mathias") {
          score.Mathias += book.mathiasGrade;
        }
      });
      return this.sortByValue(score);
    },
    pages: function () {
      var pages = {
        Erik: 0,
        Tomas: 0,
        Mathias: 0,
      };

      this.books.forEach(function (book) {
        if (book.pickedBy === "Erik") {
          pages.Erik += book.pages;
        } else if (book.pickedBy === "Tomas") {
          pages.Tomas += book.pages;
        } else if (book.pickedBy === "Mathias") {
          pages.Mathias += book.pages;
        }
      });
      return this.sortByValue(pages);
    },
  },
  watch: {
    showBooksBy: function () {
      this.books = this.booksFixed;
      var that = this;
      this.books = this.booksFixed.filter(function (_ref) {
        if (_ref.pickedBy === that.showBooksBy) {
          return _ref;
        } else if (that.showBooksBy === "All") {
          return _ref;
        }
      });
    },
    booksRaw: function booksRaw() {
      this.booksFixed = this.booksRaw.map(function (_ref) {
        return _ref.fields;
      });
      this.booksFixed.forEach(function (book) {
        book.avgGrade = (
          (book.tomasGrade + book.mathiasGrade + book.eriksGrade) /
          3
        ).toFixed(2);
        book.readDate = book.readDate.substring(0, book.readDate.length - 3);
      });

      this.books = this.booksFixed;
      bookClubApp.sort(this.sortByField);
    },
    booksFixed: function books() {
      this.bookCount.erik = this.booksFixed.filter(function (val) {
        return val.pickedBy === "Erik";
      }).length;
      this.bookCount.tomas = this.booksFixed.filter(function (val) {
        return val.pickedBy === "Tomas";
      }).length;
      this.bookCount.mathias = this.booksFixed.filter(function (val) {
        return val.pickedBy === "Mathias";
      }).length;
      this.bookCount.all =
        this.bookCount.erik + this.bookCount.tomas + this.bookCount.mathias;
    },
  },
  methods: {
    sortByValue: function sortByValue(obj) {
      var sortable = [];

      for (var name in obj) {
        sortable.push([name, obj[name]]);
      }

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
      var objSorted = {};
      sortable.forEach(function (item) {
        objSorted[item[0]] = item[1];
      });
      return objSorted;
    },
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
