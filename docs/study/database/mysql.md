# Mysql
<img src="https://img.shields.io/badge/-MySQL-4479A1?logo=MySQL&logoColor=FFF" alt="MySQL" style="display: inline-block;margin-right: 2px" /> 

<Linkcard url="https://dev.mysql.com/" title="Mysql官网" description="https://dev.mysql.com" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502281426220.png"></Linkcard>


## 1. 认识数据库
### 1.1. 什么是关系型数据库？
顾名思义，关系型数据库（RDB，Relational Database）就是一种建立在关系模型的基础上的数据库。关系模型表明了数据库中所存储的数据之间的联系（一对一、一对多、多对多）

关系型数据库中，我们的数据都被存放在了各种表中（比如用户表），表中的每一行就存放着一条数据（比如一个用户的信息）

大部分关系型数据库都使用 SQL 来操作数据库中的数据。并且，大部分关系型数据库都支持事务的四大特性(ACID)

### 1.2. 常见的关系型数据库
MySQL、PostgreSQL、Oracle、SQL Server、SQLite

### 1.3. 什么是 SQL？
SQL 是一种结构化查询语言(Structured Query Language)，专门用来与数据库打交道，目的是提供一种从数据库中读写数据的简单有效的方法

几乎所有的主流关系数据库都支持 SQL ，适用性非常强。并且，一些非关系型数据库也兼容 SQL 或者使用的是类似于 SQL 的查询语言

SQL 可以帮助我们：
+ 新建数据库、数据表、字段
+ 在数据库中增加，删除，修改，查询数据
+ 新建视图、函数、存储过程
+ 对数据库中的数据进行简单的数据分析

### 1.4. 什么是MySQL？
MySQL 是一种关系型数据库，主要用于持久化存储我们的系统中的一些数据（比如用户信息）

由于 MySQL 是开源免费并且比较成熟的数据库，因此，MySQL 被大量使用在各种系统中。任何人都可以在 GPL(General Public License) 的许可下下载并根据个性化的需要对其进行修改

MySQL 的默认端口号是3306

### 1.5. MySQL的特点
+ 成熟稳定，功能完善
+ 开源免费
+ 文档丰富，既有详细的官方文档，又有非常多优质文章可供参考学习
+ 开箱即用，操作简单，维护成本低
+ 兼容性好，支持常见的操作系统，支持多种开发语言
+ 社区活跃，生态完善
+ 支持分库分表、读写分离、高可用

### 1.6. MySQL的字段类型有哪些
+ 数值类型：
    - 整型（`TINYINT`、`SMALLINT`、`MEDIUMINT`、`INT`、`BIGINT`）
    - 浮点型（`FLOAT`、`DOUBLE`）
    - 定点型（`DECIMAL`）

+ 字符串类型：`CHAR`、`VARCHAR`、`TINYTEXT`、`TEXT`、`MEDIUMTEXT`、`LONGTEXT`、`TINYBLOB`、`BLOB`、`MEDIUMBLOB`、`LONGBLOB`，其中最常用的是 `CHAR` 和 `VARCHAR`

+ 日期时间类型：`YEAR`、`TIME`、`DATE`、`DATETIME`、`TIMESTAMP`


## 2. 通用语法
+ SQL语句可以单行/多行书写，以分号结束
+ SQL语句可以增加缩进/空格来增进可读性
+ SQL语句的关键字不区分大小写
+ 单行注释（--注释）
+ 多行注释（/*注释*/）

## 3. 分类
>[!WARNING] 注意
> 下面的sql语句如果带[]，说明括号里面的内容可加可不加
### 3.1. DDL（Data Definition Language）
`数据定义语言，用来定义数据库对象（数据库，表）`

#### 3.1.1. 数据库
+ 查询所有数据库：`show databases;`
+ 查询当前数据库：`select database();`
+ 使用数据库：`use 数据库名;`
+ 创建数据库：`create database [if not exists] 数据库名;`
+ 删除数据库：`drop database [if exist] 数据库名;`

#### 3.1.2. 表
`数据类型`

![](https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502272203291.png)
>[!WARNING] char 与 varchar 的区别
>char(5),最多存5字符，不足5个，也占用5个
> 
>varchar(5),最多存5字符，不足5个，按实际长度存储

`创建`
::: code-group
``` sql
create table 表名(
    字段1 类型 [约束] [comment 字段1注释],
    字段2 类型 [约束] [comment 字段2注释]
) [comment 表注释];

非空约束 not null
唯一约束 unique
主键约束 primary key（auto_increment自增）
默认约束 default
外键约束 foreign key

例：
create table db_user(
    id int primary key auto_increment comment 'ID',
    username varchar(20) not null unique comment '用户名',
    name varchar(10) not null comment '姓名',
    age int comment '年龄',
    gender char(1) default '男' comment '性别'
) comment '用户表';
```
:::


`查询`

+ 查询当前数据库所有表：`show tables;`
+ 查询表结构：`desc 表名;`
+ 查询建表语句：`show create table 表名;`

`修改`

+ 添加字段：`alter table 表名 add 字段名 类型 [comment 注释] [约束];`
+ 修改字段类型：`alter table 表名 modify 字段名 新数据类型;`
+ 修改字段名和字段类型：`alter table 表名 change 旧字段名 新字段名 类型 [comment 注释] [约束];`
+ 删除字段：`alter table 表名 drop column 字段名;`
+ 修改表名：`rename table 表名 to 新表名;`

`删除`

+ 删除表：`drop table [if exists] 表名;`

### 3.2. DML（Data Manipulation Language）
`数据操作语言，用来对数据库中表的数据进行增，删，改操作`

#### 3.2.1. 添加数据
+ 指定字段添加数据：`insert into 表名（字段名1，字段名2） values （值1，值2）;`
+ 全部字段添加数据：`insert into 表名 values （值1，值2）;`
+ 指定字段批量添加数据：`insert into 表名（字段名1，字段名2） values （值1，值2）,（值1，值2）;`
+ 全部字段批量添加数据：`insert into 表名 values （值1，值2）,（值1，值2）;`

#### 3.2.2. 修改数据
`update 表名 set 字段名1=值1，字段名2=值2，…… [where 条件];`

#### 3.2.3. 删除数据
`delete from 表名 [where 条件];`

如果要删除某一字段的值，可以使用update，将该字段的值置为null

### 3.3. DQL（Data Query Language）
`数据查询语言，用来查询数据库表中的数据`

#### 3.3.1. 基本查询
+ 查询多个字段[设置别名]：`select 字段1 [as 别名1]，字段2 [as 别名2] from 表名;`
+ 查询所有字段：`select * from 表名;`
+ 去除重复记录：`select distinct 字段列表 from 表名;`

#### 3.3.2. 条件查询（where）
`select 字段名 from 表名 where 条件列表;`

#### 3.3.3. 分组查询（group by）

`select 字段列表 from 表名 [where 条件列表] group by 分组字段名 [having 分组后过滤条件];`

例：`select  job,count(*)  from  users  where  entrydata<='2015-1-1'  group  by  job  having  count(*)>=2;`

>[!WARNING]where 与 having 的区别：
>
>1,执行时机不同: where是分组之前进行过滤 , 不满足where条件 , 不参与分组 ; having是分组之后对结果进行过滤
>
>2,判断条件不同: where不能对聚合函数进行判断，而having可以

#### 3.3.4. 排序查询（order by）
`select 字段列表 from 表名 [where 条件列表] [group by 分组字段名] order by 字段1 排序方式1,字段2 排序方式2;`

#### 3.3.5. 分页查询（limit）
`select 字段名 from 表名 limit 起始索引，查询记录数;`

其中：起始索引=（查询页码-1）*每页显示记录数

### 3.4. DCL（Data Control Language）
`数据控制语言，用来创建数据库用户、控制数据库的访问权限`

## 4. 多表设计
### 4.1. 一对多
在多的一方添加外键，关联另外一方的主键

### 4.2. 一对一
任意一方，添加外键，关联另外一方的主键

### 4.3. 多对多
借助中间表，中间表的两个外键，分别关联另外两张表的主键

## 5. 多表查询
### 5.1. 内连接
+ 隐式内连接：`select 字段列表 from 表1，表2 where 连接条件 ……;`
+ 显示内连接：`select 字段列表 from 表1 join 表2 on 连接条件……;`

### 5.2. 外连接
+ 左外连接：`select 字段列表 from 表1 left join 表2 on 连接条件 ……;`
+ 右外连接：`select 字段列表 from 表1 right join 表2 on 连接条件 ……;`

### 5.3. 子查询
SQL语句中嵌套select语句，称为嵌套查询（子查询）

#### 5.3.1. 标量子查询
`select * from t2 where 条件 =（select 字段列表 from t2 where 条件）;`

当（`select 字段列表 from t2 where 条件`）查询出来的是 单个值 时使用

#### 5.3.2. 列子查询
`select * from t2 where 条件 in（select 字段列表 from t2 where 条件）;`

当（`select 字段列表 from t2 where 条件`）查询出来的是 一列（多行）时使用

#### 5.3.3. 行子查询
`select * from t2 where （条件1，条件2）=（select 字段1，字段2 from t2 where 条件）;`

当（`select 字段1，字段2 from t2 where 条件`）查询出来的是 一行（多列）时使用

#### 5.3.4. 表子查询
当（`select 字段1，字段2 from t2 where 条件`）查询出来的是 多行 多列 时使用

## 6. 事务（ACID）
四大特性：

+ 原子性
    - 原子性是指事务包含的所有操作要么全部成功，要么全部失败回滚
+ 一致性
    - 一致性要求事务执行前后数据库的状态保持一致。事务执行过程中可能涉及多个操作，这些操作的结果必须满足数据库的约束和规则
+ 隔离性
    - 隔离性是指当多个用户并发访问数据库时，比如操作同一张表时，数据库为每个用户开启的事务，不能被其他事务的操作干扰，多个并发事务要互相隔离
+ 持久性
    - 持久性是指一个事务一旦被提交了，那么对数据库中的数据的改变是永久的，即便是在数据库系统中遇到故障的情况下也不会丢失提交事务的操作

开启事务：`start transaction;`

提交事务：`commit;`

回滚事务：`rollback;`

## 7. 索引（index）
作用：提升查询速度

+ 创建索引：`create index 索引名 on 表名（字段名，……）;`
+ 查看索引：`show index from 表名;`
+ 删除索引：`drop index 索引名 on 表名;`

>[!WARNING] 注意
> 在创建索引时，如果只传一个字段，只会为该字段创建索引；如果传入多个字段，创建的则是联合索引

## 8. 性能优化
### 8.1 批量插入
+ 一次插入多条数据
+ 不使用主键，索引，外键
+ 合理进行事务提交
+ 多线程批量插入
+ mysql服务器参数优化

**🥳 将来的你，一定会感谢现在努力奋斗的你，加油！💯**
