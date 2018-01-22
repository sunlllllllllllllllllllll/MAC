import api from '../api/search'
import {getCookie} from '../../utils/cookie'
import router from '../../router/index'
import {
  knowledgeItem,
  bookItem,
  projectItem,
  engineerItem,
  mediaItem,
  contextItem,
  requirementItem,
  literatureItem,
  bookChapterItem,
} from '../objectDeclare'

const state = {
  searchStatus: false,
  serverPic: 'http://118.178.238.202:9988/',
  allPageBookList: [],//搜索'全部'的时候图书的列表
  allChapterList: [],//搜索'全部'的时候图书章节的列表
  allPageProjectList: [
    {
      children: []
    },
    {
      children: []
    },
    {
      children: []
    }
  ],//搜索'全部'的时候工程的列表
  allPageEngineerList: [
    {
      children: []
    },
    {
      children: []
    },
    {
      children: []
    }
  ],//搜索'全部'的时候工程师的列表
  allPageMediaList: [
    {
      children: []
    },
    {
      children: []
    },
    {
      children: []
    }
  ],//搜索'全部'的时候多媒体的列表
  allPageRequirementList: [],//搜索'全部'的时候企业需求的列表
  allPageLiteratureList: [],//搜索'全部'的时候文献的列表
  allPageKnowledgeList: [],//搜索'全部'的时候文献的列表

  bookList: [],//搜索图书列表
  literatureList: [],
  bookTotal: '',
  hybridEngineerList: [],
  hybridProjectList: [],
  hybridLiteratureList: [],
}

const getters = {}
const actions = {
  searchAll ({commit}, data) {
    let promise = api.searchAll(data)
    let userInfo = getCookie('userInfo')
    if(userInfo){
      let promise1 = api.getUserFavoriteBooks()
      Promise.all([promise, promise1]).then(function (resp) {
        router.push('/search/result')
        commit('searchAll', resp[0].data.data)
        //发送到leftPanel.js中去
        commit('setAllPageLeftPanel', resp[0].data.data)
        let tt = []
        for (var i = 0; i < resp[1].data.length; i++) {
          tt.push(resp[1].data[i]._id)
        }
        commit('setAllPageBookFav', tt)
      })
    } else {
      promise.then((response) => {
        router.push('/search/result')
        commit('searchAll',response.data.data)
        //发送到leftPanel.js中去
        commit('setAllPageLeftPanel', response.data.data)
      }, (response) => {
        console.log('error')
      })
    }

  },
  searchBook ({commit}, data) {
    let promise = api.searchBook(data)
    let promise1 = api.getUserFavoriteBooks(data)
    Promise.all([promise, promise1]).then(function (resp) {
      commit('searchBook', resp[0].data)
      let d = resp[0].data.hits
      let favList = resp[1].data
      let ll = []
      for (var i = 0; i < favList.length; i++) {
        ll.push(favList[i]._id)
      }
      console.log(ll)
      commit('setPaginatorTotal', resp[0].data.total)
      commit('setPaginatorRows', 10)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        context.chiefEditor = d[i]._source.chiefEditor
        context.type = '图书'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = 'http://118.178.238.202:9988/' + d[i]._source.cover
        context.keywords = d[i]._source.keywords
        var stt = ''
        console.log(d[i].hasOwnProperty('highlight'))
        if (d[i].hasOwnProperty('highlight')) {
          var bdd = d[i].highlight.summary
          for (var j = 0; j < bdd.length; j++) {
            stt = stt + bdd[j]
          }
          context.highlight = stt
        } else {
          context.highlight = d[i]._source.summary
        }
        if (ll.indexOf(d[i]._id) > 0) {
          context.isFavorited = true
        } else {
          context.isFavorited = false
        }
        temp.push(context)
      }
      commit('setSearchContextData', temp)
    })

  },
  searchProject ({commit}, data) {
    let promise = api.searchProject(data)
    promise.then((response) => {
      commit('searchProject', response.data)
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = d[i]._source.cover
        media.description = d[i]._source.summary
        media.title = d[i]._source.title
        media.clicks = d[i]._source.clicks
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setSearchMediaTotal', response.data.total)
      commit('setPaginatorRows', 9)
    }, (response) => {

    })
  },
  searchEngineer ({commit}, data) {
    let promise = api.searchEngineer(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = d[i]._source.avagtar
        media.description = d[i]._source.summary
        media.title = d[i]._source.name
        media.clicks = d[i]._source.clicks
        media.id = d[i]._id
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setSearchMediaTotal', response.data.total)
      commit('setPaginatorRows', 9)
    }, (response) => {

    })
  },
  searchMedia ({commit}, data) {
    let promise = api.searchMedia(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.url = 'http://118.178.238.202:9988/' + d[i]._source.url
        media.description = d[i]._source.description
        media.title = d[i]._source.title
        media.clicks = d[i]._source.clicks
        media.id = d[i]._id
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setSearchMediaTotal', response.data.total)
      commit('setPaginatorRows', 9)
    }, (response) => {

    })
  },
  searchRequirement ({commit}, data) {
    let promise = api.searchRequirement(data)
    promise.then((response) => {
      // TODO:  企业需求现在没有数据
      let d = response.data.hits
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        context.type = '企业需求'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.createdAt
        context.cover = ''
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.content
        temp.push(context)
      }
      let total = response.data.total
      commit('setPaginatorTotal', total)
      commit('setPaginatorRows', 10)
      commit('setSearchContextData', temp)
    }, (response) => {

    })
  },
  searchLiteriture ({commit}, data) {
    let promise = api.searchLiteriture(data)
    promise.then((response) => {
      commit('searchLiteriture', response.data)
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      commit('setPaginatorRows', 10)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.chiefEditor = ''
        context.type = '工程文献'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.createdAt
        context.cover = d[i]._source.cover
        context.keywords = d[i]._source.categories
        if (d[i].hasOwnProperty('highlight')) {
          var tt = ''
          var dd = d[i].highlight.content
          for (var j = 0; j < dd.length; j++) {
            tt = tt + dd[j]
          }
          context.highlight = tt
        } else {
          context.highlight = d[i]._source.summary
        }
        temp.push(context)
      }
      commit('setSearchContextData', temp)
    }, (response) => {

    })
  },
  searchExpertPatent ({commit}, data) {
    let promise = api.searchExpertPatent(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      commit('setPaginatorRows', 10)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.chiefEditor = ''
        if (d[i]._type === 'experts') {
          context.type = '专家'
        } else {
          context.type = '专利'
        }
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.createdAt
        context.cover = d[i]._source.avatar
        context.keywords = d[i]._source.categories
        if (d[i].hasOwnProperty('highlight')) {
          var tt = ''
          var hdd = d[i].highlight.intro
          for (var j = 0; j < hdd.length; j++) {
            tt = tt + hdd[j]
          }
          context.highlight = tt
        } else {
          context.highlight = d[i]._source.intro
        }
        temp.push(context)
      }
      commit('setSearchContextData', temp)
    }, (response) => {

    })
  },
  searchBookLeftPanel ({commit}, data) {
    let p = {
      searchContent: data.searchContent,
      keywords: data.keywords,
    }
    let promise1 = api.searchBookClcs(p)
    let promise2 = api.searchBookSublibs(p)
    let promise3 = api.searchBookChapter(p)
    let promise4 = api.searchBook(p)
    Promise.all([promise1, promise2, promise3, promise4]).then(function (resp) {
      commit('setLeftPanelClickBookCategory', resp)
    })
  },
  searchProjectLeftPanel ({commit}, data) {
    let promise1 = api.searchProjectEra(data)
    let promise2 = api.searchProjectArea(data)
    Promise.all([promise1, promise2]).then(function (resp) {
      commit('setLeftPanelClickProject', resp)
    })
  },
  searchBookClcsDataList ({commit}, data) {
    let promise = api.searchBookClcsDataList(data)
    promise.then((response) => {
      let d = response.data.hits.hits
      let total = response.data.hits.total
      commit('setPaginatorTotal', total)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        context.chiefEditor = d[i]._source.chiefEditor
        context.type = '图书'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = 'http://118.178.238.202:9988/' + d[i]._source.cover
        context.keywords = d[i]._source.keywords
        context.highlight = d[i]._source.summary
        temp.push(context)
      }
      commit('setSearchContextData', temp)
    }, (response) => {

    })
  },
  searchBookChapterDataList ({commit}, data) {
    let promise = api.searchBookChapter(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        context.type = '图书章节'
        context.name = d[i]._source.name
        context.pdf = d[i]._source.pdf
        for (var jj = 0; jj < d[i].highlight.content.length; jj++) {
          context.highlight += d[i].highlight.content[jj]
        }
        temp.push(context)
      }
      commit('setSearchContextData', temp)
    }, (response) => {

    })
  },
  searchBookSublibsDataList ({commit}, data) {
    let promise = api.searchBookSublibsDataList(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      commit('setPaginatorTotal', total)
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        context.chiefEditor = d[i]._source.chiefEditor
        context.type = '图书'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = 'http://118.178.238.202:9988/' + d[i]._source.cover
        context.keywords = d[i]._source.keywords
        context.keywords = d[i]._source.keywords
        temp.push(context)
      }
      commit('setSearchContextData', temp)
    }, (response) => {

    })
  },
  searchEngineerLeftPanel ({commit}, data) {
    let promise1 = api.searchEngineerEraDataList(data)
    promise1.then((response) => {
    }, (response) => {

    })
    let promise2 = api.searchEngineerTradesDataList(data)
    promise2.then((response) => {

    }, (response) => {

    })
    Promise.all([promise1, promise2]).then(function (resp) {
      commit('setLeftPanelClickEngineerCategory', resp)
    })
  },
  searchRequirementLeftPanel ({commit}, data) {
    let promise1 = api.searchRequirementProvinceDataList(data)
    let promise2 = api.searchRequirementWayDataList(data)
    Promise.all([promise1, promise2]).then(function (resp) {
      commit('setLeftPanelClickRequirementCategory', resp)
    })
  },
  searchMediaLeftPanel ({commit}, data) {
    let promise = api.searchMediaDataList(data)
    promise.then((response) => {
      commit('setLeftPanelClickMediaCategorys', response.data)
    }, (response) => {

    })
  },
  searchLiteratureLeftPanel ({commit}, data) {
    let promise1 = api.searchLiteratureEraDataList(data)
    let promise2 = api.searchLiteratureCategoryDataList(data)
    Promise.all([promise1, promise2]).then(function (resp) {
      commit('setLeftPanelClickLiterature', resp)
    })
  },
  searchKnowledgeLeftPanel ({commit}, data) {
    let promise = api.searchKnowledgeCategoryDataList(data)
    promise.then((response) => {
      commit('setLeftPanelClickKnowledgeCategorys', response.data)
    }, (response) => {

    })
  },
  searchProjectEraChild ({commit}, data) {
    let promise = api.searchProjectEraChild(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = d[i]._source.cover
        media.title = d[i]._source.title
        media.description = d[i]._source.summary
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
    }, (response) => {

    })
  },
  searchProjectAreaChild ({commit}, data) {
    let promise = api.searchProjectAreaChild(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = d[i]._source.cover
        media.title = d[i]._source.title
        media.description = d[i]._source.summary
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
    }, (response) => {
    })
  },
  searchEngineerEraChild ({commit}, data) {
    let promise = api.searchEngineerEraChild(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = d[i]._source.avagtar
        media.title = d[i]._source.name
        media.description = d[i]._source.summary
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
      commit('setPaginatorRows', 9)
    }, (response) => {

    })
  },
  searchEngineerTradeChild ({commit}, data) {
    let promise = api.searchEngineerTradeChild(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = d[i]._source.avagtar
        media.title = d[i]._source.name
        media.description = d[i]._source.summary
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
      commit('setPaginatorRows', 9)
    }, (response) => {

    })
  },
  searchBookchart ({commit}, data) {
    let promise = api.searchBookchart(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = 'http://118.178.238.202:9988/' + d[i]._source.url
        media.title = d[i]._source.title
        media.description = d[i]._source.description
        media.clicks = d[i]._source.clicks
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
    }, (response) => {

    })
  },
  searchBookformula ({commit}, data) {
    let promise = api.searchBookformula(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = 'http://118.178.238.202:9988/' + d[i]._source.url
        media.title = d[i]._source.title
        media.description = d[i]._source.description
        media.clicks = d[i]._source.clicks
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
    }, (response) => {

    })
  },
  searchBookimage ({commit}, data) {
    let promise = api.searchBookimage(data)
    promise.then((response) => {
      let d = response.data.hits
      let total = response.data.total
      let temp = []
      for (var i = 0; i < d.length; i++) {
        var media = new mediaItem()
        media.id = d[i]._id
        media.url = 'http://118.178.238.202:9988/' + d[i]._source.url
        media.title = d[i]._source.title
        media.description = d[i]._source.description
        media.clicks = d[i]._source.clicks
        temp.push(media)
      }
      commit('setSearchMediaData', temp)
      commit('setPaginatorTotal', total)
    }, (response) => {

    })
  },
  searchRequirementProvinceChild ({commit}, data) {
    let promise = api.searchRequirementProvinceChild(data)
    promise.then((response) => {
      let d = response.data.hits
      var temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        // context.chiefEditor = d[i]._source.chiefEditor
        context.type = '企业需求'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = ''
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.content
        temp.push(context)
      }
      commit('setSearchContextData', temp)
      commit('setPaginatorTotal', response.data.total)
    }, (response) => {

    })
  },
  searchRequirementWayChild ({commit}, data) {
    let promise = api.searchRequirementWayChild(data)
    promise.then((response) => {
      let d = response.data.hits
      var temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        // context.chiefEditor = d[i]._source.chiefEditor
        context.type = '企业需求'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = ''
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.content
        temp.push(context)
      }
      commit('setSearchContextData', temp)
      commit('setPaginatorTotal', response.data.total)
    }, (response) => {

    })
  },
  searchLiteratureEraChild ({commit}, data) {
    let promise = api.searchLiteratureEraChild(data)
    promise.then((response) => {
      let d = response.data.hits
      var temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        // context.chiefEditor = d[i]._source.chiefEditor
        context.type = '工程文献'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = ''
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.content
        temp.push(context)
      }
      commit('setSearchContextData', temp)
      commit('setPaginatorTotal', response.data.total)
    }, (response) => {

    })
  },
  searchLiteratureCategoryChild ({commit}, data) {
    let promise = api.searchLiteratureCategoryChild(data)
    promise.then((response) => {
      let d = response.data.hits
      var temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        // context.chiefEditor = d[i]._source.chiefEditor
        context.type = '工程文献'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = ''
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.content
        temp.push(context)
      }
      commit('setSearchContextData', temp)
      commit('setPaginatorTotal', response.data.total)
    }, (response) => {

    })
  },
  searchExpertChild ({commit}, data) {
    let promise = api.searchExpertChild(data)
    promise.then((response) => {
      let d = response.data.hits
      var temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        // context.chiefEditor = d[i]._source.chiefEditor
        context.type = '专家'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = d[i]._source.avatar
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.intro
        temp.push(context)
      }
      commit('setSearchContextData', temp)
      commit('setPaginatorTotal', response.data.total)
    }, (response) => {

    })
  },
  searchPatentChild ({commit}, data) {
    let promise = api.searchPatentChild(data)
    promise.then((response) => {
      let d = response.data.hits
      var temp = []
      for (var i = 0; i < d.length; i++) {
        var context = new contextItem()
        context.id = d[i]._id
        // context.chiefEditor = d[i]._source.chiefEditor
        context.type = '专利'
        context.name = d[i]._source.name
        context.publishedAt = d[i]._source.publishedAt
        context.cover = ''
        context.keywords = d[i]._source.categories
        context.highlight = d[i]._source.content
        temp.push(context)
      }
      commit('setSearchContextData', temp)
      commit('setPaginatorTotal', response.data.total)
    }, (response) => {

    })
  },
  getUserFavoriteBooks ({commit}, data) {
    let promise = api.getUserFavoriteBooks(data)
    promise.then((response) => {

    }, (response) => {

    })
  },
  addUserFavoriteBooks ({commit}, data) {
    let promise = api.addUserFavoriteBooks(data)
    promise.then((response) => {
      if (response.data.hasOwnProperty('success')) {
        alert('收藏成功')
        commit('addUserFavoriteBooks', data)
        commit('baddUserFavoriteBooks', data)
      }
    }, (response) => {
      alert('请先登录')
    })
  },
  removeUserFavoriteBooks ({commit}, data) {
    let promise = api.removeUserFavoriteBooks(data)
    promise.then((response) => {
      if (response.data.hasOwnProperty('success')) {
        alert('取消成功')
        commit('removeUserFavoriteBooks', data)
        commit('bremoveUserFavoriteBooks', data)
      }
    }, (response) => {

    })
  },
  searchHybrid ({commit}, data) {
    let promise = api.searchHybrid(data)
    promise.then((response) => {
      console.log(response)
      commit('searchHybrid', response.data)
    }, (response) => {

    })
  }

}

const mutations = {
  setSearchState (state, data) {
    state.searchStatus = data
  },
  setAllPageBookFav (state, data) {
    for (var i = 0; i < state.allPageBookList.length; i++) {
      if (data.indexOf(state.allPageBookList[i].id) > -1) {
        state.allPageBookList[i].isFavorited = true
      }
    }
  },
  searchAll (state, data) {
    state.allPageBookList = []
    let a = data.bookData
    for (var i = 0; i < a.length; i++) {
      let b = new bookItem()
      b.publisher = a[i]._source.publisher
      b.chiefEditor = a[i]._source.chiefEditor
      b.isbn = a[i]._source.isbn
      b.name = a[i]._source.name
      b.id = a[i]._id
      b.keywords = a[i]._source.keywords
      b.publishedAt = a[i]._source.publishedAt
      if (a[i].hasOwnProperty('highlight')) {
        var stt = ''
        let bbd = a[i].highlight.summary
        for (var j = 0; j < bbd.length; j++) {
          stt = stt + bbd[j]
        }
        b.highlight = stt
      } else {
        b.highlight = ''
      }
      b.cover = a[i]._source.cover
      state.allPageBookList.push(b)
    }
    state.allChapterList = []
    let tts = data.bookChapterData
    for (var i = 0; i < tts.length; i++) {
      var chapter = new bookChapterItem()
      chapter.title = tts[i]._source.title
      chapter.pdf = tts[i]._source.pdf
      chapter.id = tts[i]._id
      let dd_ = tts[i].highlight.content
      var sst = ''
      for (var j = 0; j < dd_.length; j++) {
        sst += dd_[j]
      }
      chapter.content = sst
      state.allChapterList.push(chapter)
    }
    let b = data.projectData
    state.allPageProjectList = [
      {
        children: []
      },
      {
        children: []
      },
      {
        children: []
      }
    ]
    var temp = []
    for (var i = 0; i < b.length; i++) {
      var project = new projectItem()
      project.title = b[i]._source.title
      project.summary = b[i]._source.summary
      project.cover = b[i]._source.cover
      project.highlight = b[i].highlight.content[0]
      project.id = b[i]._id
      temp.push(project)
    }
    for (var i = 0; i < state.allPageProjectList.length; i++) {
      state.allPageProjectList[i].children = temp.slice(3 * i, 3 * (i + 1))
    }
    let c = data.engineerData
    state.allPageEngineerList = [
      {
        children: []
      },
      {
        children: []
      },
      {
        children: []
      }
    ]
    var temp = []
    for (var i = 0; i < c.length; i++) {
      var engineer = new engineerItem()
      engineer.id = c[i]._id
      engineer.name = c[i]._source.name
      engineer.avatar = c[i]._source.avagtar
      let stt = ''
      if (c[i].hasOwnProperty('highlight')) {
        let bbd = c[i].highlight.summary
        for (var j = 0; j < bbd.length; j++) {
          stt = stt + bbd[j]
        }
        engineer.summary = stt
      } else {
        engineer.summary = ''
      }
      temp.push(engineer)
    }
    for (var i = 0; i < state.allPageEngineerList.length; i++) {
      state.allPageEngineerList[i].children = temp.slice(3 * i, 3 * (i + 1))
    }
    let d = data.mediaData
    state.allPageMediaList = [
      {
        children: []
      },
      {
        children: []
      },
      {
        children: []
      }
    ]
    var temp = []
    for (var i = 0; i < d.length; i++) {
      var media = new mediaItem()
      media.url = d[i]._source.url
      media.description = d[i]._source.description
      media.title = d[i]._source.title
      temp.push(media)
    }
    for (var i = 0; i < state.allPageMediaList.length; i++) {
      state.allPageMediaList[i].children = temp.slice(3 * i, 3 * (i + 1))
    }

    let e = data.requirementData
    state.allPageRequirementList = []
    for (var i = 0; i < e.length; i++) {
      var requirement = new requirementItem()
      requirement.name = e[i]._source.name
      requirement.province = e[i]._source.province
      requirement.city = e[i]._source.city
      requirement.requirement = e[i]._source.requirement
      requirement.content = e[i]._source.content
      requirement.createdAt = e[i]._source.createdAt
      requirement.keywords = e[i]._source.categories
      state.allPageRequirementList.push(requirement)
    }
    let f = data.literatureData
    state.allPageLiteratureList = []
    for (var i = 0; i < f.length; i++) {
      var literature = new literatureItem()
      literature.id = f[i]._id
      literature.name = f[i]._source.name
      literature.cover = f[i]._source.cover
      var stt = ''
      var bbd = f[i].highlight.summary
      for (var j = 0; j < bbd.length; j++) {
        stt = stt + bbd[j]
      }
      literature.summary = stt
      literature.createdAt = f[i]._source.createdAt
      state.allPageLiteratureList.push(literature)
    }
    let g = data.expertPatentData
    state.allPageKnowledgeList = []
    for (var i = 0; i < g.length; i++) {
      var knowledge = new knowledgeItem()
      if (g[i]._type === 'experts') {
        knowledge.type = '专家'
      } else {
        knowledge.type = '专利'
      }
      knowledge.name = g[i]._source.name
      knowledge.cover = g[i]._source.avatar
      knowledge.summary = g[i]._source.experience
      knowledge.createdAt = g[i]._source.createdAt
      state.allPageKnowledgeList.push(knowledge)
    }
  },
  searchBook (state, data) {

  },
  searchProject (state, data) {

  },
  searchEngineer (state, data) {},
  searchMedia (state, data) {},
  searchRequirement (state, data) {},
  searchLiteriture (state, data) {

  },
  searchExpert (state, data) {},
  searchPatent (state, data) {},
  baddUserFavoriteBooks (state, data) {
    for (var i = 0; i < state.allPageBookList.length; i++) {
      if (data.bookId === state.allPageBookList[i].id) {
        state.allPageBookList[i].isFavorited = true
      }
    }
  },
  bremoveUserFavoriteBooks (state, data) {
    for (var i = 0; i < state.allPageBookList.length; i++) {
      if (data.bookId === state.allPageBookList[i].id) {
        state.allPageBookList[i].isFavorited = false
      }
    }
  },
  searchHybrid (state, data) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
