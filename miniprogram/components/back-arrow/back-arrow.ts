Component({
  properties: {
    iconSrc: {
      type: String,
      value: '../../images/preview/back_icon.png'
    }
  },
  methods: {
    goHome: function() {
      wx.switchTab({
        url: '/pages/home/home'
      });
    },

    goBack: function() {
      wx.navigateBack({
        delta: 1 
      });
    }
  }
});