# xian_vue_new
西安项目前端
# xian_vue_new

## 开发工具说明
1. 使用vscode完成前端代码撰写
2. 使用vscode中的如下插件：
    - Vue (Official)
    - ESLint
    - Prettier - Code formatter
3. 配置vscode的eslint和prettier <br/>
3.1 设置代码自动格式化：
- 打开vscode右下角设置（快捷键Ctrl + ,）
- 搜索formatOnSave
- 设置为选中状态<br/>
3.2 启用保存时自动格式化
- 使用快捷键 Ctrl + Shift + P 打开命令面板
- 输入 Preferences: Open Settings (JSON) 并回车
- 添加如下内容：
```json
{
	"folders": [
		{
			"path": "F:/project/xian_vue_new"
		}
	],
	"settings": {
		"editor.formatOnSave": true,
		"[vue]": {
			"editor.defaultFormatter": "esbenp.prettier-vscode"
		}
	}
}
```


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
