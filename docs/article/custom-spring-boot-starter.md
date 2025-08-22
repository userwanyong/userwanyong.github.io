# 自定义 Spring Boot Starter
<img src="https://img.shields.io/badge/-Java-F78C40?logo=OpenJDK&logoColor=FFF" alt="Java" style="display: inline-block;margin-right: 2px" />
<img src="https://img.shields.io/badge/-Spring%20Boot-6DB33F?logo=Spring-Boot&logoColor=FFF" alt="Spring Boot" style="display: inline-block;margin-right: 2px" /> 
<img src="https://img.shields.io/badge/-Maven-C71A36?logo=Apache-Maven&logoColor=FFF" alt="Maven" style="display: inline-block;margin-right: 2px" /> 

## 1. 命名规范
- 官方的命名方式：spring-boot-starter-xxx
- 第三方命名方式：xxx-spring-boot-starter
## 2. 功能开发
### 2.1. 引入基础依赖
::: code-group
```xml [pom.xml]
<!-- Spring Boot Starter基础依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<!-- 自动配置核心依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-autoconfigure</artifactId>
</dependency>
<!-- 用于生成配置元数据，提供IDE提示支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
<!-- 其他你需要的依赖 -->
```
:::

### 2.2. 编写配置信息类
::: code-group
```java
import cn.wanyj.component.dcc.types.common.Constants;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "wanyj.component.dcc", ignoreInvalidFields = true)
public class DynamicConfigCenterAutoConfigProperties {

    private String system;

    public String getFinalAttributeName(String attributeName) {
        return this.system + Constants.UNDERLINE + attributeName;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }
}
```
:::

这样你就可以在yml文件中配置了
::: code-group
```yml [application.yml]
wanyj:
  component:
    dcc:
      system: test
```
:::

### 2.3. 完成业务逻辑，编写自动配置类
::: code-group
```java
import cn.wanyj.component.dcc.domain.entity.AttributeEntity;
import cn.wanyj.component.dcc.domain.service.DynamicConfigCenterService;
import cn.wanyj.component.dcc.domain.service.DynamicConfigCenterServiceImpl;
import cn.wanyj.component.dcc.listener.DynamicConfigCenterAdjustListener;
import cn.wanyj.component.dcc.types.common.Constants;
import org.redisson.api.RTopic;
import org.redisson.api.RedissonClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(value = DynamicConfigCenterAutoConfigProperties.class)
public class DynamicConfigCenterRegisterAutoConfig {

    @Bean
    public DynamicConfigCenterService dynamicConfigCenterService(DynamicConfigCenterAutoConfigProperties properties, RedissonClient redissonClient) {
        return new DynamicConfigCenterServiceImpl(properties, redissonClient);
    }

    @Bean
    public DynamicConfigCenterAdjustListener dynamicConfigCenterAdjustListener(DynamicConfigCenterService dynamicConfigCenterService) {
        return new DynamicConfigCenterAdjustListener(dynamicConfigCenterService);
    }

    @Bean
    public RTopic dynamicConfigCenterRedisTopic(DynamicConfigCenterAutoConfigProperties properties, RedissonClient redissonClient, DynamicConfigCenterAdjustListener dynamicConfigCenterAdjustListener) {
        RTopic topic = redissonClient.getTopic(Constants.getTopic(properties.getSystem()));
        topic.addListener(AttributeEntity.class, dynamicConfigCenterAdjustListener);
        return topic;
    }
}
```
:::
  
### 2.4. 使starter生效
- 方式一：注解启动

你需要自定义一个启动注解
::: code-group
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({DynamicConfigCenterRegisterAutoConfig.class}) // [!code highlight]
public @interface EnableDCC {
}
```
:::

然后使用时需要在启动类添加这个注解
::: code-group
```java
@SpringBootApplication
@EnableDCC // [!code highlight]
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
:::

- 方式二：自动生效 
  - 通过 SpringBoot 的 SPI 的机制来去加载我们的 Starter 
  - 需要创建`resource/META-INF/spring.factories`文件 
    - key 为 org.springframework.boot.autoconfigure.EnableAutoConfiguration 
    - value 为自动配置类的全限定名（记得去除前后的空格，否则会不生效）
::: code-group
``` [spring.factories]
org.springframework.boot.autoconfigure.EnableAutoConfiguration=cn.wanyj.component.dcc.config.DynamicConfigCenterRegisterAutoConfig
```
:::

> [!WARNING] 注意
> 在 Springboot3+ 版本完全移除了 spring.factories 的方式
> 需要更改目录结构为
> 
> `resource/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`
>
> ::: code-group
> ``` [org.springframework.boot.autoconfigure.AutoConfiguration.imports]
> cn.wanyj.component.dcc.config.DynamicConfigCenterRegisterAutoConfig
> ```
> :::
