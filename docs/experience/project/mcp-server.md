# MCP 服务中心
<img src="https://img.shields.io/badge/-CSDN-FFA500" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-掘金-8A2BE2" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-微信-32CD32" alt="" style="display: inline-block;margin-right: 2px"/>
<img src="https://img.shields.io/badge/-本地-1E90FF" alt="" style="display: inline-block;margin-right: 2px"/> 


<Linkcard url="https://github.com/userwanyong/MCP-SERVERS" title="Github地址" description="https://github.com/userwanyong/MCP-SERVERS" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202508181539171.png"></Linkcard>

## 1. mcp-server-computer
::: code-group
```bash [stdio]
{
  "mcpServers": {
    "filesystem": {
      "command": "npx", //windows改为npx.cmd
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "D:/桌面",
        "D:/桌面"
      ]
    },
    "mcp-server-computer": {
      "command": "java",
      "args": [
        "-jar",
        "E:\\maven\\.m2\\repository\\cn\\wanyj\\mcp-server-computer\\1.0.0\\mcp-server-computer-1.0.0.jar" # 改为你的jar包地址
      ]
    }
  }
}
```
:::
## 2. mcp-server-csdn
::: code-group
```bash [stdio]
{
  "mcpServers": {
    "mcp-server-csdn": {
      "command": "java",
      "args": [
        "-Dfile.encoding=utf-8",
        "-jar",
        "E:\\maven\\.m2\\repository\\cn\\wanyj\\mcp-server-csdn\\1.0.0\\mcp-server-csdn-1.0.0.jar", # 改为你的jar包地址
        "--csdn.api.categories=Java场景面试宝典", # 专栏名
        "--csdn.api.cookie=uuid_tt_dd=xxxx" # csdn的cookie
      ]
    }
  }
}
```
```bash [sse]
{
  "baseUri": "http://1.1.1.1:1111", # 你部署的地址
  "sseEndpoint": "/sse"
}
```
```yml [sse部署文件]
services:
  mcp-server-csdn:
    image: registry.cn-wulanchabu.aliyuncs.com/wanyj-mcp/mcp-server-csdn:1.0
    container_name: mcp-server-csdn
    restart: always
    ports:
      - "9001:9001"
    volumes:
      - ./log:/data/log
    environment:
      - TZ=PRC
      - SERVER_PORT=9001
      - CSDN_API_CATEGORIES=Java场景面试宝典
      - CSDN_API_COOKIE=uuid_tt_dd=xxx
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```
:::
## 3. mcp-server-juejin
::: code-group
```bash [stdio]
{
  "mcpServers": {
    "mcp-server-juejin": {
      "command": "java",
      "args": [
        "-Dfile.encoding=utf-8",
        "-jar",
        "E:\\maven\\.m2\\repository\\cn\\wanyj\\mcp-server-juejin\\1.0.0\\mcp-server-juejin-1.0.0.jar", # 改为你的jar包地址
        "--juejin.api.categories=Java场景面试宝典", # 专栏名
        "--juejin.api.cookie=csrf_session_id=xxxx" # 掘金的cookie
      ]
    }
  }
}
```
```bash [sse]
{
  "baseUri": "http://1.1.1.1:1111", # 你部署的地址
  "sseEndpoint": "/sse"
}
```
```yml [sse部署文件]
services:
  mcp-server-juejin:
    image: registry.cn-wulanchabu.aliyuncs.com/wanyj-mcp/mcp-server-juejin:1.0
    container_name: mcp-server-juejin
    restart: always
    ports:
      - "9003:9003"
    volumes:
      - ./log:/data/log
    environment:
      - TZ=PRC
      - SERVER_PORT=9003
      - JUEJIN_API_COOKIE=xxx
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```
:::
## 4. mcp-server-weixin
::: code-group
```bash [stdio]
{
  "mcpServers": {
    "mcp-server-weixin": {
      "command": "java",
      "args": [
        "-Dfile.encoding=utf-8",
        "-jar",
        "E:\\maven\\.m2\\repository\\cn\\wanyj\\mcp-server-weixin\\1.0.0\\mcp-server-weixin-1.0.0.jar", # 改为你的jar包地址
        "--weixin.api.original_id=xxx",
        "--weixin.api.app_id=xxx",
        "--weixin.api.app_secret=xxx",
        "--weixin.api.template_id=xxx",
        "--weixin.api.touser=xxx"
      ]
    }
  }
}
```
```bash [sse]
{
  "baseUri": "http://1.1.1.1:1111", # 你部署的地址
  "sseEndpoint": "/sse"
}
```
```yml [sse部署文件]
services:
  mcp-server-weixin:
    image: registry.cn-wulanchabu.aliyuncs.com/wanyj-mcp/mcp-server-weixin:1.0
    container_name: mcp-server-weixin
    restart: always
    ports:
      - "9004:9004"
    volumes:
      - ./log:/data/log
    environment:
      - TZ=PRC
      - SERVER_PORT=9004
      - WEIXIN_API_ORIGINAL_ID=xxx
      - WEIXIN_API_APP_ID=xxx
      - WEIXIN_API_APP_SECRET=xxx
      - WEIXIN_API_TEMPLATE_ID=xxx
      - WEIXIN_API_TOUSER=xxx
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```
:::
