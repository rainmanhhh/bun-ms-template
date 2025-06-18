# Bun-Server 业务应用模板

## 简介
业务应用开发模板，基于 Bun 运行时构建。

---

## 目录
1. [环境准备](#环境准备)
2. [项目脚本](#项目脚本)
3. [配置文件](#配置文件)

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
```
bun run dev
```

### `build` 编译打包
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
执行此脚本，将生成`config/schema.json`。
`config`目录下的配置文件，可绑定该json schema以获得自动补全提示，详情见[配置文件](#配置文件)
```
bun run generate:configSchema
```

### `generate:api` 更新api接口代码
每次修改openapi schema后，执行此脚本，从openapi生成typescript接口（输出路径为src/generated/server）
```
bun run generate:api
```

## 配置文件
- `src/config/appConfig.ts`用于加载配置文件并导出一个`appConfig`对象
- 配置项类型定义在`src/config/IAppConfig.d.ts`中，每次修改此文件后，应重新执行`generate:configSchema`脚本，生成新的`config/schema.json`
- 配置文件为yml格式，文件名为"NODE_ENV.yml"，例如"dev.yml""test.yml""production.yml"，第一行固定为`$schema: ./schema.json`，以绑定json schema
- NODE_ENV未指定则默认为dev

## 编写业务代码
**注意**：在`src/modules`目录下新增、删除、重命名任意文件后，应重新执行`generate:modules`
- 在openapi schema中定义接口
- 根据openapi schema生成typescript接口文件，输出文件为`src/generated/server/api/XXX/types.ts`，类型为XXXApi
- 在`src/modules/controller`目录下编写实现类（XXXApiImpl），注意：每个实现类文件尾部应创建实例并赋值给`routes`对象的对应字段，例如`routes.kooOo = new KooOoApiImpl()`

## 模块（module）加载机制说明
- `src/modules`目录（包括子目录）下的每个文件会被视为一个模块，完整的模块名由目录和文件名拼接构成，例如`src/modules/controller/user/index.ts`的模块名为`controller_user_index`
- 模块文件的默认导出对象（default export）如果是函数，则会在自动加载时被执行

## eureka支持
如果配置了appConfig.eureka，则程序启动后会自动向eureka服务中心注册（服务名使用appConfig.name）
