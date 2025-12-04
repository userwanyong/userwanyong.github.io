# 动态配置中心
<img src="https://img.shields.io/badge/-dcc-FFA500" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-redis-1E90FF" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-Maven-C71A36?logo=Apache-Maven&logoColor=FFF" alt="Maven" style="display: inline-block;margin-right: 2px" /> 

<Linkcard url="https://github.com/userwanyong/wanyj-component" title="Github地址" description="https://github.com/userwanyong/wanyj-component" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202508181539171.png"></Linkcard>

## 1. 简介
一个分布式动态配置中心，基于 Redisson 实现，通过发布/订阅模式实现属性值的动态更新

## 2. 优点
- 保证了分布式场景的数据一致性
- 不需要频繁的从 Redis 中获取数据

## 3. 使用方法
### step1: 引入依赖
```xml
<dependency>
    <groupId>cn.wanyj.component</groupId>
    <artifactId>dynamic-config-center-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```
### step2: 配置 yml
```yml
wanyj:
  component:
    dcc:
      system:
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
对于 Redisson 的配置，可以参考 Redisson 的官方文档：https://redisson.pro/docs/integration-with-spring 按需配置即可
### step3: 通过注解方式使用
1. 使用字段名作为属性名
```java
@DccConfig("0")
private String t1;
```
2. 使用自定义属性名
```java
@DccConfig("custom:0")
private String t2;
```
### step4: 配置变更
```java
@Resource
private RTopic dynamicConfigCenterRedisTopic;
dynamicConfigCenterRedisTopic.publish(new AttributeEntity("t1", "1"));
dynamicConfigCenterRedisTopic.publish(new AttributeEntity("custom", "1"));
```

