# Bun-Server 业务应用模板

## 简介
业务应用开发模板，基于 Bun 运行时构建。

---

## 目录
1. [环境准备](#环境准备)
2. [项目脚本](#项目脚本)
3. [配置文件](#配置文件)
4. [编写业务代码](#编写业务代码)
5. [模块加载机制说明](#模块加载机制说明)
6. [eureka支持](#eureka支持)
7. [日志说明](#日志说明)

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
- 配置文件为yml格式，包括一个公共的基础配置文件（名为"base.yml"）和一个与运行环境相关的配置文件（名为`${NODE_ENV}.yml`，例如`development.yml` `test.yml` `production.yml`）
- 配置文件的第一行固定为`$schema: ./schema.json`，以绑定json schema
- 若未指定`NODE_ENV`，默认为`development`。编译打包后，运行时需在命令中指定`NODE_ENV`为`production`
- 代码中引用环境变量时，应使用`import.meta.env.XXX`，例如`import.meta.env.NODE_ENV`

## 编写业务代码
- 在openapi schema中定义接口
- 执行`generate:api`生成typescript接口文件，输出文件为`src/generated/server/api/XXX/types.ts`，类型为XXXApi
- 在`src/modules/controller`目录下编写实现类（XXXApiImpl），注意：每个实现类文件尾部应创建实例并赋值给`routes`对象的对应字段，例如`routes.foo = new FooApiImpl()`

## 模块加载机制
- 每次执行`generate:modules`时，自动读取`src/modules`目录（包括子目录），该路径下的每个文件会被视为一个模块，完整的模块名由目录和文件名拼接构成，例如`src/modules/controller/user/index.ts`的模块名为`controller_user_index`
- 模块文件的默认导出对象（default export）如果是函数，则会在自动加载时被执行（若函数为异步，下一个模块会在异步执行完毕后再开始加载）
- 最终所有模块的引用会被合并生成为`src/generated/modules.ts`文件，app入口`src/index.ts`根据此文件加载模块

## eureka支持
如果配置了`appConfig.eureka`，则程序启动后会自动向eureka服务中心注册，服务名称为`${appConfig.name}`

## 日志
- `src/logger.ts`文件导出了一个`logger`对象，底层实现为`winston`，所有日志均使用该对象打印。
- 默认的配置为：`development`环境，日志输出到控制台；`production`环境，日志输出到文件，随文件大小和日期滚动（单个日志文件最大128m，最多保留30天），且自动创建一个`current.log`软链接指向最新的日志文件
- **注意**：`winston`输出变量与`console`不同，即使只有一个变量，也要显式定义占位符，例如
```ts
logger.info('hello %s', 'world')
```
