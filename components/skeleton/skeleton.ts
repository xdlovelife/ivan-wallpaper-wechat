Component({
  properties: {
    // 骨架屏类型
    type: {
      type: String,
      value: 'wallpaper'
    },
    // 显示数量
    count: {
      type: Number,
      value: 6
    },
    // 是否显示动画
    animate: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 组件内部数据
  },

  lifetimes: {
    attached() {
      // 组件加载时
    },
    detached() {
      // 组件卸载时
    }
  },

  methods: {
    // 组件方法
  }
}) 