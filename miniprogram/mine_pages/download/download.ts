var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {} as any,
    items: [] as any[],
    page: 1,
    limit: 20,
    isLoading: false, 
    noMoreData: false,
    nodataValue: '',
    uid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const userInfo = wx.getStorageSync('userInfo') || {};
    if (options.uid) {
      this.setData({
        userInfo: userInfo,
        uid: options.uid
      })
    }
  },

  onShow(){
    this.fetchResults(true, this.data.uid);
  },

   // 上拉加载
   onReachBottom: function() {
    this.fetchResults(false, this.data.uid);
  },

  // 用户接近页面底部时加载下一页
  onScrollToLower: function() {
    if (!this.data.isLoading) {
      this.fetchResults(false, this.data.uid);
    }
  },

  // 请求
  fetchResults: function(isRefresh:boolean, uid:string) {
    // 正在加载时防止重复请求
    if (this.data.isLoading || this.data.noMoreData) {
      return;  
    }
    
    // 开启底部加载提示
    this.setData({
      isLoading: true
    });

    const page = isRefresh ? 1 : this.data.page + 1;
    wx.request({
      url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/action/page`,
      method: 'POST',
      data: {
        page: page,
        limit: this.data.limit,
        type: '2',
        uid: uid
      },
      header: {
        'Authorization': this.data.userInfo.accessToken,
        'content-type': 'application/json'
      },
      success: res => {
        const data = res.data as Record<string, any>;
        if (res.statusCode === 200) {
          let newItems = data.data.records;

          // 构造图片全地址
          newItems = app.generateFullFilePaths(newItems);

          let updatedItems = this.data.items.slice(); // 复制现有的items数组

          if (isRefresh) {
            updatedItems = newItems; // 如果是刷新，则清空原有数据并添加新数据
          } else {
            updatedItems = updatedItems.concat(newItems); // 如果不是刷新，则追加新数据
          }

          this.setData({
            items: updatedItems,
            page: page,
            isRefresh: isRefresh,
            noMoreData: newItems.length < this.data.limit ? true : false
          });
        } else {
          console.error('Failed to fetch data:', res);
        }
      },
      fail: err => {
        console.error('Request failed:', err);
      },
      complete: () => {
        // 关闭底部加载提示
        this.setData({
          isLoading: false
        });
      }
    });
  },

  // 回到顶部
  onPageScroll(e:any) { 
    this.selectComponent('#backToTop').onPageScroll(e);
  },

  // 预览图片
  previewImageHandler: function(e:any) { // 添加类型声明
    const currentIndex = e.currentTarget.dataset.index;
    const images = e.currentTarget.dataset.images;
  
    wx.navigateTo({
      url: `/pages/preview_images/preview_images?currentIndex=${currentIndex}&images=${JSON.stringify(images)}&isDownload=1`
    });
  }
})