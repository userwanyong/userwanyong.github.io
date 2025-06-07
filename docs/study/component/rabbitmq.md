# RabbitMQ
<Linkcard url="https://www.rabbitmq.com/" title="RobbitMQ官网" description="https://www.rabbitmq.com" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-02-26%20130648.png"></Linkcard>

## 1. 了解MQ
mq的处理方式大多是异步调用的，我们先来聊聊同步与异步的区别
### 1.1. 同步调用 vs 异步调用
**同步调用**

`优点：`
1. 时效性强，能立即得到所有的处理结果

`缺点：`
1. 调用时间长，性能低，需要等待执行结果返回后才能继续向下执行
2. 如果某个服务出现故障，整个事务都要回滚

**异步调用**

`优点：`
1. 耦合度低，业务拓展性强
2. 无需等待返回结果，性能更好
3. 故障隔离，避免了整个事务的回滚
4. 缓存消息，流量削峰填谷

`缺点：`
1. 时效性差，不能立即得到结果
2. 不能确定下游服务是否执行成功
3. 业务安全依赖于消息的可靠性

### 1.2. 常见的MQ
| | **<span style="color:rgb(0, 0, 0);">RabbitMQ</span>** | **<span style="color:rgb(0, 0, 0);">ActiveMQ</span>** | **<span style="color:rgb(0, 0, 0);">RocketMQ</span>** | **<span style="color:rgb(0, 0, 0);">Kafka</span>** |
| :-: | :-: | :-: | :-: | :-: |
| <span style="color:rgb(0, 0, 0);">公司/社区</span> | <span style="color:rgb(0, 0, 0);">Rabbit</span> | <span style="color:rgb(0, 0, 0);">Apache</span> | <span style="color:rgb(0, 0, 0);">阿里</span> | <span style="color:rgb(0, 0, 0);">Apache</span> |
| <span style="color:rgb(0, 0, 0);">开发语言</span> | <span style="color:rgb(0, 0, 0);">Erlang</span> | <span style="color:rgb(0, 0, 0);">Java</span> | <span style="color:rgb(0, 0, 0);">Java</span> | <span style="color:rgb(0, 0, 0);">Scala&Java</span> |
| <span style="color:rgb(0, 0, 0);">协议支持</span> | <span style="color:rgb(0, 0, 0);">AMQP，XMPP，SMTP，STOMP</span> | <span style="color:rgb(0, 0, 0);">OpenWire,STOMP，REST,XMPP,AMQP</span> | <span style="color:rgb(0, 0, 0);">自定义协议</span> | <span style="color:rgb(0, 0, 0);">自定义协议</span> |
| <span style="color:rgb(0, 0, 0);">可用性</span> | <span style="color:rgb(0, 0, 0);">高</span> | <span style="color:rgb(0, 0, 0);">一般</span> | <span style="color:rgb(0, 0, 0);">高</span> | <span style="color:rgb(0, 0, 0);">高</span> |
| <span style="color:rgb(0, 0, 0);">单机吞吐量</span> | <span style="color:rgb(0, 0, 0);">一般</span> | <span style="color:rgb(0, 0, 0);">差</span> | <span style="color:rgb(0, 0, 0);">高</span> | <span style="color:rgb(0, 0, 0);">非常高</span> |
| <span style="color:rgb(0, 0, 0);">消息延迟</span> | <span style="color:rgb(0, 0, 0);">微秒级</span> | <span style="color:rgb(0, 0, 0);">毫秒级</span> | <span style="color:rgb(0, 0, 0);">毫秒级</span> | <span style="color:rgb(0, 0, 0);">毫秒以内</span> |
| <span style="color:rgb(0, 0, 0);">消息可靠性</span> | <span style="color:rgb(0, 0, 0);">高</span> | <span style="color:rgb(0, 0, 0);">一般</span> | <span style="color:rgb(0, 0, 0);">高</span> | <span style="color:rgb(0, 0, 0);">一般</span> |


## 2. 安装
1. **拉取镜像（不指定版本的话，默认标签是latest，代表最新版）**
::: code-group
```bash
docker pull rabbitmq
```
::: 
2. **运行容器（默认latest）**
::: code-group
```bash
docker run \
 -e RABBITMQ_DEFAULT_USER=yong \
 -e RABBITMQ_DEFAULT_PASS=123456 \
 -v mq-plugins:/plugins \
 --name mq \
 --hostname mq \
 -p 15672:15672 \
 -p 5672:5672 \
 --network abc-net\
 -d \
 rabbitmq
```
:::
+ **yong**：将来登录mq的账号
+ **123456**：将来登录mq的密码
+ **mq-plugins**：数据卷
+ **15672**：RabbitMQ提供的管理控制台的端口
+ **5672**：RabbitMQ的消息发送处理接口
+ **network** abc-net：容器的网络（如果没有的话，要先新建，不然会报错）

访问15672端口，就能看到RabbitMQ的控制台啦😄


> [!WARNING] 注意
>如果不能访问，依次执行以下命令即可
>
>进入容器：`docker exec -it mq bash`
>
>验证插件状态：`rabbitmq-plugins list`
>
>在输出中查找rabbitmq_management插件的状态，它应该显示为E*，如果不显示E*，则执行：`rabbitmq-plugins enable rabbitmq_management`
>
>退出容器：`exit`
>
> 重启容器：`docker restart mq`

## 3. 基础知识
### 3.1. 基本概念
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-02-26%20135745.png)
+ **publisher**：生产者，发消息的一方
+ **consumer**：消费者，收消息的一方
+ **exchange**：交换机，将生产者发送的消息投递到队列（只能路由信息，无法存储，发送到队列后消息就没了）
+ **queue**：队列，存储消息（生产者投递的消息会暂存在消息队列中，等待消费者处理）
+ **virtual host**：虚拟主机，起到数据隔离的作用

### 3.2. 交换机类型
+ **fanout**：广播，将消息发送给每一个与之绑定的队列
+ **direct**：订阅，基于RoutingKey（路由key）发送给订阅了消息的队列
+ **topic**：通配符订阅，与Direct类似，只不过RoutingKey可以使用通配符
+ **headers**：头匹配，基于MQ的消息头匹配

## 4. 收发消息
`如果有多个消费者，队列默认给每个消费者的消息是平均的，后面有处理方式`

1. **新建队列**
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261417546.png)

2. **绑定交换机**
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261418978.png)

3. **测试**
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261419820.png)
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261419016.png)


## 5. 数据隔离
一套mq会有多个项目使用，为使各个项目之间互不干扰，需要进行数据隔离

1. **创建用户**（将管理权限分离）
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261423236.png)

2. 登录新创建的用户，**创建虚拟主机**（将每个项目数据进行隔离）
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261423681.png)

## 6. 在java中使用
1. **引入依赖**

::: code-group
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```
:::

2. **配置yml文件**

::: code-group
```yaml
spring:
  rabbitmq:
    host: 192.168.150.101 # RabbitMQ的IP地址
    port: 5672 # 端口
    virtual-host: /lottery-v-host # 虚拟主机
    username: lottery-admin # 用户名
    password: 123456 # 密码
```
:::

### 6.1. 创建交换机与队列及其绑定关系
#### 6.1.1. 使用Bean
`一般在消费者模块编写`

::: code-group
```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DirectConfig {

    @Bean
    public DirectExchange directExchange(){
        // return new DirectExchange("lottery-exchange-direct"); //或
        return ExchangeBuilder.directExchange("lottery-exchange-direct").build();
    }

    @Bean
    public Queue directQueue1(){
        // return new Queue("lottery-direct-queue1"); //或
        return QueueBuilder.durable("lottery-direct-queue1").build();
    }

    @Bean
    public Binding bindingQueue1WithRed(Queue directQueue1, DirectExchange directExchange){
        return BindingBuilder.bind(directQueue1).to(directExchange).with("red");
    }
}
```
::: 


#### 6.1.2. 使用注解（方便）

::: code-group
```java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "lottery-direct-queue1"),
    exchange = @Exchange(name = "lottery-exchange-direct", type = ExchangeTypes.DIRECT),
    key = {"red", "blue"}
))
public void listenDirectQueue1(String msg){
    System.out.println("消费者1接收到direct消息：【" + msg + "】");
}
```
:::

### 6.2. 直接进行队列操作
#### 6.2.1. 1队列1消费
`一般测试时使用，很少在生产中使用`

`发消息`
::: code-group
```java
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testSimpleQueue() {
        // 队列名称
        String queueName = "lottery-queue";
        // 消息
        String message = "hello, spring amqp!";
        // 发送消息
        rabbitTemplate.convertAndSend(queueName, message);
    }
}
```
:::

`收消息`
::: code-group
```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "lottery-queue")
    public void listenSimpleQueueMessage(String msg) throws InterruptedException {
        System.out.println("spring 消费者接收到消息：【" + msg + "】");
    }
}
```
:::

#### 6.2.2. 1队列n消费
只需要添加消费者的数量即可

`两个消费者`
::: code-group
```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "lottery-queue")
    public void listenSimpleQueueMessage1(String msg) throws InterruptedException {
        System.out.println("消费者1接收到消息：【" + msg + "】"+ LocalTime.now());
        Thread.sleep(20);//每秒处理50条消息
    }

    @RabbitListener(queues = "lottery-queue")
    public void listenSimpleQueueMessage2(String msg) throws InterruptedException {
        System.out.println("消费者2接收到消息：【" + msg + "】"+ LocalTime.now());
        Thread.sleep(200);//每秒处理5条消息
    }
}
```
:::

> [!WARNING] 注意
> 强调用户在快速浏览文档时也不应忽略的重要信息。
>
>一条消息只会被一个消费者消费，默认情况下，队列的消息是平均分配的，但有的消费者处理的快，有的处理的慢，效率很低
>
>因此需要按需分配，能者多劳
>
>配置消费者的yml文件即可解决！
>
> ::: code-group
> ```yaml
>spring:
>  rabbitmq:
>    listener:
>      simple:
>        prefetch: 1 # 一次获取一条消息，处理完后才继续获取下一个消息
>```
> :::

### 6.3. 交换机+队列
#### 6.3.1. fanout交换机
假设`lottery-exchange-fanout`这个交换机绑定了`lottery-fanout-queue1`、`lottery-fanout-queue2`这两个队列

`发消息`
::: code-group
```java
@Test
public void testFanoutExchange() {
    // 交换机名称
    String exchangeName = "lottery-exchange-fanout";
    // 消息
    String message = "hello, everyone!";
    rabbitTemplate.convertAndSend(exchangeName, "", message);
}
```
:::

`收消息`
::: code-group
```java
@RabbitListener(queues = "lottery-fanout-queue1")
public void listenFanoutQueue1(String msg) {
    System.out.println("消费者1接收到Fanout消息：【" + msg + "】");
}

@RabbitListener(queues = "lottery-fanout-queue2")
public void listenFanoutQueue2(String msg) {
    System.out.println("消费者2接收到Fanout消息：【" + msg + "】");
}
```
:::

#### 6.3.2. direct交换机
交换机与队列绑定的时候，指定一个`RoutingKey`，在发送消息到交换机的时候，也要指定`RoutingKey`，只有`RoutingKey`一致的队列才会收到消息

假设`lottery-exchange-direct`这个交换机绑定了`lottery-direct-queue1`（bindingKey为blue和red）、`lottery-direct-queue2`（bindingKey为yellow和red）这两个队列

`发消息`
::: code-group
```java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "lottery-exchange-direct";
    // 消息
    String message = "红色";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "red", message);
}
```
:::

`收消息`
::: code-group
```java
@RabbitListener(queues = "lottery-direct-queue1")
public void listenDirectQueue1(String msg) {
    System.out.println("消费者1接收到direct消息：【" + msg + "】");
}

@RabbitListener(queues = "lottery-direct-queue2")
public void listenDirectQueue2(String msg) {
    System.out.println("消费者2接收到direct消息：【" + msg + "】");
}
```
:::

此时，两个队列都能收到，但要将`RoutingKey`改为blue，则只有`lottery-direct-queue1`这个队列收到消息

#### 6.3.3. topic交换机
可以说是direct的升级版，可以使用通配符

1. #：匹配一个或多个词
2. *：匹配一个词

假设`lottery-exchange-topic`这个交换机绑定了`lottery-topic-queue1`（bindingKey为china.#）、`lottery-topic-queue2`（bindingKey为#.news）这两个队列

`发消息`
::: code-group
```java
@Test
public void testSendTopicExchange() {
    // 交换机名称
    String exchangeName = "lottery-exchange-topic";
    // 消息
    String message = "topic";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "china.news", message);
}
```
:::

`收消息`
::: code-group
```java
@RabbitListener(queues = "lottery-topic-queue1")
public void listenTopicQueue1(String msg){
    System.out.println("消费者1接收到topic消息：【" + msg + "】");
}

@RabbitListener(queues = "lottery-topic-queue2")
public void listenTopicQueue2(String msg){
    System.out.println("消费者2接收到topic消息：【" + msg + "】");
}
```
:::

此时，两个队列都能收到，但要将`RoutingKey`改为china.weather则只有`lottery-topic-queue1`这个队列收到消息

> **综上，以上三个交换机在功能上的包含关系为**
>![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261453029.png)


### 6.4. 配置消息转换器
默认情况下Spring采用的序列化方式是JDK序列化，但有很多问题，比如体积量大，可读性差等

因此要配置一个新的序列化方式

1. **添加依赖**

::: code-group
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```
:::

2. **配置转换器**

::: code-group
```java
@Configuration
@ConditionalOnClass(RabbitTemplate.class)//只有其它地方用到了RabbitTemplate，这个MqConfig才会生效
public class MqConfig {
    @Bean
    public MessageConverter messageConverter() {
        // 1.定义消息转换器
        Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();
        // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
        jackson2JsonMessageConverter.setCreateMessageIds(true);
        return jackson2JsonMessageConverter;
    }
}
```
:::

> [!WARNING] 注意
> 要结合amqp使用！！！每个服务的消息转换器要一致


## 7. 提高消息的可靠性
从发送者发送消息到消费者处理消息，中间会有多种可能性导致消息丢失，主要原因有以下几种：

+ **生产者发送时**（连接MQ失败、未找到Exchange、未找到Queue、MQ内部的异常等）
+ **MQ处理时**（消息到达了队列，但未消费MQ突然宕机了）
+ **消费者消费时**（接收消息后未处理消费者就宕机了、消息接收后处理过程中抛出异常）

因此，可以从以上三方面进行处理，保证消息的可靠性

### 7.1. 生产者的可靠性
#### 7.1.1. 重试机制（看需求）
`解决因网络问题导致连接mq失败的问题`

**只需配置yml文件即可**

::: code-group
```yaml
spring:
  rabbitmq:
    connection-timeout: 1s # 设置MQ的连接超时时间
    template:
      retry:
        enabled: true # 开启超时重试机制
        initial-interval: 1000ms # 失败后的初始等待时间
        multiplier: 1 # 失败后下次的等待时长倍数，例：下次等待时长 = 1000ms * 1
        max-attempts: 3 # 最大重试次数
```
:::

> [!WARNING]注意
> springAMQP提供的重试机制是阻塞式的，在重试的过程中，当前线程是被阻塞的（可以单独开一个线程，异步重试来解决），因此，要合理配置等待时长和重试次数


#### 7.1.2. 确认机制（不建议）
`解决未找到Exchange、未找到Queue、MQ内部发生异常`

`！！！只要网络畅通，一般不会出现这种问题！！！`

RabbitMQ提供了两种确认机制，`Publisher Return`和`Publisher Confirm`，开启确认机制后，生产者发送消息给MQ后，MQ会根据消息处理的情况返回不同的**回执**

> + 消息投递到MQ，但路由失败，通过`Publisher Return`返回异常信息，同时返回ack的确认信息，代表投递成功
> + 临时消息投递到了MQ，并且入队成功，返回ACK，告知投递成功
> + 持久消息投递到了MQ，并且入队完成持久化，返回ACK ，告知投递成功
> + 其它情况都会返回NACK，告知投递失败
>

1. **两种机制默认是关闭的，通过配置yml文件来开启**

::: code-group
```yaml
spring:
  rabbitmq:
    publisher-confirm-type: correlated # 开启publisher confirm机制，并设置confirm类型(none：关闭confirm机制、simple：同步阻塞等待MQ的回执、correlated：MQ异步回调返回回执)
    publisher-returns: true # 开启publisher return机制
```
:::

2. **配置 ReturnCallback**

::: code-group
```java
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Slf4j
@AllArgsConstructor
@Configuration
public class MqConfig {
    private final RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init(){
        rabbitTemplate.setReturnsCallback(new RabbitTemplate.ReturnsCallback() {
            @Override
            public void returnedMessage(ReturnedMessage returned) {
                log.error("触发return callback,");
                // 注意要在yml中配置日志级别
                log.debug("exchange: {}", returned.getExchange());
                log.debug("routingKey: {}", returned.getRoutingKey());
                log.debug("message: {}", returned.getMessage());
                log.debug("replyCode: {}", returned.getReplyCode());
                log.debug("replyText: {}", returned.getReplyText());
            }
        });
    }
}
```
:::

3. **配置 ConfirmCallback**

由于每个消息发送时的处理逻辑不一定相同，因此ConfirmCallback需要在每次发消息时定义
::: code-group
```java
@Test
void testPublisherConfirm() {
    // 1.创建CorrelationData
    CorrelationData cd = new CorrelationData(UUID.randomUUID().toString());
    // 2.给Future添加ConfirmCallback
    cd.getFuture().addCallback(new ListenableFutureCallback<CorrelationData.Confirm>() {
        @Override
        public void onFailure(Throwable ex) {
            // 2.1.Future发生异常时的处理逻辑，基本不会触发
            log.error("send message fail", ex);
        }
        @Override
        public void onSuccess(CorrelationData.Confirm result) {
            // 2.2.Future接收到回执的处理逻辑，参数中的result就是回执内容
            if(result.isAck()){ // result.isAck()，boolean类型，true代表ack回执，false 代表 nack回执
                log.debug("发送消息成功，收到 ack!");
            }else{ // result.getReason()，String类型，返回nack时的异常描述
                log.error("发送消息失败，收到 nack, reason : {}", result.getReason());
            }
        }
    });
    // 3.发送消息
    rabbitTemplate.convertAndSend("hmall.direct", "q", "hello", cd);
}
```
:::

> 这里的CorrelationData中包含两个核心的东西：
>
> + id：消息的唯一标示，MQ对不同的消息的回执以此做判断，避免混淆
> + SettableListenableFuture：回执结果的Future对象
>
> 将来MQ的回执就会通过这个Future来返回，可以提前给CorrelationData中的Future添加回调函数来处理消息回执
>

> [!WARNING]注意
> 开启生产者确认比较消耗MQ性能，一般不建议开启
> 
> 对于`未找到Exchange、未找到Queue`一般是编程代码写错，对于`MQ内部发生异常`仅需要开启ConfirmCallback处理nack就可以了



### 7.2. MQ的可靠性
#### 7.2.1. 数据持久化（建议）
`解决消息到达了队列，但未消费MQ突然宕机了`

默认情况下MQ的数据都是在内存存储的临时数据，重启后就会消失。为了保证数据的可靠性，必须配置数据持久化，包括：

+ 交换机持久化（重启后交换机不会丢失）
+ 队列持久化（重启后队列不会丢失）
+ 消息持久化（重启后消息不会丢失）

**控制台**：新建交换机、队列时选择durable、发消息时选择persistent即可

**java代码**：默认就是发的持久化消息，对于交换机与队列，默认是持久化的，但最好声明一下

#### 7.2.2. 惰性队列（建议，默认就是）
`解决消息到达了队列，但未消费就突然宕机`

RabbitMQ在3.6.0版本开始，添加了lazy queue模式；在3.12版本以后，队列的默认格式就是lazy queue

**作用**：消息直接写入磁盘，不写入内存，只有消费者消费消息时才从磁盘中读取并加载到内存

**3.12.0版本之前配置惰性队列的方式**：（3.12.0之后无需配置，默认就是采用的惰性队列）

**控制台**：
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261500634.png)

**java代码**：

`3.12.0版本之前配置惰性队列-使用bean`
::: code-group
```java
@Bean
public Queue lazyQueue(){
    return QueueBuilder
            .durable("lazy.queue")
            .lazy() // 开启Lazy模式
            .build();
}
```
:::

`3.12.0版本之前配置惰性队列-使用注解`
::: code-group
```java
@RabbitListener(queuesToDeclare = @Queue(
        name = "lazy.queue",
        durable = "true",
        arguments = @Argument(name = "x-queue-mode", value = "lazy")
))
public void listenLazyQueue(String msg){
    log.info("接收到 lazy.queue的消息：{}", msg);
}
```
:::

> [!WARNING]注意
> 即使采用了lazy queue，但如果消息不是持久化的，消息在服务器重启后依然会丢失！
>
> 因此，上一步的**三个持久化还是要做的**，惰性队列只是优化了内存的使用而已


### 7.3. 消费者的可靠性
顾名思义，以下配置应该在消费者端配置

#### 7.3.1. 确认机制（建议 确认+重试搭配）
消费者处理完消息后，回向Mq发送一个**回执**

> + ack：成功处理消息，RabbitMQ从队列中删除该消息
> + nack：消息处理失败，RabbitMQ需要再次投递消息，直到成功
> + reject：消息处理失败并拒绝该消息，RabbitMQ从队列中删除该消息
>

**实现方式，只需配置yml文件即可**

> ::: code-group
> ```yaml
>spring:
>  rabbitmq:
>    listener:
>      simple:
>        acknowledge-mode: auto #自动
>```
> :::
>
> **none**：不处理，消息投递给消费者后立刻ack，消息会立刻从MQ删除
> 
> **manual**：手动模式，需要自己在业务代码中调用api，发送ack或reject，存在业务入侵，但更灵活
> 
> **auto**：自动模式，业务正常执行时返回ack，业务出现异常时，根据异常类型返回不同结果：
> 
> 1. 如果是业务异常，会自动返回nack
> 
> 2. 如果是消息处理或校验异常，自动返回reject

#### 7.3.2. 重试机制（建议 确认+重试搭配）
如果消费者处理消息异常，那么就无限从mq到消费者，又从消费者到mq，大大增加了mq与消费者的压力

因此确认机制最好搭配重试机制使用

1. **配置yml文件**

::: code-group
```yaml
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true # 开启消费者重试机制
          initial-interval: 1000ms # 初始失败等待时长为1s
          multiplier: 1 # 失败的等待时长倍数，下次等待时长 = 1000ms * 1
          max-attempts: 3 # 最大重试次数
          stateless: true # true无状态；false有状态。如果业务中包含事务，这里改为false
```
:::

2. **配置失败处理策略**

但默认是重试指定次数后返回reject，消息丢失，因此要配置失败处理策略

> 这个策略是由MessageRecovery接口来定义的，它有3个不同实现：
>
> +  **RejectAndDontRequeueRecoverer**：重试耗尽后，直接reject，丢弃消息。默认
> +  **ImmediateRequeueMessageRecoverer**：重试耗尽后，返回nack，消息重新入队 
> +  **RepublishMessageRecoverer**：重试耗尽后，将失败消息投递到指定的交换机 （推荐）
>
> (如果本地重试到达指定次数还没成功，大多因为特殊原因，没必要在重试了，可以把消息扔到一个特定处理error的交换机，通过发送邮件等方式通知人员手动处理)
>

::: code-group
```java
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.retry.MessageRecoverer;
import org.springframework.amqp.rabbit.retry.RepublishMessageRecoverer;
import org.springframework.context.annotation.Bean;

@Configuration
@ConditionalOnProperty(name = "spring.rabbitmq.listener.simple.retry.enabled", havingValue = "true")//在开启消费者失败重试机制的模块才加载的以下的bean
public class ErrorMessageConfig {
    @Bean
    public DirectExchange errorMessageExchange(){
        return new DirectExchange("error.direct");
    }
    @Bean
    public Queue errorQueue(){
        return new Queue("error.queue", true);
    }
    @Bean
    public Binding errorBinding(Queue errorQueue, DirectExchange errorMessageExchange){
        return BindingBuilder.bind(errorQueue).to(errorMessageExchange).with("error");
    }

    @Bean
    public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
        return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
    }
}
```
:::


#### 7.3.3. 确保业务幂等（必要）
> `什么是幂等？`
>
> 在开发中，指同一个业务，执行一次或多次对最终结果影响是一致的
>
> `举例：`
>
> 幂等：查询数据、删除数据
>
> 非幂等：恢复库存、退款
>

如果消息到达消费者，并且处理成功，返回给mq ack 的时候发生网络问题，导致mq没收到回执，那么mq就会把这个消息再次发送给消费者，导致了一条消息重复消费

**方案一：根据消息ID判断**

1. 发送消息时生成一个唯一id，一起发送给消费者

::: code-group
```java
@Bean
public MessageConverter messageConverter(){
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jackson2JsonMessageConverter.setCreateMessageIds(true);
    return jackson2JsonMessageConverter;
}
```
:::

2. 消费者处理成功后，查询这个id并保存到数据库

::: code-group
```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "lottery-queue")
    public void listenSimpleQueueMessage(Message msg){
        msg.getMessageProperties().getMessageId();//消息id
        new String(msg.getBody());//消息
    }
}
```
:::

3. 再次收到相同的消息时，如果数据库查询结果为已存在id，则不做处理

**方案二：业务判断（推荐）**

比如说订单的支付状态，从未支付->已支付

1. 从消息中获取订单id
2. 根据id查询数据库，判断订单状态
3. 如果状态是未支付，则执行更新，反之不执行

## 7.4. 发送延迟消息
### 7.4.1. 使用死信交换机
> `死信：`
>
> + 消费者返回 reject 或 nack 声明消费失败，并且消息的requeue参数设置为false
> + 消息是一个过期消息，超时无人消费
> + 要投递的队列消息满了，无法投递
>
> `死信交换机：`
>
> 如果一个队列中的消息已经成为死信，并且这个队列通过dead-letter-exchange属性指定了一个交换机，那么队列中的死信就会投递到这个交换机中，而这个交换机就称为死信交换机
>

通过借助死信交换机，我们就能实现消息的延迟发送的效果
就是让队列1不绑定消费者而是绑定一个死信交换机，这样消息达到了过期时间，就会进入死信交换机，然后传递到队列2，再发给消费者。注意如果设置了 RoutingKey 则必须保证两个交换机与队列的绑定关系的 RoutingKey 一致
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261504102.png)

`1、创建普通交换机与队列及其绑定关系`
::: code-group
```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NormalConfig {

    @Bean
    public DirectExchange normalExchange(){
        return ExchangeBuilder.directExchange("normal-direct").build();
    }

    @Bean
    public Queue normalQueue(){
        return QueueBuilder
        .durable("normal-queue")
        .deadLetterExchange("dlx-direct")
        .build();
    }

    @Bean
    public Binding bindingQueueWith(Queue normalQueue, DirectExchange normalExchange){
        return BindingBuilder.bind(normalQueue).to(normalExchange).with("enen");
    }
}
```
:::

`2、创建死信交换机与队列及其绑定关系`
::: code-group
```java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "dlx-queue"),
    exchange = @Exchange(name = "dlx-direct", type = ExchangeTypes.DIRECT),
    key = {"enen"}
))
public void listenDirectQueue1(String msg){
    System.out.println("消费者1接收到direct消息：【" + msg + "】");
}
```
:::

`3、设置过期时间`
::: code-group
```java
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    void test() {
        
        rabbitTemplate.convertAndSend("normal.direct","enen", "hello",new MessagePostProcessor(){
            @Override
            public Message postProcessMessage(Message message) throws AmqpException{
                message.getMessageProcessMessage().setExpiration("30000"); //过期时间为30s
                return message;
            }
        });
    }
}
```
:::

### 7.4.2. 使用插件（建议）
**安装**

1. 下载对应版本的插件：<Linkcard url="https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tags" title="插件" description="https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tags" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502261519322.png"></Linkcard>

2. 复制到docker中mq对应的目录下，进入容器运行`rabbitmq-plugins enable rabbitmq_delayed_message_exchange`

`完整流程如下`
::: code-group
```bash
// 查看所有数据卷
docker volume ls

// 查看该数据卷的位置
docker volume inspect mq-plugins

// 进入到这个位置
cd /var/lib/docker/volumes/mq-plugins/_data

// cv插件到该目录

// 安装插件
docker exec -it mq rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```
:::

**使用**

`1、声明延迟交换机-bean方式`
::: code-group
```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class DelayExchangeConfig {

    @Bean
    public DirectExchange delayExchange(){
        return ExchangeBuilder
                .directExchange("delay.direct") // 指定交换机类型和名称
                .delayed() // 设置delay的属性为true
                .durable(true) // 持久化
                .build();
    }

    @Bean
    public Queue delayedQueue(){
        return new Queue("delay.queue");
    }
    
    @Bean
    public Binding delayQueueBinding(){
        return BindingBuilder.bind(delayedQueue()).to(delayExchange()).with("delay");
    }
}
```
:::

`1、声明延迟交换机-注解方式`
::: code-group
```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "delay.queue", durable = "true"),
        exchange = @Exchange(name = "delay.direct", delayed = "true"),
        key = "delay"
))
public void listenDelayMessage(String msg){
    log.info("接收到delay.queue的延迟消息：{}", msg);
}
```
:::

`2、发送延迟消息`
::: code-group
```java
@Test
void testPublisherDelayMessage() {
    // 1.创建消息
    String message = "hello, delayed message";
    // 2.发送消息，利用消息后置处理器添加消息头
    rabbitTemplate.convertAndSend("delay.direct", "delay", message, new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) throws AmqpException {
            // 添加延迟消息属性
            message.getMessageProperties().setDelay(5000); //5s
            return message;
        }
    });
}
```
:::

> [!WARNING]注意
> 延迟消息插件内部会维护一个本地数据库表，同时使用Elang Timers功能实现计时。如果消息的延迟时间设置较长，可能会导致堆积的延迟消息非常多，会带来较大的CPU开销，因此，设置的延迟时间应该尽可能的短些


## 8. 最后提供一个mq的工具类
`RabbitMqUtils`
::: code-group
```java
import cn.hutool.core.lang.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.util.concurrent.ListenableFutureCallback;

@Slf4j
@RequiredArgsConstructor
public class RabbitMqHelper {

    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(String exchange, String routingKey, Object msg){
        log.debug("准备发送消息，exchange:{}, routingKey:{}, msg:{}", exchange, routingKey, msg);
        rabbitTemplate.convertAndSend(exchange, routingKey, msg);
    }

    public void sendDelayMessage(String exchange, String routingKey, Object msg, int delay){
        rabbitTemplate.convertAndSend(exchange, routingKey, msg, message -> {
            message.getMessageProperties().setDelay(delay);
            return message;
        });
    }

    public void sendMessageWithConfirm(String exchange, String routingKey, Object msg, int maxRetries){
        log.debug("准备发送消息，exchange:{}, routingKey:{}, msg:{}", exchange, routingKey, msg);
        CorrelationData cd = new CorrelationData(UUID.randomUUID().toString(true));
        cd.getFuture().addCallback(new ListenableFutureCallback<>() {
            int retryCount;
            @Override
            public void onFailure(Throwable ex) {
                log.error("处理ack回执失败", ex);
            }
            @Override
            public void onSuccess(CorrelationData.Confirm result) {
                if (result != null && !result.isAck()) {
                    log.debug("消息发送失败，收到nack，已重试次数：{}", retryCount);
                    if(retryCount >= maxRetries){
                        log.error("消息发送重试次数耗尽，发送失败");
                        return;
                    }
                    CorrelationData cd = new CorrelationData(UUID.randomUUID().toString(true));
                    cd.getFuture().addCallback(this);
                    rabbitTemplate.convertAndSend(exchange, routingKey, msg, cd);
                    retryCount++;
                }
            }
        });
        rabbitTemplate.convertAndSend(exchange, routingKey, msg, cd);
    }
}
```
:::

`将RabbitMqUtils注册为Bean`
::: code-group
```java
import org.springframework.amqp.core.RabbitTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnClass(value = {MessageConverter.class, RabbitTemplate.class})
public class MqConfig {

    @Bean
    public MessageConverter messageConverter(){
        // 1.定义消息转换器
        Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter(mapper);
        // 2.配置自动创建消息id，用于识别不同消息
        jackson2JsonMessageConverter.setCreateMessageIds(true);
        return jackson2JsonMessageConverter;
    }

    @Bean
    public RabbitMqUtils rabbitMqUtils(RabbitTemplate rabbitTemplate){
        return new RabbitMqUtils(rabbitTemplate);
    }
}
```
:::

注意该配置要被扫描到！

**🥳 将来的你，一定会感谢现在努力奋斗的你，加油！💯**
