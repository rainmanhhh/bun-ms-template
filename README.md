# bun-ms-template 业务应用模板

## 简介
服务端业务应用开发模板，基于 Bun 运行时构建。

---

## 目录
1. [环境准备](#环境准备)
2. [项目脚本](#项目脚本)
3. [配置文件](#配置文件)
4. [编写业务代码](#编写业务代码)
5. [模块加载](#模块加载)
6. [eureka支持](#eureka支持)
7. [数据库支持](#数据库支持)
8. [日志](#日志)
9. [测试](#测试)
10. [其他](#其他)

---

## 1.环境准备

### 1.1.前置要求
- [Bun](https://bun.sh/) v1.2.0+

### 1.2.创建项目
```bash
bun create rainmanhhh/bun-ms-template my-project
cd my-project
```
### 1.3.安装依赖
```bash
bun i
```
### 1.4.生成数据库代码（注意先修改config文件中的数据库连接配置），若无需访问数据库，可忽略此步骤
```bash
bun run generate-db
```
### 1.5.生成接口代码、模块和app配置类型文件
```bash
bun run generate-api && bun run generate-modules && bun run generate-configSchema
```
**注意**：创建项目时，先按以上顺序执行一次generate系列脚本，否则编译会报错

### 1.6.修改基础配置
编辑config/base.yml，修改项目基础配置（项目名称和http服务端口号）

---

## 2.项目脚本

在 `package.json` 中定义的核心开发指令（使用`bun run <script>`执行）：

### `generate-api`
生成api接口代码。每次修改openapi schema后，执行此脚本生成typescript接口（输出路径为`src/generated/server`）

### `generate-modules`
解析模块文件。扫描`src/modules`目录下的文件，生成`src/generated/modules.ts`。详情见[模块加载](#模块加载)

### `generate-configSchema`
生成config json schema。执行此脚本，将生成`config/schema.json`
`config`目录下的配置文件，可绑定该json schema以获得自动补全提示。详情见[配置文件](#配置文件)

### `debug`
在idea中启动断点调试

### `dev`
启动开发服务器

### `build`
编译打包。假设部署到服务器的`/home/app/foo`目录，则上传项目的`dist`和`config`目录到`/home/app/foo`。同时还可上传`scripts`目录下的脚本用于启停服务（`bun.sh`放在`/etc/profile.d./`，`start.sh`和`end.sh`放在`/home/app/foo/`）

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
- 若未指定`NODE_ENV`，默认为`development`。编译打包后，运行时需在命令中指定`NODE_ENV`为`production`（参考[preview](#preview)，以及前面提到的`start.sh`）
- 代码中引用环境变量时，应使用`import.meta.env.XXX`，例如`import.meta.env.NODE_ENV`

## 编写业务代码
按以下步骤进行开发：
- 在openapi schema(`openapi/openapi.yml`)中定义接口
- 执行[generate-api](#generate-api)生成typescript接口文件，输出目录为`src/generated/server`
- 在`src/modules/controller`目录下编写实现类，例如`src/modules/controller/FooBarApiImpl`应实现`src/generated/server/api/fooBar/types.ts`中定义的`FooBarApi`接口
- **注意**：每个实现类文件尾部应创建实例并传给`routes`对象。例如：
  ```ts
  import type { FooBarApi } from '../../../generated/server/api/fooBar/types.ts'
  import { routes } from '../routes.ts' // src/modules/routes.ts

  class FooBarApiImpl implements FooBarApi {
    // ...
  }
  routes.fooBar = new FooBarApiImpl()
  ```

## 模块加载
- 每次执行[generate-modules](#generate-modules)时，自动读取`src/modules`目录（包括子目录），该路径下的每个文件会被视为一个模块，完整的模块名由目录和文件名拼接构成，例如`src/modules/controller/user/index.ts`的模块名为`controller_user_index`
- 最终所有模块的引用会被合并生成为`src/generated/modules.ts`文件，app入口`src/index.ts`根据此文件加载模块
- 模块文件的默认导出对象（default export）如果是函数，则会在自动加载时被执行（若函数为异步，下一个模块会在异步执行完毕后再开始加载），可额外导出一个数字常量`order`来控制此函数的执行顺序（未指定则视为order=0）
- 自带模块：
  - `modules/server/reqContextHandler.ts`(order=-1000) 。将`express`请求对象`req`和响应对象`res`绑定到异步上下文`reqContext`，后续的请求处理函数可访问此对象来进行获取url、请求头、设置响应头等操作
  - `modules/server/passportHandler.ts`(order=-500)。默认的passport处理器(demo)，用于处理openapi示例中定义的全局安全令牌apiKey1（从http头获取X-API-KEY，总是返回成功）
  - `modules/server/bodyHandler.ts`(order=-200)。默认的请求报文体处理器，支持form和json格式
  - `modules/server/routes.ts`(order=500)。`routes`一次性为`server`批量注册路由
  - `modules/server/errorHandler.ts`(order=999)。web服务启动前注册错误处理器
  - `modules/server/server.ts`(order=1000)。启动web服务
  - `modules/server/`目录下的其他文件(不指定`order`，相当于全部为0)。所有的`controller`在`routes`注册路由前先将自己添加到`routes`中（`eurekaClient`自带actuator端点，故也属于`controller`角色）

**注意**：`server`的底层实现为`express`，要自定义中间件，可参照`reqContextHandler`或`errorHandler`

## eureka支持
如果配置了`${appConfig.eureka}`，则程序启动时会自动创建一个`eurekaClient`，向eureka服务中心注册（服务名称为`${appConfig.name}`，instanceId格式为`${appConfig.name}:${ipAddr}:${port}`）
**注意**：若服务器有多个ip（例如双网卡，或部署了docker），建议手动配置`${appConfig.eureka.subnet}`指定app所在的网段，否则`${ipAddr}`可能会取到错误的值
`eurekaClient`启动时会根据配置`${appConfig.eureka.statusPagePath}`（默认值`/actuator/info`）和`${appConfig.eureka.healthCheckPath}`（默认值`/actuator/health`）添加两个路由端点，向注册中心提供服务状态信息

## 数据库支持
- 使用drizzle-orm访问数据库，配置文件为`prebuild/drizzle.config.ts`
- 模板中默认加入了`mysql2`作为驱动，若使用其他数据库可进行替换（注意同时修改`drizzle.config.ts`中的`dialect`和`src/modules/db.ts`中的初始化代码）
- 连接配置在`appConfig.dbUrl`，执行`generate-db`会读取数据库反向生成schema（输出到`drizzle`目录下）

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
- `tsconfig.json`中，`lib`被配置为`ESNext` + `DOM`，如果要使用dom的某些接口（例如`FormData`），需添加对应的polyfill。
- 自带`dateUtil`，`uuidUtil`，`ipUtil`以提供常用功能
