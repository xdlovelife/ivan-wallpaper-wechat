// 定义全局对象
var app = getApp();

Page({
  
  data: {
    records: [],          // 存储分页数据
    page: 1,              // 当前页码
    limit: 20,         // 每页条数
    noMoreData: false,     // 是否还有更多数据
    isLoading: false,
    userInfo: {} as any,  // 用户信息
    uid: ''               // 用户ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
    this.loadRecords();  // 页面加载时获取第一页数据
  },

  // 加载记录数据
  loadRecords: function () {
    if (this.data.noMoreData) return;

    let page = this.data.page

    // 初次加载
    if (page == 1) {
      this.setData({
        isLoading: true, 
        noMoreData: false
      })
    }    

    wx.showLoading({
      title: '加载中'
    });

    wx.request({
      url: `${app.globalData.baseURL}/manager/sys/user/point-record/page`,
      method: 'POST',
      data: {
        uid: this.data.uid,
        page: page,
        limit: this.data.limit
      },
      header: {
        'Authorization': this.data.userInfo.accessToken,
        'content-type': 'application/json'
      },
      success: res => {
        if (res.statusCode === 200 && res.data.code === 0) {
          // console.log('data', res.data.data.records);
          
          if(res.data.data.records.length === 0){
            this.setData({
              isLoading: false, 
              noMoreData: true
            });
          } else {
            const newRecords = res.data.data.records.map(record => ({
              content: record.content,
              points: record.points,
              type: record.type,
              createTime: record.createTime
            }));
  
            page++
  
            // 合并新数据
            this.setData({
              records: [...this.data.records, ...newRecords],
              noMoreData: newRecords.length === this.data.limit, // 判断是否还有更多数据
              page: page
            });

            if (res.data.data.records.length < this.data.limit) {
              this.setData({
                isLoading: false,
                noMoreData: true
              });
            }
          } 
        }
      },
      fail: err => {
        console.error('请求失败:', err);
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 加载更多数据
  // loadMoreRecords: function () {
  //   if (this.data.noMoreData) {
  //     this.setData({
  //       isLoading: true, 
  //       noMoreData: false
  //     });
      
  //     //加载更多，这里做下延时加载
  //     setTimeout(() => {
  //       this.loadRecords();
  //     }, 500)
  //   }
  // },

  // 页面触底时加载更多
  onReachBottom: function () {
    if (this.data.noMoreData) {
      this.setData({
        isLoading: true, 
        noMoreData: false
      });
      
      //加载更多，这里做下延时加载
      setTimeout(() => {
        this.loadRecords();
      }, 500)
    }
  }
})