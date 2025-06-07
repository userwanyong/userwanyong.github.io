# Xxl-job <Badge type="danger" text="new" />
<Linkcard url="https://www.xuxueli.com/xxl-job/" title="Xxl-job官网" description="https://www.xuxueli.com/xxl-job" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202506072210417.png"></Linkcard>

## 1. 概述
XXL-JOB是一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展

## 2. 快速入门
源码仓库地址：https://github.com/xuxueli/xxl-job

::: code-group
```xml
<!-- http://repo1.maven.org/maven2/com/xuxueli/xxl-job-core/ -->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>${最新稳定版本}</version>
</dependency>
```
:::

### 2.1. 初始化“调度数据库”
+ 下载项目源码并解压，获取 “调度数据库初始化SQL脚本” 并执行即可
+ “调度数据库初始化SQL脚本” 位置为：/xxl-job/doc/db/tables_xxl_job.sql
+ 调度中心支持集群部署，集群情况下各节点务必连接同一个mysql实例
+ 如果mysql做主从,调度中心集群节点务必强制走主库

### 2.2. 配置部署“调度中心”
#### 2.2.1. 调度中心配置
调度中心配置文件地址：/xxl-job/xxl-job-admin/src/main/resources/application.properties

::: code-group
```yaml
### 调度中心JDBC链接：链接地址请保持和 2.1章节 所创建的调度数据库的地址一致
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root_pwd
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
### 报警邮箱
spring.mail.host=smtp.qq.com
spring.mail.port=25
spring.mail.username=xxx@qq.com
spring.mail.password=xxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
### 调度中心通讯TOKEN [选填]：非空时启用；
xxl.job.accessToken=
### 调度中心国际化配置 [必填]： 默认为 "zh_CN"/中文简体, 可选范围为 "zh_CN"/中文简体, "zh_TC"/中文繁体 and "en"/英文；
xxl.job.i18n=zh_CN
## 调度线程池最大线程配置【必填】
xxl.job.triggerpool.fast.max=200
xxl.job.triggerpool.slow.max=100
### 调度中心日志表数据保存天数 [必填]：过期日志自动清理；限制大于等于7时生效，否则, 如-1，关闭自动清理功能；
xxl.job.logretentiondays=30
```
:::

#### 2.2.2. 部署项目
调度中心访问地址：`http://localhost:8080/xxl-job-admin`

默认账号/密码 ：admin/123456

![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/1726910151106-a176f374-906e-450e-b924-543e615bb7fb.png)

### 2.3. 配置部署“执行器项目”
"执行器"项目：xxl-job-executor-sample-springboot 

作用：负责接收“调度中心”的调度并执行；可直接部署执行器，也可以将执行器集成到现有业务项目中

#### 2.3.1. 引入maven依赖
确认pom文件中引入了 “xxl-job-core” 的maven依赖

#### 2.3.2. 执行器配置
配置文件地址：/xxl-job/xxl-job-executor-samples/xxl-job-executor-sample-springboot/src/main/resources/application.properties

::: code-group
```yaml
### 调度中心部署根地址 [选填]：如调度中心集群部署存在多个地址则用逗号分隔。执行器将会使用该地址进行"执行器心跳注册"和"任务结果回调"；为空则关闭自动注册；
xxl.job.admin.addresses=http://127.0.0.1:8080/xxl-job-admin
### 执行器通讯TOKEN [选填]：非空时启用；
xxl.job.accessToken=
### 执行器AppName [选填]：执行器心跳注册分组依据；为空则关闭自动注册
xxl.job.executor.appname=xxl-job-executor-sample
### 执行器注册 [选填]：优先使用该配置作为注册地址，为空时使用内嵌服务 ”IP:PORT“ 作为注册地址。从而更灵活的支持容器类型执行器动态IP和动态映射端口问题。
xxl.job.executor.address=
### 执行器IP [选填]：默认为空表示自动获取IP，多网卡时可手动设置指定IP，该IP不会绑定Host仅作为通讯实用；地址信息用于 "执行器注册" 和 "调度中心请求并触发任务"；
xxl.job.executor.ip=
### 执行器端口号 [选填]：小于等于0则自动获取；默认端口为9999，单机部署多个执行器时，注意要配置不同执行器端口；
xxl.job.executor.port=9999
### 执行器运行日志文件存储磁盘路径 [选填] ：需要对该路径拥有读写权限；为空则使用默认路径；
xxl.job.executor.logpath=/data/applogs/xxl-job/jobhandler
### 执行器日志文件保存天数 [选填] ： 过期日志自动清理, 限制值大于等于3时生效; 否则, 如-1, 关闭自动清理功能；
xxl.job.executor.logretentiondays=30
```
:::

#### 2.3.3. 执行器组件配置
配置文件地址：/xxl-job/xxl-job-executor-samples/xxl-job-executor-sample-springboot/src/main/java/com/xxl/job/executor/core/config/XxlJobConfig.java

::: code-group
```java
@Bean
public XxlJobSpringExecutor xxlJobExecutor() {
    logger.info(">>>>>>>>>>> xxl-job config init.");
    XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
    xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
    xxlJobSpringExecutor.setAppname(appname);
    xxlJobSpringExecutor.setIp(ip);
    xxlJobSpringExecutor.setPort(port);
    xxlJobSpringExecutor.setAccessToken(accessToken);
    xxlJobSpringExecutor.setLogPath(logPath);
    xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);
    return xxlJobSpringExecutor;
}
```
:::

#### 2.3.4. 部署执行器项目
如果已经正确进行上述配置，可将执行器项目编译打部署，系统提供多种执行器Sample示例项目，选择其中一个即可，各自的部署方式如下：

+ xxl-job-executor-sample-springboot：项目编译打包成springboot类型的可执行JAR包，命令启动即可
+ xxl-job-executor-sample-frameless：项目编译打包成JAR包，命令启动即可

### 2.4. 开发第一个任务“Hello World”
#### 2.4.1. 新建任务
登录调度中心-->任务管理-->新增

![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/1726911348506-0db88aed-0ab4-4aea-b90b-191ad9b5971c.png)

+ **执行器**：每个任务必须绑定一个执行器, 方便给任务进行分组
+ **任务描述**：任务的描述信息，便于任务管理
+ **负责人**：任务的负责人
+ **报警邮件**：任务调度失败时邮件通知的邮箱地址，支持配置多邮箱地址，配置多个邮箱地址时用逗号分隔
+ **调度类型**：
    - 无：该类型不会主动触发调度
    - CRON：该类型将会通过CRON，触发任务调度
    - 固定速度：该类型将会以固定速度，触发任务调度；按照固定的间隔时间，周期性触发
+ **运行模式**：
    - JobHandler：运行模式为 "BEAN模式" 时生效，对应执行器中新开发的JobHandler类“@JobHandler”注解自定义的value值
    - 执行参数：任务执行所需的参数
    - BEAN模式：任务以JobHandler方式维护在执行器端；需要结合 "JobHandler" 属性匹配执行器中任务
+ **阻塞处理策略**：调度过于密集执行器来不及处理时的处理策略
    - 单机串行（默认）：调度请求进入单机执行器后，调度请求进入FIFO(First Input First Output)队列并以串行方式运行
    - 丢弃后续调度：调度请求进入单机执行器后，发现执行器存在运行的调度任务，本次请求将会被丢弃并标记为失败
    - 覆盖之前调度：调度请求进入单机执行器后，发现执行器存在运行的调度任务，将会终止运行中的调度任务并清空队列，然后运行本地调度任务
+ **路由策略**：当执行器集群部署时，提供丰富的路由策略
    - FIRST（第一个）：固定选择第一个机器
    - LAST（最后一个）：固定选择最后一个机器
    - ROUND（轮询）
    - RANDOM（随机）：随机选择在线的机器；
    - CONSISTENT_HASH（一致性HASH）：每个任务按照Hash算法固定选择某一台机器，且所有任务均匀散列在不同机器上
    - LEAST_FREQUENTLY_USED（最不经常使用）：使用频率最低的机器优先被选举
    - LEAST_RECENTLY_USED（最近最久未使用）：最久未使用的机器优先被选举
    - FAILOVER（故障转移）：按照顺序依次进行心跳检测，第一个心跳检测成功的机器选定为目标执行器并发起调度
    - BUSYOVER（忙碌转移）：按照顺序依次进行空闲检测，第一个空闲检测成功的机器选定为目标执行器并发起调度
    - SHARDING_BROADCAST(分片广播)：广播触发对应集群中所有机器执行一次任务，同时系统自动传递分片参数；可根据分片参数开发分片任务

#### 2.4.2. “GLUE模式(Java)” 任务开发
操作-->GLUE IDE

 ![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/1726911462682-f943ea23-a680-4a04-b6ff-e3f793a1919d.png)

“GLUE模式(Java)” 运行模式的任务默认已经初始化了示例任务代码，即打印Hello World

#### 2.4.3. 触发执行
记得要把调度中心和执行器项目启动起来！！！

操作-->执行一次

来手动触发一次任务执行（通常情况下，通过配置Cron表达式进行任务调度触发）

最后查看调度日志确认是否成功

![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/1726971817706-a6eecd45-33d7-46f9-8524-7bb0071b77a5.png)

## 3. 安装

### 3.1. 准备sql环境
<details>
  <summary>点我查看sql文件</summary>

::: code-group
```sql
# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20050
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 192.168.1.108 (MySQL 8.0.32)
# 数据库: xxl_job
# 生成时间: 2024-08-10 01:19:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO', SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

CREATE database if NOT EXISTS `xxl_job` default character set utf8mb4 collate utf8mb4_unicode_ci;
use `xxl_job`;

# 转储表 xxl_job_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_group`;

CREATE TABLE `xxl_job_group`
(
`id`           int         NOT NULL AUTO_INCREMENT,
`app_name`     varchar(64) NOT NULL COMMENT '执行器AppName',
`title`        varchar(12) NOT NULL COMMENT '执行器名称',
`address_type` tinyint     NOT NULL DEFAULT '0' COMMENT '执行器地址类型：0=自动注册、1=手动录入',
`address_list` text COMMENT '执行器地址列表，多地址逗号分隔',
`update_time`  datetime             DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES `xxl_job_group` WRITE;
/*!40000 ALTER TABLE `xxl_job_group`
DISABLE KEYS */;

INSERT INTO `xxl_job_group` (`id`, `app_name`, `title`, `address_type`, `address_list`)
VALUES (1, 'marketing-job', '抽奖调度任务', 0, NULL);

/*!40000 ALTER TABLE `xxl_job_group`
ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 xxl_job_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_info`;

CREATE TABLE `xxl_job_info`
(
`id`                        int          NOT NULL AUTO_INCREMENT,
`job_group`                 int          NOT NULL COMMENT '执行器主键ID',
`job_desc`                  varchar(255) NOT NULL,
`add_time`                  datetime              DEFAULT NULL,
`update_time`               datetime              DEFAULT NULL,
`author`                    varchar(64)           DEFAULT NULL COMMENT '作者',
`alarm_email`               varchar(255)          DEFAULT NULL COMMENT '报警邮件',
`schedule_type`             varchar(50)  NOT NULL DEFAULT 'NONE' COMMENT '调度类型',
`schedule_conf`             varchar(128)          DEFAULT NULL COMMENT '调度配置，值含义取决于调度类型',
`misfire_strategy`          varchar(50)  NOT NULL DEFAULT 'DO_NOTHING' COMMENT '调度过期策略',
`executor_route_strategy`   varchar(50)           DEFAULT NULL COMMENT '执行器路由策略',
`executor_handler`          varchar(255)          DEFAULT NULL COMMENT '执行器任务handler',
`executor_param`            varchar(512)          DEFAULT NULL COMMENT '执行器任务参数',
`executor_block_strategy`   varchar(50)           DEFAULT NULL COMMENT '阻塞处理策略',
`executor_timeout`          int          NOT NULL DEFAULT '0' COMMENT '任务执行超时时间，单位秒',
`executor_fail_retry_count` int          NOT NULL DEFAULT '0' COMMENT '失败重试次数',
`glue_type`                 varchar(50)  NOT NULL COMMENT 'GLUE类型',
`glue_source`               mediumtext COMMENT 'GLUE源代码',
`glue_remark`               varchar(128)          DEFAULT NULL COMMENT 'GLUE备注',
`glue_updatetime`           datetime              DEFAULT NULL COMMENT 'GLUE更新时间',
`child_jobid`               varchar(255)          DEFAULT NULL COMMENT '子任务ID，多个逗号分隔',
`trigger_status`            tinyint      NOT NULL DEFAULT '0' COMMENT '调度状态：0-停止，1-运行',
`trigger_last_time`         bigint       NOT NULL DEFAULT '0' COMMENT '上次调度时间',
`trigger_next_time`         bigint       NOT NULL DEFAULT '0' COMMENT '下次调度时间',
PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES `xxl_job_info` WRITE;
/*!40000 ALTER TABLE `xxl_job_info`
DISABLE KEYS */;

INSERT INTO `xxl_job_info` (`id`, `job_group`, `job_desc`, `add_time`, `update_time`, `author`, `alarm_email`,
`schedule_type`, `schedule_conf`, `misfire_strategy`, `executor_route_strategy`,
`executor_handler`, `executor_param`, `executor_block_strategy`, `executor_timeout`,
`executor_fail_retry_count`, `glue_type`, `glue_source`, `glue_remark`, `glue_updatetime`,
`child_jobid`, `trigger_status`, `trigger_last_time`, `trigger_next_time`)
VALUES (1, 1, '更新奖品库存任务', '2018-11-03 22:21:31', '2024-08-10 09:17:47', 'XXL', '', 'CRON', '0/5 * * * * ?',
'DO_NOTHING', 'FIRST', 'updateAwardStockJob', '', 'SERIAL_EXECUTION', 0, 0, 'BEAN', '', 'GLUE代码初始化',
'2018-11-03 22:21:31', '', 0, 0, 0),
(2, 1, '发送MQ消息任务队列(DB1)', '2024-08-10 09:09:27', '2024-08-10 09:15:44', 'XXL', '', 'CRON',
'0/5 * * * * ?', 'DO_NOTHING', 'FIRST', 'SendMessageTaskJob_DB1', '', 'SERIAL_EXECUTION', 0, 0, 'BEAN', '',
'GLUE代码初始化', '2024-08-10 09:09:27', '', 1, 1723252715000, 1723252720000),
(3, 1, '发送MQ消息任务队列(DB2)', '2024-08-10 09:09:38', '2024-08-10 09:15:40', 'XXL', '', 'CRON',
'0/5 * * * * ?', 'DO_NOTHING', 'FIRST', 'SendMessageTaskJob_DB2', '', 'SERIAL_EXECUTION', 0, 0, 'BEAN', '',
'GLUE代码初始化', '2024-08-10 09:09:38', '', 1, 1723252715000, 1723252720000),
(4, 1, '更新活动sku库存任务', '2024-08-10 09:10:09', '2024-08-10 09:15:00', 'XXL', '', 'CRON', '0/5 * * * * ?',
'DO_NOTHING', 'FIRST', 'UpdateActivitySkuStockJob', '', 'SERIAL_EXECUTION', 0, 0, 'BEAN', '', 'GLUE代码初始化',
'2024-08-10 09:10:09', '', 1, 1723252715000, 1723252720000);

/*!40000 ALTER TABLE `xxl_job_info`
ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 xxl_job_lock
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_lock`;

CREATE TABLE `xxl_job_lock`
(
`lock_name` varchar(50) NOT NULL COMMENT '锁名称',
PRIMARY KEY (`lock_name`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES `xxl_job_lock` WRITE;
/*!40000 ALTER TABLE `xxl_job_lock`
DISABLE KEYS */;

INSERT INTO `xxl_job_lock` (`lock_name`)
VALUES ('schedule_lock');

/*!40000 ALTER TABLE `xxl_job_lock`
ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 xxl_job_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_log`;

CREATE TABLE `xxl_job_log`
(
`id`                        bigint  NOT NULL AUTO_INCREMENT,
`job_group`                 int     NOT NULL COMMENT '执行器主键ID',
`job_id`                    int     NOT NULL COMMENT '任务，主键ID',
`executor_address`          varchar(255)     DEFAULT NULL COMMENT '执行器地址，本次执行的地址',
`executor_handler`          varchar(255)     DEFAULT NULL COMMENT '执行器任务handler',
`executor_param`            varchar(512)     DEFAULT NULL COMMENT '执行器任务参数',
`executor_sharding_param`   varchar(20)      DEFAULT NULL COMMENT '执行器任务分片参数，格式如 1/2',
`executor_fail_retry_count` int     NOT NULL DEFAULT '0' COMMENT '失败重试次数',
`trigger_time`              datetime         DEFAULT NULL COMMENT '调度-时间',
`trigger_code`              int     NOT NULL COMMENT '调度-结果',
`trigger_msg`               text COMMENT '调度-日志',
`handle_time`               datetime         DEFAULT NULL COMMENT '执行-时间',
`handle_code`               int     NOT NULL COMMENT '执行-状态',
`handle_msg`                text COMMENT '执行-日志',
`alarm_status`              tinyint NOT NULL DEFAULT '0' COMMENT '告警状态：0-默认、1-无需告警、2-告警成功、3-告警失败',
PRIMARY KEY (`id`),
KEY `I_trigger_time` (`trigger_time`),
KEY `I_handle_code` (`handle_code`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES `xxl_job_log` WRITE;
/*!40000 ALTER TABLE `xxl_job_log`
DISABLE KEYS */;

INSERT INTO `xxl_job_log` (`id`, `job_group`, `job_id`, `executor_address`, `executor_handler`, `executor_param`,
`executor_sharding_param`, `executor_fail_retry_count`, `trigger_time`, `trigger_code`,
`trigger_msg`, `handle_time`, `handle_code`, `handle_msg`, `alarm_status`)
VALUES (111, 1, 4, NULL, 'UpdateActivitySkuStockJob', '', NULL, 0, '2024-08-10 09:18:30', 500,
'任务触发类型：Cron触发<br>调度机器：172.19.0.12<br>执行器-注册方式：自动注册<br>执行器-地址列表：null<br>路由策略：第一个<br>阻塞处理策略：单机串行<br>任务超时时间：0<br>失败重试次数：0<br><br><span style=\"color:#00c0ef;\" > >>>>>>>>>>>触发调度<<<<<<<<<<< </span><br>调度失败：执行器地址为空<br><br>',
NULL, 0, NULL, 0),
(112, 1, 2, NULL, 'SendMessageTaskJob_DB1', '', NULL, 0, '2024-08-10 09:18:35', 500,
'任务触发类型：Cron触发<br>调度机器：172.19.0.12<br>执行器-注册方式：自动注册<br>执行器-地址列表：null<br>路由策略：第一个<br>阻塞处理策略：单机串行<br>任务超时时间：0<br>失败重试次数：0<br><br><span style=\"color:#00c0ef;\" > >>>>>>>>>>>触发调度<<<<<<<<<<< </span><br>调度失败：执行器地址为空<br><br>',
NULL, 0, NULL, 0),
(113, 1, 4, NULL, 'UpdateActivitySkuStockJob', '', NULL, 0, '2024-08-10 09:18:35', 500,
'任务触发类型：Cron触发<br>调度机器：172.19.0.12<br>执行器-注册方式：自动注册<br>执行器-地址列表：null<br>路由策略：第一个<br>阻塞处理策略：单机串行<br>任务超时时间：0<br>失败重试次数：0<br><br><span style=\"color:#00c0ef;\" > >>>>>>>>>>>触发调度<<<<<<<<<<< </span><br>调度失败：执行器地址为空<br><br>',
NULL, 0, NULL, 0),
(114, 1, 3, NULL, 'SendMessageTaskJob_DB2', '', NULL, 0, '2024-08-10 09:18:35', 500,
'任务触发类型：Cron触发<br>调度机器：172.19.0.12<br>执行器-注册方式：自动注册<br>执行器-地址列表：null<br>路由策略：第一个<br>阻塞处理策略：单机串行<br>任务超时时间：0<br>失败重试次数：0<br><br><span style=\"color:#00c0ef;\" > >>>>>>>>>>>触发调度<<<<<<<<<<< </span><br>调度失败：执行器地址为空<br><br>',
NULL, 0, NULL, 0);

/*!40000 ALTER TABLE `xxl_job_log`
ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 xxl_job_log_report
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_log_report`;

CREATE TABLE `xxl_job_log_report`
(
`id`            int NOT NULL AUTO_INCREMENT,
`trigger_day`   datetime     DEFAULT NULL COMMENT '调度-时间',
`running_count` int NOT NULL DEFAULT '0' COMMENT '运行中-日志数量',
`suc_count`     int NOT NULL DEFAULT '0' COMMENT '执行成功-日志数量',
`fail_count`    int NOT NULL DEFAULT '0' COMMENT '执行失败-日志数量',
`update_time`   datetime     DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `i_trigger_day` (`trigger_day`) USING BTREE
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES `xxl_job_log_report` WRITE;
/*!40000 ALTER TABLE `xxl_job_log_report`
DISABLE KEYS */;

INSERT INTO `xxl_job_log_report` (`id`, `trigger_day`, `running_count`, `suc_count`, `fail_count`, `update_time`)
VALUES (1, '2024-08-10 00:00:00', 0, 45, 39, NULL),
(2, '2024-08-09 00:00:00', 0, 0, 0, NULL),
(3, '2024-08-08 00:00:00', 0, 0, 0, NULL);

/*!40000 ALTER TABLE `xxl_job_log_report`
ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 xxl_job_logglue
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_logglue`;

CREATE TABLE `xxl_job_logglue`
(
`id`          int          NOT NULL AUTO_INCREMENT,
`job_id`      int          NOT NULL COMMENT '任务，主键ID',
`glue_type`   varchar(50) DEFAULT NULL COMMENT 'GLUE类型',
`glue_source` mediumtext COMMENT 'GLUE源代码',
`glue_remark` varchar(128) NOT NULL COMMENT 'GLUE备注',
`add_time`    datetime    DEFAULT NULL,
`update_time` datetime    DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;



# 转储表 xxl_job_registry
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_registry`;

CREATE TABLE `xxl_job_registry`
(
`id`             int          NOT NULL AUTO_INCREMENT,
`registry_group` varchar(50)  NOT NULL,
`registry_key`   varchar(255) NOT NULL,
`registry_value` varchar(255) NOT NULL,
`update_time`    datetime DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `i_g_k_v` (`registry_group`, `registry_key`, `registry_value`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;



# 转储表 xxl_job_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xxl_job_user`;

CREATE TABLE `xxl_job_user`
(
`id`         int         NOT NULL AUTO_INCREMENT,
`username`   varchar(50) NOT NULL COMMENT '账号',
`password`   varchar(50) NOT NULL COMMENT '密码',
`role`       tinyint     NOT NULL COMMENT '角色：0-普通用户、1-管理员',
`permission` varchar(255) DEFAULT NULL COMMENT '权限：执行器ID列表，多个逗号分割',
PRIMARY KEY (`id`),
UNIQUE KEY `i_username` (`username`) USING BTREE
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

LOCK TABLES `xxl_job_user` WRITE;
/*!40000 ALTER TABLE `xxl_job_user`
DISABLE KEYS */;

INSERT INTO `xxl_job_user` (`id`, `username`, `password`, `role`, `permission`)
VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 1, NULL);

/*!40000 ALTER TABLE `xxl_job_user`
ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;

```
:::
</details>


### 3.2. 执行docker-compose
::: code-group
```yml
# 命令执行 docker-compose -f docker-compose-environment.yml up -d
version: '3.9'
services:
  xxl-job-admin:
    image: xuxueli/xxl-job-admin:2.4.1 #M1 Mac 更换镜像 kuschzzp/xxl-job-aarch64:2.4.0
    container_name: xxl-job-admin
    restart: always
    depends_on:
      - mysql
    ports:
      - "9090:9090"
    links:
      - mysql
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/xxl_job?serverTimezone=UTC&characterEncoding=utf8&autoReconnect=true&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=123456
      - SERVER_PORT=9090
    networks:
      - my-network
networks:
  my-network:
    driver: bridge
```
:::

之后访问 `http://127.0.0.1:9090/xxl-job-admin` 就能看到Xxl-job的控制台啦😄

## 4. 在项目中集成
### 4.1. 引入maven依赖
::: code-group
```xml
<!--xxl-job-->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>2.3.0</version>
</dependency>
```
:::

### 4.2. 加入XxlJobConfig配置类
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/1726972731230-213af827-a5bd-47b1-9be3-62fe453e3cf0.png)

::: code-group
```java
package com.xxl.job.executor.core.config;

import com.xxl.job.core.executor.impl.XxlJobSpringExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * xxl-job config
 *
 * @author xuxueli 2017-04-28
 */
@Configuration
public class XxlJobConfig {
    private Logger logger = LoggerFactory.getLogger(XxlJobConfig.class);

    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;

    @Value("${xxl.job.accessToken}")
    private String accessToken;

    @Value("${xxl.job.executor.appname}")
    private String appname;

    @Value("${xxl.job.executor.address}")
    private String address;

    @Value("${xxl.job.executor.ip}")
    private String ip;

    @Value("${xxl.job.executor.port}")
    private int port;

    @Value("${xxl.job.executor.logpath}")
    private String logPath;

    @Value("${xxl.job.executor.logretentiondays}")
    private int logRetentionDays;


    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        logger.info(">>>>>>>>>>> xxl-job config init.");
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
        xxlJobSpringExecutor.setAppname(appname);
        xxlJobSpringExecutor.setAddress(address);
        xxlJobSpringExecutor.setIp(ip);
        xxlJobSpringExecutor.setPort(port);
        xxlJobSpringExecutor.setAccessToken(accessToken);
        xxlJobSpringExecutor.setLogPath(logPath);
        xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);

        return xxlJobSpringExecutor;
    }

    /**
     * 针对多网卡、容器内部署等情况，可借助 "spring-cloud-commons" 提供的 "InetUtils" 组件灵活定制注册IP；
     *
     *      1、引入依赖：
     *          <dependency>
     *             <groupId>org.springframework.cloud</groupId>
     *             <artifactId>spring-cloud-commons</artifactId>
     *             <version>${version}</version>
     *         </dependency>
     *
     *      2、配置文件，或者容器启动变量
     *          spring.cloud.inetutils.preferred-networks: 'xxx.xxx.xxx.'
     *
     *      3、获取IP
     *          String ip_ = inetUtils.findFirstNonLoopbackHostInfo().getIpAddress();
     */
}
```
:::

### 4.3. 配置application.yml文件
::: code-group
```yaml
xxl:
  job:
    accessToken: default_token
    admin:
      addresses: http://127.0.0.1:8080/xxl-job-admin
    executor:
      appname: xxl-job-executor-sample
      address:
      ip:
      port: 9999
      logpath: /data/applogs/xxl-job/jobhandler
      logretentiondays: 30
```
:::


### 4.4. 使用GLUE(Java)模式
#### 4.4.1. 新建执行器
![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/1726973632793-1fa3d961-e350-4fc5-91b5-99ca263057ec.png)

#### 4.4.2. 修改GLUE IDE中的代码
以全量同步题目到es为例

要特别注意log要初始化，而不是使用@Slf4j注解

::: code-group
```java
import cn.hutool.core.collection.CollUtil;
import com.questionbrushingplatform.dto.request.QuestionEsRequestDTO;
import com.questionbrushingplatform.entity.Question;
import com.questionbrushingplatform.esdao.QuestionEsDao;
import com.questionbrushingplatform.service.QuestionService;
import com.xxl.job.core.handler.IJobHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

public class XxlJob extends IJobHandler {

    @Resource
    private QuestionService questionService;
    @Resource
    private QuestionEsDao questionEsDao;
    @Override
    public void execute() throws Exception {
        // 初始化 log
        Logger log = LoggerFactory.getLogger(XxlJob.class);

        //全量获取题目
        List<Question> questionList = questionService.list();
        if (CollUtil.isEmpty(questionList)){
            return;
        }
        //转为ES实体类
        List<QuestionEsRequestDTO> questionEsDTOList = questionList.stream()
                .map(QuestionEsRequestDTO::objToDto)
                .collect(Collectors.toList());
        //分页批量插入到ES
        final int pageSize = 500;
        int total = questionEsDTOList.size();
        log.info("QuestionService.list() 共 [{}] 条数据", total);
        for (int i = 0; i < total; i+=pageSize) {
            //注意同步的数据下标不能超过总数据量
            int end = Math.min(i + pageSize, total);
            questionEsDao.saveAll(questionEsDTOList.subList(i, end));
        }
        log.info("QuestionService.list() 全量同步完成");
    }
}
```
:::

**🥳 将来的你，一定会感谢现在努力奋斗的你，加油！💯**

