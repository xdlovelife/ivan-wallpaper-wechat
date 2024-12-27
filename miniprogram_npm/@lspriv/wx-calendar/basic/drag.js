"use strict";var e=this&&this.__awaiter||function(e,n,s,l){return new(s=s||Promise)(function(a,t){function i(e){try{_(l.next(e))}catch(e){t(e)}}function r(e){try{_(l.throw(e))}catch(e){t(e)}}function _(e){var t;e.done?a(e.value):((t=e.value)instanceof s?t:new s(function(e){e(t)})).then(i,r)}_((l=l.apply(e,n||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0}),exports.Dragger=void 0;const t=require("../interface/component"),l=require("./tools"),m=require("./constants"),E=require("./layout"),i=require("./panel"),r=require("../interface/calendar"),y=require("../utils/shared"),{shared:_,timing:A,sequence:$,Easing:f,delay:V,runOnJS:R}=wx.worklet,n=60,s=8,L=280,O=220;class a extends t.CalendarHandler{constructor(e){super(e),this._style_ids_=new Map,this.initailizeShared()}initailizeShared(){var e=this._instance_,t=(e.$_drag_state=_(0),e.$_current=_(e.data.current),e.$_drag_schedule_opacity=_(0),_(E.Layout.viewHeight(e._view_)));e.$_drag_panel_height=t;const a=e.data.checked||(0,r.normalDate)(e.data.date);t=Array.from({length:m.CALENDAR_PANELS},(e,t)=>_(this.calcPanelOffset(t,a))),e.$_drag_panel_trans=_(t),e.$_drag_bar_rotate=_(0),t=_(e._view_&m.View.week?n:0);e.$_drag_view_bar_translate_=t}update(){this._instance_.$_current.value=this._instance_.data.current,this.setPanelTrans()}bindAnimations(){this.bindContainerAnimation(),this.bindPanelAnimation(),this.bindBarAnimation(),this.bindViewBarAnimation()}bindContainerAnimation(){return e(this,void 0,void 0,function*(){const e=this._instance_;var t=yield(0,l.applyAnimated)(e,m.SELECTOR.PANEL_CONTAINER,()=>{"worklet";return{height:e.$_drag_panel_height.value+"px"}});this._style_ids_.set(m.SELECTOR.PANEL_CONTAINER,t)})}bindPanelAnimation(){return e(this,void 0,void 0,function*(){const t=this._instance_,{mainHeight:a,minHeight:i,dragMax:r}=E.Layout.layout;for(let e=0;e<m.CALENDAR_PANELS;e++){var _=m.SELECTOR.PANEL+e;const s=t.$_drag_panel_trans.value[e];var n=yield(0,l.applyAnimated)(t,_,()=>{"worklet";var e=Math.min(r,Math.max(i,t.$_drag_panel_height.value));return{transform:`translateY(${-(e>=a?0:s.value*(a-e)/(a-i))}px)`}});this._style_ids_.set(_,n)}})}bindBarAnimation(){return e(this,void 0,void 0,function*(){const e=this._instance_;var[t,a]=yield(0,y.promises)([(0,l.applyAnimated)(e,m.SELECTOR.BAR_1,()=>{"worklet";return{transform:`rotate(${e.$_drag_bar_rotate.value}deg)`}}),(0,l.applyAnimated)(e,m.SELECTOR.BAR_2,()=>{"worklet";return{transform:`rotate(${-e.$_drag_bar_rotate.value}deg)`}})]);this._style_ids_.set(m.SELECTOR.BAR_1,t),this._style_ids_.set(m.SELECTOR.BAR_2,a)})}bindViewBarAnimation(){return e(this,void 0,void 0,function*(){const e=this._instance_;var[t,a,i]=yield(0,y.promises)([(0,l.applyAnimated)(e,m.SELECTOR.VIEW_BAR,()=>{"worklet";return{transform:`translateX(${e.$_drag_view_bar_translate_.value}rpx) translateZ(0px)`}}),(0,l.applyAnimated)(e,m.SELECTOR.VIEW_BAR_1,()=>{"worklet";return{width:Math.max(n-s-e.$_drag_view_bar_translate_.value,s)+"rpx"}}),(0,l.applyAnimated)(e,m.SELECTOR.VIEW_BAR_2,()=>{"worklet";return{width:Math.max(e.$_drag_view_bar_translate_.value-s,s)+"rpx"}})]);this._style_ids_.set(m.SELECTOR.VIEW_BAR,t),this._style_ids_.set(m.SELECTOR.VIEW_BAR_1,a),this._style_ids_.set(m.SELECTOR.VIEW_BAR_2,i)})}bindScheduleAnimation(){return e(this,void 0,void 0,function*(){var e=this._instance_,t=(e.$_drag_schedule_opacity.value=e._view_&m.View.schedule?1:0,this.clearScheduleAnimation(),e.data.current),t=(this._schdule_selector_=""+m.SELECTOR.PANEL+t+" "+m.SELECTOR.SCHEDULES,yield(0,l.applyAnimated)(e,this._schdule_selector_,()=>{"worklet";return{opacity:this._instance_.$_drag_schedule_opacity.value}}));this._style_ids_.set(this._schdule_selector_,t)})}clearScheduleAnimation(){var e=this._style_ids_.get(this._schdule_selector_);e&&((0,l.clearAnimated)(this._instance_,this._schdule_selector_,[e]),this._style_ids_.delete(this._schdule_selector_))}calcPanelOffset(e,t){var a=this._instance_.data,[,t]=i.PanelTool.calcPanelOffset((0,r.offsetDate)(t,7*(0,l.circularDiff)(e,a.current)),a.weekstart);return t}setPanelTrans(){const i=this._instance_;i.$_drag_panel_trans.value.forEach((e,t)=>{var a=this.calcPanelOffset(t,i.data.checked||(0,r.normalDate)(i.data.date));i.$_drag_panel_trans.value[t].value=a})}dragout(s){const l=this._instance_,{minHeight:d,maxHeight:o,mainHeight:e}=E.Layout.layout,h=l.$_drag_panel_height.value,u=d,c=_(0);var t;l._view_&m.View.week?(t=h-d,c.value=!(0<s)&&t<u?m.View.week:m.View.month):l._view_&m.View.schedule?(t=h-u,c.value=!(t>-u)||s<0?m.View.month:m.View.schedule):(t=h-e,c.value=s?0<t?0<s?m.View.schedule:m.View.month:s<0?m.View.week:m.View.month:t<-u?m.View.week:t>u?m.View.schedule:m.View.month);const v=c.value&m.View.week,g=c.value&m.View.schedule,w=v?d:g?o:e,p=(0,y.easingOpt)(L);return new Promise(e=>{var t,a,i,r,_,n=()=>{"worklet";R(e)(c.value)};!s||(t=Math.ceil(1e3*Math.abs((w-h)/s)))>=L||h<=d||h>=o?(l.$_drag_panel_height.value=A(w,p),l.$_drag_bar_rotate.value=A(0,p,n)):(_=u-u*t/L,a=Math.floor(Math.asin(_/u)*O),i=(0,y.easingOpt)(a),r=(0,y.easingOpt)(t,f.bezier(0,0,1,1)),_=!v&&(g||0<s)?w+_:w-_,l.$_drag_panel_height.value=$(A(w,r,n),A(_,i),A(w,i)),l.$_drag_bar_rotate.value=V(a+t,A(0,p))),l.$_drag_view_bar_translate_.value=A(v?60:0,p),l.$_drag_schedule_opacity.value=A(g?1:0,p)})}toView(r,_=!1){const n=this._instance_;if(n._view_&r)return Promise.resolve();const{minHeight:s,maxHeight:l,mainHeight:d}=E.Layout.layout,o={duration:L,easing:f.out(f.sin)};return new Promise(e=>{var t=r&m.View.week?s:r&m.View.schedule?l:d,a=r&m.View.week?60:0,i=r&m.View.schedule?1:0;n.$_drag_panel_height.value=_?A(t,o,()=>{"worklet";R(e)()}):t,n.$_drag_view_bar_translate_.value=_?A(a,o):a,n.$_drag_schedule_opacity.value=_?A(i,o):i,_||e()})}clear(){var e=this._instance_;for(const a of[...this._style_ids_.keys()]){var t=this._style_ids_.get(a);t&&(0,l.clearAnimated)(e,a,[t])}this._style_ids_.clear(),e.$_current=void 0,e.$_drag_state=void 0,e.$_drag_panel_height=void 0,e.$_drag_panel_trans=void 0,e.$_drag_bar_rotate=void 0,e._dragger_=void 0}}exports.Dragger=a;