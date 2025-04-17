# Bun-Server 业务应用模板

## 简介
业务应用开发模板，基于 Bun 运行时构建。

---

## 目录
1. [环境准备](#环境准备)
2. [项目脚本](#项目脚本)

---

## 环境准备

### 前置要求
- [Bun](https://bun.sh/) v1.0.0+

### 依赖安装
```
bun i
```
---

## 项目脚本

在 `package.json` 中定义的核心开发指令：

### `generate:modules` 扫描解析模块文件
解析`src/modules`目录下的文件，生成`src/generated/modules.ts`
```
bun run generate:modules
```

### `dev` 启动开发服务器
每次启动服务前，会先执行`prebuild`
```
bun run dev
```

### `build` 编译打包
每次编译打包前，会先执行`prebuild`
```
bun run build
```

### `preview` 本地启动预览打包后的app
```
bun run preview
```

### `check` 检查typescript编译错误和警告
```
bun run check
```

### `lint` 检查lint错误和警告（不自动修复）
```
bun run lint
```

### `generate:configSchema` 更新config json schema
每次修改IAppConfig.d.ts后，执行此脚本，生成`config/schema.json`。
`config`目录下的配置文件，可绑定该json schema以获得自动补全提示
```
bun run generate:configSchema
```

### `generate:api` 更新api接口代码
每次修改openapi schema后，执行此脚本，从openapi生成typescript（输出路径为src/generated/server）
```
bun run generate:api
```
