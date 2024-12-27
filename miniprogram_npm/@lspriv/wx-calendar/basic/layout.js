"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Layout=void 0;const a=require("./constants"),i=750;class u{static initialize(){var e,t,a,i,o,r,n,l,d,h;u.layout||({safeArea:h,windowWidth:e,windowHeight:t,theme:o,pixelRatio:d}=wx.getSystemInfoSync(),{top:a,bottom:i}=wx.getMenuButtonBoundingClientRect(),u.theme=o||"light",u.darkmode=!!o,u.dpr=d,o=u.rpxToPx(u.CalendarHeaderHeight+u.CalendarWeekHeight+u.CalendarBarHeight,e),d=u.rpxToPx(u.CalendarSpareHeight,e),d=(l=(r=u.rpxToPx(u.CalendarMainHeight,e))/5)+(n=(null!=(n=null==h?void 0:h.bottom)?n:t)-i-d-o),h=t-(null!=(o=null==h?void 0:h.bottom)?o:t),u.layout=Object.freeze({menuTop:a,menuBottom:i,safeBottom:0<h?h:u.rpxToPx(60,e),mainHeight:r,maxHeight:n,minHeight:l,dragMax:d,windowWidth:e,windowHeight:t,maxScheduleSize:u.calcSchedulesMaxSize(n,e)}))}static calcSchedulesMaxSize(e,t){var e=e/6,a=u.rpxToPx(100,t),i=u.rpxToPx(4,t),t=u.rpxToPx(24,t);return Math.floor((e-a)/(t+i))}static rpxToPx(e,t){var a;if(t=t||(null==(a=u.layout)?void 0:a.windowWidth))return Math.floor(e*t/i);throw new Error("missing parameter [windowWidth]")}static viewHeight(e){var t;return e&a.View.week?null==(t=u.layout)?void 0:t.minHeight:e&a.View.month?null==(t=u.layout)?void 0:t.mainHeight:!(e&a.View.schedule)||null==(t=u.layout)?void 0:t.maxHeight}}(exports.Layout=u).darkmode=!0,u.dpr=1,u.CalendarMainHeight=600,u.CalendarHeaderHeight=100,u.CalendarWeekHeight=50,u.CalendarBarHeight=50,u.CalendarSpareHeight=100;