const esQryMaker = require("elastic-builder");
const client = require("../../../config/elasticsearch");
const properties = require("../../../config/properties");

const getSearch = async (reqParam) => {
  const { category, keyword, searchSize } = reqParam;
  const body = [];
  const indexNm = properties[category];

  let searchDetail = [];
  if (reqParam.searchDetail === "all") {
    searchDetail = properties.searchField[category][reqParam.searchDetail];
  } else {
    searchDetail.push(reqParam.searchDetail);
  }


  let source = [];
  if (reqParam.source === "all") {
    source = properties.sourceField[category][reqParam.source];
  } else {
    source.push(reqParam.source);
  }

  indexNm.map(index => {

    let sField = [];
    sField = properties.searchField[index][searchDetail];

    const mustQuery = [];
    mustQuery.push(esQryMaker.simpleQueryStringQuery(keyword).fields(searchDetail));

    const sortQuery = [];
    const order = "_score";
    let sort = reqParam.sort;
    sortQuery.push(esQryMaker.sort(order, sort));

    let query = esQryMaker
      .requestBodySearch()
      .trackTotalHits(true)
      .size(searchSize)
      .query(
        esQryMaker
          .boolQuery()
          .must(mustQuery)
      )
      .highlight(
        esQryMaker.highlight('*')
          .preTags("<span class='highlight'>", "*")
          .postTags("</span>", "*")
      )

    query = query.aggregations(
      [
        esQryMaker
          .termsAggregation("aggData1", reqParam.aggField1)
          .size(reqParam.aggCount)
      ]
    );

    query = query.aggregations(
      [
        esQryMaker
          .termsAggregation("aggData2", reqParam.aggField2)
          .size(reqParam.aggCount)
      ]
    );



    // .source(source);
    if (reqParam.source) {
      query = query.source(source);
    }

    // .sorts(sortQuery);
    if (reqParam.sort) {
      query = query.sorts(sortQuery);
    }


    body.push({ index });
    body.push(query);
    // console.log(JSON.stringify(query));
  });


  return await client
    .msearch({
      body
    })
    .then((res) => {
      return res.body.responses
    });
};

const getSearchResult = (getSearchData, reqParam) => {
  const result = {
    totalCount: 0,
    movie: {
      totalCount: 0,
      dataList: [],
      aggData1: [],
      aggData2: [],
    },
  };



  getSearchData.map((data, index) => {
    result.totalCount += data.hits.total.value;
    result[reqParam.category].totalCount = data.hits.total.value; //각 인덱스별 카운트 값


    result[reqParam.category].dataList = data.hits.hits.map(data => {
      //우선 데이터를 result에 넘겨준 후 higtlight 결과값을 이용하여 매칭하여 하이라이팅 기능 수행
      //하이라이트는 보통 특정 필드에만 작업해주지만 현재는 클라이언트가 존재하는 것이 아닌 스터디용이므로 모든 필드에 하이라이팅 작업해줌
      let result = data;


      /**
       * 하이라이팅 추가작업
       */
      if (data.highlight.COMPANY_CD) {
        result._source.COMPANY_CD = result.highlight.COMPANY_CD;
      }
      if (data.highlight.NATION_ALT) {
        result._source.NATION_ALT = result.highlight.NATION_ALT;
      }
      if (data.highlight.REP_NATION_NM) {
        result._source.REP_NATION_NM = result.highlight.REP_NATION_NM;
      }
      if (data.highlight.COMPANY_NM) {
        result._source.COMPANY_NM = result.highlight.COMPANY_NM;
      }
      if (data.highlight.MOVIE_NM) {
        result._source.MOVIE_NM = result.highlight.MOVIE_NM;
      }
      if (data.highlight.OPEN_DT) {
        result._source.OPEN_DT = result.highlight.OPEN_DT;
      }
      if (data.highlight.PRDT_YEAR) {
        result._source.PRDT_YEAR = result.highlight.PRDT_YEAR;
      }
      if (data.highlight.TYPE_NM) {
        result._source.TYPE_NM = result.highlight.TYPE_NM;
      }
      if (data.highlight.MOVIE_NM_EN) {
        result._source.MOVIE_NM_EN = result.highlight.MOVIE_NM_EN;
      }
      if (data.highlight.GENRE_ALT) {
        result._source.GENRE_ALT = result.highlight.GENRE_ALT;
      }
      if (data.highlight.MOVIE_CD) {
        result._source.MOVIE_CD = result.highlight.MOVIE_CD;
      }
      if (data.highlight.REP_GENRE_NM) {
        result._source.REP_GENRE_NM = result.highlight.REP_GENRE_NM;
      }
      if (data.highlight.PRDT_STAT_NM) {
        result._source.PRDT_STAT_NM = result.highlight.PRDT_STAT_NM;
      }
      if (data.highlight.DIRECTORS) {
        result._source.DIRECTORS = result.highlight.DIRECTORS;
      }

      return result;
    });

    result[reqParam.category].aggData1 = data.aggregations.aggData1.buckets; //집계값
    result[reqParam.category].aggData2 = data.aggregations.aggData2.buckets; //집계값

  })
  return result;
}

module.exports = {
  getSearch,
  getSearchResult
};