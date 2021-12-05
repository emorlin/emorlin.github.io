var bookClubApp = new Vue({
  el: "#bookClubApp",

  data: {
    spaceId: "cdz6eysa4lme",
    accessToken: "VoJLz9Wgu5ZR_2oKTnQmns2ApuKjUNpAIgNWJr0lMgM",
    books:""
  },
  created: function () {},
  mounted: function () {
    const client = contentful.createClient({
      space: this.spaceId,
      accessToken: this.accessToken,
    });

    client
      .getEntries()
      .then((response) =>  this.books=response.items)
      .catch(console.error);
  },
  computed: {},
  watch: {},
  methods: {},
});
