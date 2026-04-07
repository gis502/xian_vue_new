# basic_template_not_login_front
开发基本模版——前端
# basic_template_not_login_front

## 项目介绍
`basic_template_not_login_front` 是一个包含前端的基础开发模板，旨在为快速搭建Web应用提供完整的技术栈支持。项目前端基于Vue 3 + TypeScript + Element Plus构建，可直接作为中小型Web项目的开发起点。


## 目录结构
```
basic_template_not_login_front                                                   
├── public                                                              # 公共静态文件
│   └── favicon.ico
├── src                                                                 
│   ├── api                                                             # 前端请求后端api，所有请求都应该从这里触发
│   │   ├── api.ts                                                      # 前端请求配置，所有请求都需要配置在这个文件中
│   │   ├── crypto.ts                                                   # 国密加密请求
│   ├── assets                                                          # 静态资源
│   │   └── images                                                      
│   │       └── logo.svg
│   ├── config                                                          # 前端配置信息
│   │   └── config.json                                                 # 配置
│   ├── hooks                                                           # vue3中hooks
│   ├── router                                                          # 路由
│   │   └── index.ts
│   ├── stores                                                          # pinia文件
│   │   ├── useCryptStore.ts                                            # 加解密pinia
│   ├── types                                                           # 定义ts类型，理论上与后端搭配使用
│   │   ├── crypto                                                      # 加解密相关
│   │   │   └── Sm2PublicKeyResponse.ts                                 # SM2公钥响应类
│   │   └── Response.ts                                                 # 响应类，所有后端返回类型理论上应该和这个类一致
│   ├── utils                                                           # 前端工具
│   │   ├── request                                                     # 请求相关
│   │   │   └── http.ts                                                 # http请求拦截，所有请求都要经过这里
│   │   ├── safety                                                      # 安全相关
│   │   │   └── SafetyUtils.ts                                          # 安全配置
│   │   └── utils.ts                                                    # 公共工具
│   ├── views                                                           # vue3路由对应页面
│   │   ├── home                                                        # 首页
│   │   │   └── HomePage.vue
│   ├── App.vue
│   └── main.ts
├── LICENSE                                                             # 许可证
└── README.md                                                           # 介绍文件
```

## 安装与使用

### 环境要求
- Node.js 、pnpm

### 项目克隆
```bash
git clone https://github.com/wzy-warehouse/basic_template_not_login_front.git
cd basic_template_not_login_front
```

### 启动
```bash
pnpm install
pnpm run dev
```

### 访问系统
+ 前端地址：[http://localhost:5173](http://localhost:5173/)

## 许可证
本项目基于 [MIT License](LICENSE) 开源，详情请查看LICENSE文件。
