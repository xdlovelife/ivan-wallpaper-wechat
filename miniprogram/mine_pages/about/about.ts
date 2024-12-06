// 定义全局对象
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logo: app.globalData.baseIconPath + 'Logo.jpg',
    content: '清新入目随心选 · 高雅绽放自非凡',
    // content: '春风又绿江南岸 · 明月何时照我还',
    version: app.globalData.version,
    arrows: app.globalData.baseIconPath + 'arrows_icon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  // 产品介绍
  openIntroduce(){
    wx.navigateTo({
      url: `/mine_pages/introduce/introduce`
    });
  },

  // 前往隐私协议
  openPrivacy(){
    wx.navigateTo({
      url: `/mine_pages/privacy/privacy`
    });
  },

  // 免责声明
  openStatement(){
    wx.navigateTo({
      url: `/mine_pages/statement/statement`
    });
  }
})