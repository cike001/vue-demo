export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.init()
    },
    paginationReset(refdom) {
      if (refdom) {
        refdom.lastEmittedPage = 1 // 解决多个同一个paginationReset页面不归0问题
      } else {
        const paginationdoms = this.$refs.paginationdom
        if (paginationdoms && paginationdoms.length) {
          for (const ref of paginationdoms) {
            ref.lastEmittedPage = 1
          }
        } else {
          paginationdoms.lastEmittedPage = 1
        }
      }
      this.pagination = {
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0
      }
    }
  }
}
