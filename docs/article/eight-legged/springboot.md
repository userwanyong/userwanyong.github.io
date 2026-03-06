# SpringBoot 八股汇总

<img src="https://img.shields.io/badge/-Spring%20Boot-6DB33F?logo=Spring-Boot&logoColor=FFF" alt="Spring Boot" style="display: inline-block;margin-right: 2px" /> 
<img src="https://img.shields.io/badge/-八股文-8A2E2" alt="" style="display: inline-block;margin-right: 2px"/> 

### 1. 介绍一下 SpringBoot，与传统的 Spring 有什么区别
1. 传统 Spring 需要手动管理 jar 包、处理依赖冲突、编写 xml 配置文件；而 SpringBoot 相当于 Spring 的脚手架，拥有起步依赖、自动配置、内嵌服务器等特性，我们只需要关心业务代码的编写即可
    - 起步依赖 starters：是预设好的依赖包集合，只需要加一个依赖，就能快速集成所需功能
    - 自动配置：这是 SpringBoot 的核心特性，遵循约定大于配置，SpringBoot 启动时，`@SpringBootApplication`中的`@EnableAutoConfiguration`注解就会生效，这个注解里有个`@Import()`，触发 AutoConfigurationImportSelector 去读 spring.factories 文件中的键值对，得到配置类，然后逐个检查这些类上的条件注解，满足条件就会加载该配置类，注册 Bean 到容器
    - 内嵌服务器：自带 Tomcat，打成 jar 包后，使用命令java -jar就能运行，无需单独部署Web服务器
    - 代码和配置分离：可以通过 application-{profile}.yml 来区分开发、测试、生产环境，也可以通过命令参数、环境变量来修改配置，无需重新打包
    - Actuator 监控：提供了一系列 http 端点，可以让我们看到应用的健康状态（/health）、内存指标（/metrics）、环境配置（/env）、日志管理（/loggers）、基本信息（/info）等
2. 关于自动配置方面，SpringBoot2.7和3.0版本有变化：2.7之前用MEAT-INF/spring.factories文件通过键值对存储信息；2.7版本之后引入了MEAT-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports专门存放自动配置类，每行一个；3.0彻底移除MEAT-INF/spring.factories这种自动配置的方式，但这个文件依然存在，用来存放 ApplicationContextInitializer、ApplicationListener 等 SPI 扩展
3. SpringBoot 打包出来的 jar 包叫 Fat jar，里面包含所有依赖的 jar 包，有个 BOOT-INF 目录，classes 放代码，lib 放所有依赖。启动时用的不是标准的 JarLauncher，而是 SpringBoot 自己的启动器，可以从嵌套的 jar 中加载类，直接通过java -jar运行，普通 jar 包做不到
### 2. SpringBoot 打成的 JAR 和普通的 JAR 的区别
1. 普通 jar：包含 .class 文件、资源、清单文件，但依赖库不会打进去，使用时还需要通过 -classpath 指定外部依赖的位置
2. SpringBoot 的 jar：除了打包 .calss 文件、资源（放到 BOOT-INF/classes 目录下）清单文件外，还会把所有依赖原封不动的放到 BOOT-INF/lib 目录下，并内嵌 Tomat 之类的服务器，可以直接通过java -jar命令启动

    ::: details 点击查看示例
    ```
    <!-- 普通 jar  -->
    myapp.jar
    ├── com/
    │   └── example/
    │       └── MainClass.class
    └── META-INF/
        └── MANIFEST.MF
        
    <!-- SpringBoot 的 jar  -->
    myapp.jar
    ├── META-INF/
    |   └── MANIFEST.MF  # JAR 的清单文件，指向主类
    ├── BOOT-INF/
    |   └── classes/     # 应用的 .class 文件和资源文件
    |   └── lib/         # 应用的依赖库
    └── org/springframework/boot/loader/  # Spring Boot 的自定义类加载器
        └── JarLauncher.class
        └── WarLauncher.class
    ```
    :::

3. 需要注意的是，Java 不支持从 jar 里加载嵌套的 jar，传统的方式是把所有依赖全部解压后重新打包，与 .calss 文件放在一起，但这样会出现同名文件覆盖问题；所以 SpringBoot 通过自定义类加载器，使得依赖库可以保持原始的 jar 格式嵌套存放
4. 再说一说 Jar 包的启动流程：运行 jar 包时，JVM 会去 MANIFEST.MF 里找 Main-Class，也就是JarLauncher；创建自定义的类加载器（LaunchedURLClassLoader）加载 BOOT-INF/classes 和 BOOT-INF/lib 下的文件，然后通过 MANIFEST.MF 里的 Start-Class 指定真正的主类，最后通过反射调用主类的 main 方法
    ::: details 点击查看示例
    ```
    <!-- Main-Class 指向 Spring Boot 的启动器（2.x版本） -->
    Main-Class: org.springframework.boot.loader.JarLauncher

    <!-- Main-Class 指向 Spring Boot 的启动器（3.2+版本） -->
    Main-Class: org.springframework.boot.loader.launch.JarLauncher

    <!-- Start-Class 指向真正的应用入口 -->
    Start-Class: com.mycompany.project.MyApplication
    ```
    :::
5. 我想将指定的依赖排除，运行时通过 classpath 加载，应该怎样做？可以使用 PropertiesLauncher 替代JarLauncher 即可，具体方法是在spring-boot-maven-plugin里指定`<manifest>`，对于要排除的依赖可以在`<dependency>`层面排除，也可以在spring-boot-maven-plugin里排除，最后使用java -Dloader.path=/xxx -jar app.jar启动即可
### 3. 说说 SpringBoot 的启动流程
1. 从带有`@SpringBootApplication`注解的 main() 方法开始，分为两个阶段，new SpringApplication 和run
2. 第一阶段：new SpringApplication
    - 先判断应用的类型，是 Web 应用（Servlet），还是响应式应用（Reactive），还是普通应用
    - 然后设置初始化器、设置启动监听器、确定主应用类
3. 第二阶段：run
    - 把配置文件 application.yml 、环境变量、命令行参数都加载好，组成一个环境对象
    - 根据第一步确定的类型，创建一个空的 Spring IOC 容器
    - Spring 解析`@SpringBootApplication`，扫描所有 Bean，执行自动配置，把所有组件注册到容器里（Tomcat 会在此时启动）
    - 容器刷新完成，会发送启动完成事件，通知所有监听器
    - 最后检查有没有实现 CommandLineRunner 或 ApplicationRunner 的 Bean，有的话就执行他们的 run方法（通常是开机自启的任务）
### 4. SpringBoot Starter 是什么，里面的默认配置如何覆盖
1. SpringBoot Starter 将某个功能所需要的依赖都捆绑在一起，你只需要引入这一个依赖即可实现特定功能，而不需要自己去找对应组件、自己处理冲突
2. 对于里面的默认值，Starter 内部一般都会通过`@ConfigurationProperties`来绑定属性，你只需要在 application.yml 中写同样的key就能覆盖默认值；另一种方法就是自己实现 Bean，因为大多 Starter 内部都会使用`@ConditionalOnMissingBean`表示容器中没有这个 Bean 才使用它，如果用户自定义了就不用这个默认 Bean 了
### 5. SpringBoot 支持哪些嵌入 Web 容器
1. Tomcat：SpringBoot 默认 Web 容器，BIO/NIO，默认 200 个工作线程，大多数场景直接用它
2. Jetty：内存占用比 Tomcat 小，使用 NIO 非阻塞模型，对长连接支持友好，适用于 WebSocket/Server Sent Event 这类需要维持大量长连接的场景
3. Undertow：由 Red Hat 出品，JBoss/WildFly 的默认容器，使用 XNIO 实现非阻塞 IO，适用于高并发短连接的场景
4. Netty：响应式 WebFlux 应用默认使用它（严格来说，Netty 是响应式服务器，不是 Web 容器）
5. 如何切换容器？SpringBoot 默认使用 Tomcat，如果想要变更，可以在spring-boot-starter-web中排除spring-boot-starter-tomcat，然后手动添加spring-boot-starter-jetty等容器
### 6. Tomcat 中 BIO 与 NIO 的区别
1. BIO：阻塞式，每个连接占用一个线程，在高并发下性能较差（InputStream/OutputStream）
2. NIO：非阻塞，采用多路复用，一个线程处理多个连接，高并发下性能好（Channel/Buffer/Selector）
3. Tomcat 8.0 开始默认使用 NIO，9.0 移除了 BIO 连接器
### 7. SpringBoot 默认可以同时处理的最大请求数是多少
1. 默认可以同时处理的最大请求数：最大连接数 max-connections + 队列 accept-count = 8192+100=8292
2. 这两个参数可以通过配置文件来调整
3. 具体过程：当请求到达，检查当前连接数有没有超过 max-connections，没超过就接受连接，交给工作线程处理；如果当前连接数满了，会判断 accept-count 队列有没有满，如果有位置，就在操作系统层面排队等着；要是两个都满了，直接拒绝
4. 最大连接数和最大线程数的关系：max-connections 是能同时持有的 TCP 连接数；而 max-threads 是实际处理请求的工作线程数，默认最大线程数为 200
5. 先说一说 max-threads，它在 Tomcat 和 JDK 中的策略不一样，JDK 是核心线程数满了先放在队列，等队列满了再创建非核心线程处理；而在 Tomcat 中，因为是 IO 密集型任务，核心线程数满了会立刻创建非核心线程，直到达到 max-threads 后才放进队列
6. 再回到它们俩之间的关系，Tomcat 8.0 之后由 BIO 改为 NIO，这使得一个线程可以监听多个连接；NIO 模式下，Acceptor 线程负责接受连接，Poller 线程通过多路复用器 selector 监听事件，有数据来了才交给工作线程处理，没有数据的连接就不占用工作线程，所以 200 个工作线程配合 NIO，能抗住 8000 多个连接
### 8. 想要在 SpringBoot 启动时执行特定代码，有哪些方式？
1. 实现 CommandLineRunner 接口：在 SpringBoot 启动完之后执行，可以有多个实现类，使用`@Order`控制顺序，拿到的是原始数组（此时所有 Bean 等环境已经加载完成，适合做全局初始化，比如预热缓存，建立连接池等场景）
    ::: details 点击查看示例
    ```java
    @Component
    @Order(1)
    public class MyCommandLineRunner implements CommandLineRunner {
        @Override
        public void run(String... args) throws Exception { 
            // args = ["file.txt", "--server.port=8081"]
            System.out.println("Application started!");
        }
    }
    ```
    :::
2. 实现 ApplicationRunner 接口：跟 CommandLineRunner 类似，但可以接受和处理启动参数（ApplicationArguments），同样遵循`@Order`配置
    ::: details 点击查看示例
    ```java
    @Component
    @Order(2)
    public class MyApplicationRunner implements ApplicationRunner {
        @Override
        public void run(ApplicationArguments args) throws Exception {
            // ["file.txt"] ["server.port"] ["8081"]
            System.out.println("ApplicationRunner: arguments: " + args);
        }
    }
    ```
    :::
3. 使用`@PostConstruct`注解 [Java标准]：在 Bean 初始化后执行（如果你的代码依赖其他 Bean，而此时其他 Bean 还没初始化好，可能会拿到 null 或触发循环依赖，所以适用于校验自身必要配置等场景）
    ::: details 点击查看示例
    ```java
    @Component
    public class MyPostConstructBean {
        @PostConstruct
        public void init() {
            System.out.println("PostConstruct: Bean initialized!");
        }
    }
    ```
    :::
4. 实现 InitializingBean 接口 [Spring接口]：他提供了 afterPropertiesSet 方法，在初始化 Bean 之后执行（如果你的代码依赖其他 Bean，而此时其他 Bean 还没初始化好，可能会拿到 null 或触发循环依赖，所以适用于校验自身必要配置等场景）
    ::: details 点击查看示例
    ```java
    @Component
    public class MyInitializingBean implements InitializingBean {
        @Override
        public void afterPropertiesSet() throws Exception {
            System.out.println("InitializingBean: Properties set!");
        }
    }
    ```
    :::
5. 使用 Spring 事件监听器：通过监听 Spring 事件，执行特定代码（非常灵活，可以监听启动过程中的不同阶段）
    ::: details 点击查看示例
    ```java
    @Component
    public class MyEventListener {
        @EventListener
        public void onApplicationEvent(ContextRefreshedEvent event) {
            System.out.println("EventListener: Context refreshed!");
        }
    }
    ```
    :::
6. 实现 BeanPostProcessor 接口：在初始化 Bean 之前或之后执行（注意它会作用于容器中的所有 Bean，注意做好类型判断，不要影响其他 Bean。AOP、`@Autowired`注入、`@Value`解析都是通过它实现的）
    ::: details 点击查看示例
    ```java
    @Component
    public class MyBeanPostProcessor implements BeanPostProcessor {
        @Override
        public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
            // bean 初始化前
            if (bean instanceof MySpecificBean) {
                System.out.println("BeanPostProcessor: Before initialization");
            }
            return bean;
        }

        @Override
        public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // bean 初始化后
            if (bean instanceof MySpecificBean) {
                System.out.println("BeanPostProcessor: After initialization");
            }
            return bean;
        }
    }
    ```
    :::
### 9. SpringBoot 的核心注解
1. `@SpringBootApplication` ：它由`@Configuration`、`@EnableAutoConfiguration`、`@ComponentScan`这三个注解组成
    - `@Configuration`：表示该类是 Spring 的配置类
    - `@EnableAutoConfiguration`：启用 SpringBoot 的自动配置功能，根据类路径中的依赖自动配置 Spring 中的各种组件
    - `@ComponentScan`：自动扫描当前包及其子包带有 Spring 注解的类（比如`@Controller`、`@Service`等）
### 10. `@Async` 什么时候会失效
1. 它的底层是通过 AOP 代理来实现的，只有调用走代理对象的方法，才能被拦截丢到线程池去执行，所以`@Async`失效的根本原因就是代理没生效！
2. 场景一：同类内部调用，调用 this.method() 指向原始对象，没经过 AOP 代理，注解失效（可以把异步方法拆到另一个类里/自己注入自己/配置`@EnableAspectJAutoProxy(exposeProxy= true)`，用AopContext.currentProxy() 拿到代理对象再调用）
    ::: details 点击查看示例
    ```java
    @Service
    public class OrderService {
        public void createOrder() {
            // 失效！this 指向原始对象，不是代理
            this.sendNotification();
        }
        @Async
        public void sendNotification() {
            // 期望异步执行，但实际是同步的
        }
    }

    //解决方案一：把异步方法拆到另一个类里
    @Service
    public class OrderService {
        @Autowired
        private NotificationService notificationService;
        public void createOrder() {
            // 走的是 NotificationService 的代理对象
            notificationService.sendNotification();
        }
    }
    @Service
    public class NotificationService {
        @Async
        public void sendNotification() {
            // 这次能异步执行了
        }
    }
    //解决方案二：自己注入自己
    @Service
    public class OrderService {
        @Autowired
        private OrderService self;  // 注入的是代理对象
        public void createOrder() {
            self.sendNotification();  // 走代理
        }
        @Async
        public void sendNotification() { }
    }
    //解决方案三：配置@EnableAspectJAutoProxy(exposeProxy= true)，用AopContext.currentProxy()拿到代理对象再调用
    @EnableAsync
    @EnableAspectJAutoProxy(exposeProxy = true)
    @SpringBootApplication
    public class Application { }
    @Service
    public class OrderService {
        public void createOrder() {
            // 拿到代理对象再调用
            ((OrderService) AopContext.currentProxy()).sendNotification();
        }
        @Async
        public void sendNotification() { }
    }
    ```
    :::
3. 场景二：非 public 方法，JDK/CGLIB 动态代理无法拦截 private、protected 方法（JDK动态代理基于 java 反射，生成一个实现接口的代理类，因此目标类至少实现一个接口；CGLIB 基于字节码增强，通过继承目标类生成子类；Spring 默认有接口用 JDK，没有接口用 CGLIB，但它们俩都不能代理 final 类和方法）
4. 场景三：未开启异步支持，即配置类/启动类缺少`@EnableAsync`注解，Spring 不会扫描并创建异步代理
5. 场景四：对象非 Spring 代理，手动 new 出来的对象脱离容器，Spring 无法感知
6. 场景五：返回值类型错误，返回值只能是 void/Future/CompletableFuture 类型，否则调用方只能拿到 null
7. 深入说说`@Async`代理机制的原理？`@Async`的实现靠的是 AsyncAnnotationBeanPostProcessor 这个后置处理器，Spring 启动时这个处理器会扫描所有 Bean，发现有`@Async`注解的方法就给这个 Bean 套一层代理。代理对象在方法被调用时，判断方法上有没有`@Async`，有的话就把这个任务包装成 Callable 任务，丢到线程池去执行，然后立即返回
8. 对于异常处理的方式？如果返回 Future/CompletableFuture，调用方可以通过 get()/exceptionally 拿到异常；如果返回值是 void，需要自己实现 AsyncUncaughtExceptionHandler 处理异常
    ::: details 点击查看示例
    ```java
    @Configuration
    @EnableAsync
    public class AsyncConfig implements AsyncConfigurer {
        @Override
        public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
            return (ex, method, params) -> {
                // 记录日志、发告警
                log.error("Async method {} threw exception: {}", method.getName(), ex.getMessage());
            };
        }
    }
    ```
    :::
### 11. SpringBoot 中读取配置属性的方法有哪些
1. `@Value`：单属性注入，只支持精确匹配！（比如`@Value("${my-app}")`，配置文件也要 my-app 这样命名；也就是说注入值和配置文件中的属性命名必须相同）；注入时如果属性不存在配置文件中，会报错IllegalArgumentException，所以最好指定一个默认值
`@Value("${my.timeout:5000}")`  // 带默认值
private int timeout;
2. `@ConfigurationProperties`：批量属性绑定，配置多/层级结构，支持松散绑定，即配置文件中的属性名不需要和 Java 字段名完全一致（比如对于 myApp 字段，配置文件中 myApp/my_app/my-app/MY_APP都可以进行绑定）
    ::: details 点击查看示例
    ```java
    @Component
    @ConfigurationProperties(prefix = "my.custom")
    public class MyCustomProperties {
        private String property;
        private int timeout;
        private List<String> servers;
        // getter/setter
    }
    ```
    :::
3. Environment：编程式获取，工具类或框架中用的多
    ::: details 点击查看示例
    ```java
    @Autowired
    private Environment env;

    public void someMethod() {
        String value = env.getProperty("my.custom.property");
        int timeout = env.getProperty("my.timeout", Integer.class, 5000);
    }
    ```
    :::
### 12. 配置文件加载的优先级
1. SpringBoot 的配置加载遵循“外部优先、profile优先、命令行最高”的原则
2. 命令行参数>环境变量> jar 包外的 application-{profile}.properties > jar 包外的 application.properties > jar 包内的 application-{profile}.properties > jar 包内的 application.properties (同一位置 .properties > .yml )
### 13. 说一说你对 SpringBoot 事件机制的了解
1. 本质就是发布-订阅模式，基于 Spring 的框架体系实现，让应用内部各个组件之间能够解耦通信
2. 流程：通过发布器（ApplicationEventPublisher）把事件发布出去 -> 广播器（ApplicationEventMulticaster）接收事件并广播给所有注册的监听器 -> 监听器收到事件后执行对应的逻辑处理
3. 发布者不需要关心谁在监听，监听器也不用关心事件是谁发的，两边完全解耦
4. 应用场景：预热缓存、建立连接池、监听 ApplicationReadyEvent、业务解耦、异步处理等
5. SpringBoot 内置了一系列内置事件，我将按顺序写出
    - ApplicationStartingEvent：run 方法被调用，日志和监听器还没初始化
    - ApplicationEnvironmentPreparedEvent：环境准备好了，但 ApplicationContext 还没创建
    - ApplicationContextInitializedEvent：ApplicationContext 创建了，Bean 还没加载
    - ApplicationPreparedEvent：Bean 加载完成，但还未刷新
    - ContextRefreshedEvent：ApplicationContext 刷新完成
    - ApplicationStartedEvent：应用启动完成，CommandLineRunner 还没执行
    - ApplicationReadyEvent：已经就绪，可以接收请求了
    - ApplicationFailedEvent：启动失败触发
6. 自定义事件：Spring 4.2 开始，事件对象不再强制继承 ApplicationEvent，可以是任意 pojo；监听器也不用实现 ApplicationListener 接口，使用`@EventListener`注解即可
    ::: details 点击查看示例
    ```java
    // 定义事件
    public class OrderCreatedEvent {
        private Long orderId;
        private BigDecimal amount;
        public OrderCreatedEvent(Long orderId, BigDecimal amount) {
            this.orderId = orderId;
            this.amount = amount;
        }
        // getter...
    }

    //发布事件
    @Service
    public class OrderService {
        @Autowired
        private ApplicationEventPublisher eventPublisher;
        @Transactional
        public void createOrder(Order order) {
            // 保存订单
            orderRepository.save(order);
            // 发布事件
            eventPublisher.publishEvent(new OrderCreatedEvent(order.getId(), order.getAmount()));
        }
    }

    //监听事件
    @Component
    public class OrderEventListener {
        @EventListener
        public void onOrderCreated(OrderCreatedEvent event) {
            // 发送通知、更新统计等
            log.info("订单创建成功: {}", event.getOrderId());
        }
    }
    ```
    :::
7. 事务绑定事件：假设有一个情况，用户下单之后立刻发送事件，如果用的是普通的`@EventLintener`，事件在事务提交前就发出去了，一旦事务回滚，造成的信息就会不一致了，这时可以使用`@TransactionEventLintener`来绑定事件触发时机，比如事务提交可以用`@TransactionEventLintener(phase = TransactionPhase.AFTER_COMMIT)`，它有四个配置，分别为，before_commit/after_commit/after_rollback/after_completion
8. 与消息队列的区别：Spring 事件机制是进程内的，事件发完如果 JVM 挂了事件就丢了；而消息队列可以在消费者重启后继续消费。所以单体应用内部解耦用 Spring 事件即可，涉及到可靠性的场景就要用消息队列了
### 14. SpringBoot 中如何配置多数据源
1. 在配置文件（application.yml）里定义多个数据源的连接信息，可以用不同前缀区分
2. 为每个数据源写一个配置类，创建 DataSource、SqlSessionFactory、TransactionManager 三个 Bean，主数据源加`@Primary`
3. Mapper 接口按数据源分包，配置类上用`@MapperScan`绑定包路径和 SqlSessionFactory
4. Service 层调用不同包下的 Mapper 时，自动走对应的数据源。使用`@Transactional`时通过 transactionManager 参数指定用哪个事务管理器
    ::: details 点击查看示例
    ```yml
    spring:
    datasource:
        primary:
        jdbc-url: jdbc:mysql://localhost:3306/order_db
        username: root
        password: 123456
        driver-class-name: com.mysql.cj.jdbc.Driver
        secondary:
        jdbc-url: jdbc:mysql://localhost:3306/user_db
        username: root
        password: 123456
        driver-class-name: com.mysql.cj.jdbc.Driver
    ```
    ```java
    // 【静态数据源】主配置类（其他配置类一样，去掉@Primary，替换前缀和包路径即可）
    @Configuration
    @MapperScan(basePackages = "com.example.mapper.primary", 
                sqlSessionFactoryRef = "primarySqlSessionFactory")
    public class PrimaryDataSourceConfig {

        @Primary
        @Bean("primaryDataSource")
        @ConfigurationProperties(prefix = "spring.datasource.primary")
        public DataSource primaryDataSource() {
            return DataSourceBuilder.create().build();
        }

        @Primary
        @Bean("primarySqlSessionFactory")
        public SqlSessionFactory primarySqlSessionFactory(@Qualifier("primaryDataSource") DataSource dataSource) throws Exception {
            SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
            factoryBean.setDataSource(dataSource);
            factoryBean.setMapperLocations(
                new PathMatchingResourcePatternResolver()
                    .getResources("classpath:mapper/primary/*.xml"));
            return factoryBean.getObject();
        }

        @Primary
        @Bean("primaryTransactionManager")
        public DataSourceTransactionManager primaryTransactionManager(@Qualifier("primaryDataSource") DataSource dataSource) {
            return new DataSourceTransactionManager(dataSource);
        }
    }
    ```
    :::
5. 对于读写分离、多租户等场景，需要使用动态数据源。实现思路是用一个路由数据源包装多个实际数据源，每次获取连接时根据 ThreadLocal 里存的标识决定走哪个数据源
    ::: details 点击查看示例
    ```java
    //数据源上下文
    public class DataSourceContextHolder {
        private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();
        public static void setDataSource(String dataSource) {
            CONTEXT.set(dataSource);
        }
        public static String getDataSource() {
            return CONTEXT.get();
        }
        public static void clear() {
            CONTEXT.remove();
        }
    }

    //路由数据源
    public class DynamicDataSource extends AbstractRoutingDataSource {
        @Override
        protected Object determineCurrentLookupKey() {
            return DataSourceContextHolder.getDataSource();
        }
    }

    //路由数据源配置类
    @Configuration
    public class DynamicDataSourceConfig {
        @Bean("dynamicDataSource")
        public DataSource dynamicDataSource(
                @Qualifier("primaryDataSource") DataSource primary,
                @Qualifier("secondaryDataSource") DataSource secondary) {
            DynamicDataSource dynamic = new DynamicDataSource();
            Map<Object, Object> targetDataSources = new HashMap<>();
            targetDataSources.put("primary", primary);
            targetDataSources.put("secondary", secondary);
            dynamic.setTargetDataSources(targetDataSources);
            dynamic.setDefaultTargetDataSource(primary);
            return dynamic;
        }
    }

    //实现AOP注解
    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface DS {
        String value() default "primary";
    }

    @Aspect
    @Component
    public class DataSourceAspect {
        @Around("@annotation(ds)")
        public Object around(ProceedingJoinPoint point, DS ds) throws Throwable {
            DataSourceContextHolder.setDataSource(ds.value());
            try {
                return point.proceed();
            } finally {
                DataSourceContextHolder.clear();
            }
        }
    }

    //使用
    @Service
    public class UserService {
        //如果需要事务，要在切换数据源之后再开启，否则切换数据源后事务会失效（或者在DataSourceAspect切面类添加		@Order(-1)或者显式用事务管理器@Transactional("secondaryTransactionManager")）
        @DS("secondary")
        @Transactional 
        public User getUser(Long id) {
            return userMapper.selectById(id);
        }
    }
    ```
    :::
6. `@Qualifier`：当同一类型的 Bean 有多个时，精确告诉 Spring 要用哪一个；`@Primary`：在依赖注入时默认选择被他标记的 Bean
### 15. 多数据源场景下如何实现读写分离
1. 直接在方法指定，如`@DS("secondary")`
2. 可以使用 AOP 拦截 Service 方法，根据方法名前缀判断读写，比如 get/query/find 开头的走从库， insert/update/delete 开头的走主库
3. 编写 AOP 拦截`@Transactional`注解并判断 readOnly 属性，为 true 走从库，否则走主库
### 16. SpringBoot 如何处理跨域
1. 局部：在 Controller 方法加上`@CrossOrigin`注解
2. 全局：实现 WebMvcConfigurer 接口，重写 addCorsMappings 方法
3. 过滤器：CorsFilter，它是在 Servlet 层面处理的，优先级比拦截器高。能避免一些问题（比如 JWT 校验场景：Cors 的拦截器在后面，如果在前面的 JWT 拦截器被拦截了，根本走不到 Cors 拦截器，直接就返回了，此时浏览器就会报跨域问题，就像 addCorsMappings 失效了似的，解决办法是在 JWT 的拦截器中放行预检请求）
4. 什么是跨域呢？浏览器有个同源策略，只有当协议/域名/端口这三个一致的时候才算同源，不同源的请求会被浏览器拦截。解决的本质就是让服务端在响应头里告诉浏览器，我允许某个域来访问。关键参数有域、请求方式、请求头等
5. 那预检请求又是什么？它主要是针对复杂请求（自定义请求头 PUT/DELEET 方法），浏览器会先发送一个预检请求 options，问一下服务端行不行，等预检通过后才发送真正的请求。对于简单的请求（GET/HEAD/POST）会直接发送，服务端会返回带 Cors 头的响应，浏览器检查响应头决定是否允许读取。浏览器会缓存预检结果，这也就意味着不用每次请求都先发个预检请求，只有缓存过期或请求头、请求方法发生变更才重新预检
6. 在实际开发中大多数都是复杂请求，因为用了 JSON，Content-Type 是application/json（简单请求的Content-Type 是application/x-www-form-urlencoded/multipart/form-data/text/plain）
### 17. 拦截器的使用方式
1. 实现 HandlerInterceptor 接口，重写里面的三个方法；然后写一个配置类实现 WebMvcConfigurer 接口，在 addInterceptors 方法里把拦截器注册进去。注意如果你注册拦截器时用的是 new MyInterceptor() 的方式，那么 MyInterceptor 这个对象就不归 Spring 管理，MyInterceptor 里面使用`@Autowired`注入的依赖都是 null，所以最好就是直接把拦截器也声明为 Bean，在配置类里注入
    ::: details 点击查看示例
    ```java
    @Component
    public class MyInterceptor implements HandlerInterceptor {
    //注意：如果注册拦截器时使用的是 new MyInterceptor()，那么 userService 为 null
    @Autowired
    private UserService userService; 
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("请求开始前");
        return true;  // 返回 true 继续处理，false 则拦截请求
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("请求后");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
        System.out.println("请求完成");
    }
    }
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Autowired
        private MyInterceptor myInterceptor;
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(myInterceptor).addPathPatterns("/api/**");
        }
    }
    ```
    :::
2. 拦截器的执行流程：preHandle->Controller->postHandle->afterCompletion，其中 afterCompletion 一定会执行，不管 Controller 方法是否执行成功，类似于 finally
3. 拦截器的执行顺序：对于 preHandle`@Order()`的值越小越先执行，而对于另外两个，越小越后执行，就类似于以 Controller 为轴，执行顺序对称（注意如果是在 addInterceptors 里注册会以注册顺序为准，越先注册越先执行）
4. 过滤器于拦截器的区别：过滤器是 Servlet 层面的，位于整个请求链最前面，比 Spring 中的组件都早执行，能拿到原始的 ServletRequest和ServletResponse，但拿不到 Spring 的上下文信息（用于字符编码、跨域）；拦截器则是 Spring MVC 的组件，能拿到 HandlerMethod，知道要执行哪个 Controller 方法，还能注入 Spring Bean（用于权限校验、操作日志）
### 18. 为什么Spring不推荐 `@Autowired` 字段注入
1. 会触发空指针问题：字段注入发生在构造器执行之后，所以在构造器里访问被注入的字段必为 null。（使用构造器注入就没这个问题）
    ::: details 点击查看示例
    ```java
    @Service
    public class OrderService {
        @Autowired
        private UserService userService;
        private String defaultUser;
        public OrderService() {
            // 这里 userService 还是 null
            this.defaultUser = userService.getDefaultUser();
        }
    }
    ```
    :::
2. 对单元测试不友好：字段注入的依赖是 private，外部无法直接设置，想进行单元测试就要启动整个容器。
    ::: details 点击查看示例
    ```java
    // 字段注入，测试很难搞
    @Test
    void testOrder() {
        OrderService service = new OrderService();
        // userService 是 null，没法测
    }

    // 构造器注入，直接 new 就能测
    @Test
    void testOrder() {
        UserService mockUser = Mockito.mock(UserService.class);
        OrderService service = new OrderService(mockUser, mockProduct);
        // 正常测试
    }
    ```
    :::
3. 掩盖循环依赖：Spring 的三级缓存能解决注入字段的循环依赖。（构造器注入遇到循环依赖就报错，透明）
4. 容易违反单一原则：字段注入加个注解就行了，不知不觉能注入十几个依赖。（而使用构造器注入，参数列表会越来越长，提示着你要不要考虑拆分职责）
5. 字段不能声明为 final，对象状态可变。（构造器注入可以声明为 final，确保对象不可变）
6. `@Autowired`与`@Resource`的区别？`@Autowired`是 Spring 注解，按类型匹配；`@Resource`是 Java 标准 JSR-250 定义的，按名称匹配。如果坚持用字段注入，`@Resource`比`@Autowired`要好一点，至少代码没有和 Spring 强绑定，换成其他 IOC 容器也能跑
7. 可以使用 Lombock 的`@RequiredArgsConstrucuor`简化构造器注入，只要把字段声明为 final，Lombock会自动生成包含这些字段的构造器。代码量更低，却拥有构造器注入的所有优点
### 19. SpringBoot 的 1、2、3 版本有什么变化
1. SpringBoot 1.x -> 2.x
    - 底层框架：Spring 4 -> Spring 5，传统是 Servlet 阻塞模型，新增响应式编程模型（WebFlux + Reactor）
    - 嵌入容器：Tomcat 8.x -> Tomcat 9.x；Jetty 9.x -> Jetty9.0.x；Undertow 1.x -> Undertow 2.x
    - 连接池：Tomcat JDBC -> HikariCP，在字节码、连接管理、默认配置等方面做了优化
    - 监控：Actuator 端点默认全开 -> 默认关闭大部分端点，默认只暴露 /health、/info 两个端点
    - 部分属性名做了调整：比如server.contextPath->server.servlet.context-path（可以使用spring-boot-properties-migrator依赖，它会在启动时扫描出所有过时的配置并打印警告）
    - 支持 Http2：server.http2.enabled=true
    - JDK版本：推荐 11 或更高版本，最低为 JDK 8
2. SpringBoot 2.x -> 3.x
    - javax.* -> jakarta.*，Servlet、JPA、JMS 这些 API 都要变
    - JDK17 起步，主要是因为用新特性来优化框架本身
    - GraalVM 原生编译，把 Java 代码在构建阶段就编译成机器码，运行时不需要 JVM，编译出来的可执行文件启动时间能从秒级压缩到毫秒级，内存占用也大大减小（缺点就是反射、动态代理这些需要提前配置 metadata，不然运行会报错）
    - Observability 可观测性升级，分为三个维度，指标（Metrics）、链路（Tracing）、日志（Logging），Micrometer Tracing 代替了老的 Spring Cloud Sleuth，直接内置在 SpringBoot 里
    - Spring Security 6 认证授权升级，完善 OAuth 2.1 和 OIDC 支持，彻底废弃WebSecurityConfigurerAdapter，改用 SecurityFilterChain Bean 的方式。对老代码有破坏性变化
