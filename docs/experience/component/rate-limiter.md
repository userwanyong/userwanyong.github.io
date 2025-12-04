# 动态限流组件
<img src="https://img.shields.io/badge/-aop-32CD32" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-redis-1E90FF" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-dcc-FFA500" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-Maven-C71A36?logo=Apache-Maven&logoColor=FFF" alt="Maven" style="display: inline-block;margin-right: 2px" /> 

<Linkcard url="https://github.com/userwanyong/wanyj-component" title="Github地址" description="https://github.com/userwanyong/wanyj-component" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202508181539171.png"></Linkcard>

## 1. 简介
使用 Aop 切面技术，基于 Redisson 实现，对用户进行规定时间内的访问频次限制、以及黑名单操作，保证系统安全性

## 2. 优点
- 保证了分布式场景的数据一致性
- 对用户异常频繁访问行为进行拦截

## 3. 使用方法
### step1: 引入依赖
```xml
<dependency>
    <groupId>cn.wanyj.component</groupId>
    <artifactId>rate-limiter-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```
### step2: 针对 Redis 配置 yml
```yml
spring:
  data:
    redis:
      database: 
      host:
      port:
      password:
      ssl: 
      timeout:
      connectTimeout:
      clientName:
      cluster:
        nodes:
      sentinel:
        master:
        nodes:
```
可以参考Redisson的官方文档：https://redisson.pro/docs/integration-with-spring 按需配置即可
### step3: 通过注解方式使用
```java
@RateLimiterInterceptor(key = "userId", permitsPerSecond = 1, blacklistCount = 3, blacklistTime = 24, fallbackMethod = "error")
```
- key: 限流标识
- permitsPerSecond: 限制频次（每秒请求次数）
- blacklistCount: 黑名单拦截（多少次限制后加入黑名单）
- blacklistTime: 黑名单时间（多少时间后移出黑名单）默认 24h
- fallbackMethod: 拦截后执行的方法

示例
```java
/**
 * 将 userId 作为限流标识，如果每秒请求数量超过 1 次，进行限流，调用 error 方法；
 * 如果 1 分钟内总限流次数达到 3 次，则加入黑名单，24h 后移出黑名单
 * http://127.0.0.1:8080/api/rl?userId=wanyj
 */
@GetMapping("/rl")
@RateLimiterInterceptor(key = "userId", permitsPerSecond = 1, blacklistCount = 3, blacklistTime = 24, fallbackMethod = "error")
public String rl(String userId) {
    log.info("pass: rl");
    return "pass: rl";
}

public String error(String userId) {
    log.warn("error: rateLimiter");
    return "error: rateLimiter";
}
```
### step4: 全局控制限流功能的开启与关闭
搭配 dcc 动态配置中心使用，直接调整属性值即可
- key: rateLimiterSwitch
- value: open(默认)/close
```java
@Resource
private RTopic dynamicConfigCenterRedisTopic;
dynamicConfigCenterRedisTopic.publish(new AttributeEntity("rateLimiterSwitch", "close"));
```
