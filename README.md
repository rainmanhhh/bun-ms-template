# bun-ms-template 业务应用模板

## 简介
服务端业务应用开发模板，基于 Bun 运行时构建。

---

## 目录
1. [环境准备](#环境准备)
2. [项目脚本](#项目脚本)
3. [配置文件](#配置文件)
4. [编写业务代码](#编写业务代码)
5. [模块加载机制](#模块加载机制)
6. [eureka支持](#eureka支持)
7. [日志](#日志)
8. [测试](#测试)
9. [其他](#其他)

---

## 环境准备

### 前置要求
- [Bun](https://bun.sh/) v1.2.0+

### 创建项目
```bash
bun create rainmanhhh/bun-ms-template my-project
cd my-project
bun i && bun run generate-api && bun run generate-modules && bun run generate-configSchema
```
---

## 项目脚本

在 `package.json` 中定义的核心开发指令（使用`bun run <script>`执行）：

### `generate-api`
生成api接口代码。每次修改openapi schema后，执行此脚本生成typescript接口（输出路径为`src/generated/server`）

### `generate-modules`
解析模块文件。扫描`src/modules`目录下的文件，生成`src/generated/modules.ts`。详情见[模块加载机制](#模块加载机制)

### `generate-configSchema`
生成config json schema。执行此脚本，将生成`config/schema.json`
`config`目录下的配置文件，可绑定该json schema以获得自动补全提示。详情见[配置文件](#配置文件)

### `dev`
启动开发服务器

### `build`
编译打包

### `preview`
预览打包后的app。先通过`cross-env`将`NODE_ENV`设置为`production`，然后启动`dist/index.js`进行预览

### `check`
检查typescript编译错误和警告

### `lint`
检查lint错误和警告（不自动修复）

### `test`
运行单元测试（使用`bun:test`）

## 配置文件
- `src/config/appConfig.ts`用于加载配置文件并导出一个`appConfig`对象
- 配置项类型定义在`src/config/IAppConfig.d.ts`中，每次修改此文件后，应重新执行[generate-configSchema](#generate-configSchema)，生成新的`config/schema.json`
- 配置文件为yml格式，包括一个公共的基础配置文件（名为`base.yml`）和一个与运行环境相关的配置文件（名为`${NODE_ENV}.yml`，例如`development.yml` `test.yml` `production.yml`）
- 配置文件的第一行加上`$schema: ./schema.json`，可绑定json schema，实现自动补全
- 若未指定`NODE_ENV`，默认为`development`。编译打包后，运行时需在命令中指定`NODE_ENV`为`production`（参考[preview](#preview)，以及`start.sh`）
- 代码中引用环境变量时，应使用`import.meta.env.XXX`，例如`import.meta.env.NODE_ENV`

## 编写业务代码
- 在openapi schema(`openapi/openapi.yml`)中定义接口
- 执行[generate-api](#generate-api)生成typescript接口文件，输出目录为`src/generated/server`
- 在`src/modules/controller`目录下编写实现类，例如`src/modules/controller/FooBarApiImpl`应实现`src/generated/server/api/fooBar/types.ts`中定义的`FooBarApi`接口
- **注意**：每个实现类文件尾部应创建实例并赋值给`routes`对象（`src/modules/server/server.ts`）的对应字段，例如`routes.fooBar = new FooBarApiImpl()`

## 模块加载机制
- 每次执行[generate-modules](#generate-modules)时，自动读取`src/modules`目录（包括子目录），该路径下的每个文件会被视为一个模块，完整的模块名由目录和文件名拼接构成，例如`src/modules/controller/user/index.ts`的模块名为`controller_user_index`
- 最终所有模块的引用会被合并生成为`src/generated/modules.ts`文件，app入口`src/index.ts`根据此文件加载模块
- 模块文件的默认导出对象（default export）如果是函数，则会在自动加载时被执行（若函数为异步，下一个模块会在异步执行完毕后再开始加载），可额外导出一个数字常量`order`来控制此函数的执行顺序（未指定则视为order=0）
- `routes.ts``errorHandler.ts``server.ts`的默认`order`分别设为500,999,1000（`controller`目录下的文件不指定`order`，相当于全部为0）。如此可保证所有的controller先将自己添加到`routes`中，然后`routes`一次性为`server`批量注册路由，然后注册错误处理器，最后启动web服务

## eureka支持
如果配置了`${appConfig.eureka}`，则程序启动时会自动向eureka服务中心注册（服务名称为`${appConfig.name}`）

## 日志
- `src/logger.ts`文件导出了一个`logger`对象，底层实现为`winston`，所有日志均使用该对象打印。
- 默认的配置为：`development`环境，日志输出到控制台；`production`环境，日志输出到文件，随文件大小和日期滚动（单个日志文件最大128m，最多保留30天），且自动创建一个`current.log`软链接指向最新的日志文件
- **注意**：`winston`输出变量与`console`不同，即使只有一个变量，也要显式定义占位符，例如
```ts
logger.info('hello %s', 'world')
```

## 测试
测试文件命名格式为`*.test.ts`，执行[test](#test)即可运行所有测试用例

## 其他
- tsconfig中lib配置了ESNext + DOM，如果要使用DOM的某些接口（例如form-data），需添加对应的polyfill。
- 自带dateUtil和uuidUtil以提供常用功能
