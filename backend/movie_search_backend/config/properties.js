const properties = {
  movie: ["movie"],
  searchField: {
    movie: {
      all: [
        "MOVIE_CD",
        "MOVIE_NM^5",
        "MOVIE_NM_EN^3",
        "TYPE_NM^2",
        "PRDT_STAT_NM^2",
        "NATION_ALT^2",
        "GENRE_ALT",
        "REP_NATION_NM^2",
        "REP_GENRE_NM^2",
        "DIRECTORS^3",
        "COMPANY_CD^2",
        "COMPANY_NM^2"
      ]
    }
  },
  sourceField: {
    movie: {
      all : ["MOVIE_CD", "MOVIE_NM", "MOVIE_NM_EN", "PRDT_YEAR", "OPEN_DT", "TYPE_NM", "PRDT_STAT_NM", "NATION_ALT", "GENRE_ALT", "REP_NATION_NM", "REP_GENRE_NM", "DIRECTORS", "COMPANY_CD", "COMPANY_NM"]
    },
  }
}

module.exports = properties;