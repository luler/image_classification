(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[705],{61806:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return BaseComponent}});var C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(69610),C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(54941),C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_get__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(63543),C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(94663),C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(81306),C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(96688),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(67294),BaseComponent=function(_Component){(0,C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_1__.Z)(BaseComponent,_Component);var _super=(0,C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_2__.Z)(BaseComponent);function BaseComponent(){return(0,C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__.Z)(this,BaseComponent),_super.apply(this,arguments)}return(0,C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__.Z)(BaseComponent,[{key:"setStateSimple",value:function(key,value,callback){var _this=this,keyArr=key.split("."),state={},stateEval="state";keyArr.map(function(v,i){stateEval="".concat(stateEval,"['").concat(v,"']"),i===0?state[v]=_this.state[v]||{}:eval("".concat(stateEval," = ").concat(stateEval," || {}"))}),stateEval="".concat(stateEval,"=value"),eval(stateEval),(0,C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_get__WEBPACK_IMPORTED_MODULE_5__.Z)((0,C_work_docker_work_code_api_python_projects_image_classification_code_web_node_modules_umijs_babel_preset_umi_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__.Z)(BaseComponent.prototype),"setState",this).call(this,state,callback)}}]),BaseComponent}(react__WEBPACK_IMPORTED_MODULE_0__.Component)},9752:function(k,i,_){"use strict";_.r(i),_.d(i,{default:function(){return B}});var A=_(13062),c=_(71230),w=_(89032),l=_(15746),f=_(12968),m=_(62462),y=_(43185),p=_(98670),I=_(36017),n=_(35247),E=_(69610),h=_(54941),C=_(81306),D=_(96688),T=_(67294),b=_(61806),P=_(73727),d=_(25958),M=_(43347),O=_(96190),v=_(55171),j=_.n(v),e=_(85893),B=function(g){(0,C.Z)(o,g);var u=(0,D.Z)(o);function o(){var t;(0,E.Z)(this,o);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return t=u.call.apply(u,[this].concat(r)),t.state={response:{}},t}return(0,h.Z)(o,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var a=this;return(0,e.jsxs)("div",{children:[(0,e.jsxs)(n.Z,{style:{padding:20,paddingTop:0,paddingBottom:0},children:[(0,e.jsx)(n.Z.Item,{children:(0,e.jsx)(P.rU,{to:"/",children:(0,d.A8)()})}),(0,e.jsx)(n.Z.Item,{children:(0,e.jsx)("a",{children:(0,d.A8)("/predict")})})]}),(0,e.jsxs)("div",{style:{background:"white",padding:20,margin:"20px 0"},children:[(0,e.jsxs)(p.Z.Dragger,{name:"file",action:"/api/auth/predict",headers:{Authorization:(0,O.hP)()},data:{result_image:1},onChange:function(s){s.file.status==="done"&&a.setStateSimple("response",s.file.response)},showUploadList:!1,children:[(0,e.jsx)("p",{className:"ant-upload-drag-icon",children:(0,e.jsx)(M.Z,{})}),(0,e.jsx)("p",{className:"ant-upload-text",children:"\u652F\u6301\u70B9\u51FB\u9009\u62E9\u6587\u4EF6\uFF0C\u6216\u62D6\u52A8\u6587\u4EF6\u5230\u5F53\u524D\u533A\u57DF\u5185"}),(0,e.jsx)("p",{className:"ant-upload-hint",children:"\u652F\u6301\u8BC6\u522Bjpg,png,jpeg\u683C\u5F0F\u7684\u6587\u4EF6\uFF0C\u8BC6\u522B\u7ED3\u679C\u5C06\u51FA\u73B0\u5728\u4E0B\u9762\u7684\u65B9\u6846\u4E2D"})]}),(0,e.jsxs)(c.Z,{style:{marginTop:20},children:[(0,e.jsx)(l.Z,{lg:12,children:(0,e.jsxs)("div",{style:{padding:30},children:[(0,e.jsx)("p",{style:{textAlign:"center"},children:"\u7ED3\u679C\u56FE"}),(0,e.jsx)("div",{style:{minHeight:54,background:"gray"},children:(0,e.jsx)(m.Z,{width:"100%",src:this.state.response.info&&this.state.response.info.result_image})})]})}),(0,e.jsx)(l.Z,{lg:12,children:(0,e.jsxs)("div",{style:{padding:30},children:[(0,e.jsx)("p",{style:{textAlign:"center"},children:"\u8FD4\u56DE\u7ED3\u679C"}),(0,e.jsx)(j(),{src:this.state.response})]})})]})]})]})}}]),o}(b.Z)}}]);
