# Redis
<Linkcard url="https://www.redis.net.cn/" title="Redis官网" description="https://www.redis.net.cn" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202502281424408.png"></Linkcard>

## 1. 认识 Redis
### 1.1. 什么是 Redis？
Redis是一个基于内存的key-value结构数据库

### 1.2. Redis 的特点
1. Redis 的<font style="color:#D22D8D;">数据存储</font>在<font style="color:#D22D8D;">内存</font>中，因此具有非常<font style="color:#D22D8D;">快</font>的<font style="color:#D22D8D;">读写速度</font>
2. Redis 使用类似于<font style="color:#D22D8D;">键值对</font>的结构（哈希表）来存储数据
3. Redis 执行命令是由<font style="color:#D22D8D;">单线程</font>负责的，因此不存在并发竞争的问题，保证了操作的原子性(要么全成功，要么全失败)
4. Redis 提供了<font style="color:#D22D8D;">持久化</font>功能，包括：AOF 、RDB 以及混合持久化，可以将内存中的数据定期或异步地写入硬盘，以实现数据的持久化和备份。这可以保证数据的安全性，即使在系统出现故障时也不会丢失数据
5. Redis 支持<font style="color:#D22D8D;">事务</font>功能，提供了一种保证一系列命令按顺序、原子性、隔离性执行的机制，适用于多个命令按顺序执行并保证一致性的场景。但 Redis 事务并不支持回滚操作，如果执行过程中某条命令执行失败，后续的命令仍然会继续执行，而不会回滚到事务开始前的状态
6. Redis 还支持 Lua 脚本、多种集群方案（主从复制模式、哨兵模式、集群模式）、发布/订阅模式，内存淘汰机制、过期删除机制等等

### 1.3. Redis 为什么快？
Redis 的 QPS 可以达到约 100000（每秒请求数 10w/s）
>[!WARNING] QPS (Queries Per Second)
>指的是每秒钟 Redis 能够处理的查询数量。QPS 是衡量 Redis 性能的一个重要指标，它反映了 Redis 服务器处理客户端请求的能力


1. 基于<font style="color:#D22D8D;">内存</font>实现
2. 高效的事件处理模型
    1. <font style="color:#D22D8D;">单线程</font>执行命令：可以避免多线程之间的竞争问题，省去了多线程切换带来的时间和性能上的开销
    2. IO 多路复用：IO 多路复用机制是指<font style="color:#D22D8D;">一个线程处理多个 IO 流</font>
3. 高效的数据结构
    1. Redis 数据库<font style="color:#D22D8D;">使用</font>全局<font style="color:#D22D8D;">哈希表</font>来<font style="color:#D22D8D;">保存</font>所有<font style="color:#D22D8D;">键值对</font>，哈希表的时间复杂度是O(1)，它能够提供高效的查找和插入操作
    2. Redis <font style="color:#D22D8D;">内置</font>了<font style="color:#D22D8D;">很多高效</font>的<font style="color:#D22D8D;">数据结构</font>，包括：SDS（简单动态字符串）、链表、压缩列表、哈希表、整数集合、跳表、quicklist（3.2 以后版本 双向链表 + 压缩列表）、listpack（5.0 以后版本） 等

## 2. Redis 与 Memcached 有什么区别？
| | Redis | Memcached |
| --- | --- | --- |
| 数据类型 | 支持的数据类型更<font style="color:#DF2A3F;">丰富</font>（String、Hash、List、Set、ZSet） | <font style="color:#DF2A3F;">只</font>支持最简单的 key-value 数据类型 |
| 持久化 | <font style="color:#DF2A3F;">支持</font>数据的持久化，可以将内存中的数据保持在磁盘中，重启的时候可以再次加载进行使用 | <font style="color:#DF2A3F;">不支持</font>持久化，数据全部存在内存之中 |
| 集群模式 | 原生<font style="color:#DF2A3F;">支持</font>集群模式 | <font style="color:#DF2A3F;">不支持</font>原生的集群模式 |
| 删除策略 | <font style="color:#DF2A3F;">惰性</font>删除、<font style="color:#DF2A3F;">定期</font>删除 | <font style="color:#DF2A3F;">惰性</font>删除 |


+ 惰性删除：当一个 key 过期时，会被标记为过期状态（是由定时器或定时任务的机制来检测过期的 key，并标记状态），<font style="color:#D22D8D;">只有当这个 key 被访问时，才会执行删除操作</font>。这种策略可以节省 CPU 资源，因为只有在需要时才会进行删除操作。然而，如果一个 key 过期后没有被访问，它将继续存在于内存中，直到被访问
+ 定期删除：Redis 定期扫描其内部的数据结构，检查是否有 key <font style="color:#D22D8D;">到达了过期时间</font>，并<font style="color:#D22D8D;">执行删除</font>操作。这种策略可以确保过期的 key 被及时删除，但可能会浪费 CPU 资源，因为删除操作需要额外的 CPU 时间和检测成本

## 3. 为什么要用 Redis 作缓存？
高性能！高并发！

**高性能的数据存储和查询能力**

假如用户第一次访问 Mysql 数据库中的某些数据的话，这个过程是比较慢，因为是从硬盘中读取的。如果将该用户访问的数据存在 Redis 缓存中。那用户下一次再访问这些数据的时候，就可以直接从 Redis 缓存中获取了。而操作 Redis 缓存就是直接操作内存，所以速度相当快

**高并发的数据处理能力**

一般像 MySQL 这类的数据库的 QPS 大概都在 1w 左右（4 核 8g） ，但是使用 Redis 缓存之后很容易突破 10w

所以，直接访问 Redis 能够承受的请求数量是远远大于直接访问 MySQL 的

## 4. 数据类型
+ 字符串(String)：普通字符串，Redis中最简单的数据类型
+ 哈希(Hash)：也叫散列，类似于java中的HashMap
+ 列表(List)：按照插入顺序排序，可以有重复元素，类似于java中的LinkedList
+ 集合(Set)：无序集合，没有重复元素，类似于java中的HashSet
+ 有序集合(sorted set/zset)：集合中每个元素关联一个分数，根据分数升序排序，没有重复元素
+ 位图(Bitmaps)
+ 基数统计(HyperLogLog)
+ 地理信息(GEO)
+ 流(Stream)

## 5. 操作命令（命令行中）
### 5.1. 字符串(String)
+ **set key value**			设置指定key的值								(`set name jack`)
+ **get key**			获取指定key的值								(`get name`)
+ **setex key seconds value**	设置指定key的值，并将key的过期时间设为seconds秒	(`setex sex 30 男`)
+ **setnx key value**		只有在key不存在时设置key的值					(`setnx age 18`)

### 5.2. 哈希(Hash)
+ **hset key field value**		将哈希表key中的字段field的值设置为value	(`hset set1 name 雷伊`)
+ **hget key field**			获取存储在哈希表中指定字段的值			(`hget set1 name`)
+ **hdel key field**			删除存储在哈希表中的指定字段				(`hdel set1 name`)
+ **hkeys key**			获取哈希表中所有字段					(`hkeys set1`)
+ **hvals key**				获取哈希表中所有值						(`hvals set1`)

### 5.3. 列表(List)
+ **lpush key value1 [value2]**	将一个或多个值插入到列表头部		(`lpush list1 a b c`)
+ **lrange key start stop**		获取列表指定范围内的			(`lrange list1 0 -1`)
+ **rpop key**					移除并获取列表最后一个元素		(`rpop list1`)
+ **llen key**					获取列表长度					(`llen list1`)

### 5.4. 集合(Set)
+ **sadd key member1 [member2]**	向集合中添加一个或多个成员	(`sadd set2 a b x y`)
+ **smembers key**					返回集合中的所有成员		(`smembers set2`)
+ **scard key**						获取集合的成员数			(`scard set2`)
+ **sinter key1 [key2]**				返回给定集合的交集			(`sinter set2 set3`)
+ **sunion key1 [key2]**				返回给定集合的并集			(`sunion set2 set3`)
+ **srem key member1 [member2]**	删除集合中一个或多个成员	(`srem set2 a x`)

### 5.5. 有序集合(sorted set/zset)
+ **zadd key score1 member1 [score2 member2]**	向有序集合添加一个或多个成员 (`zadd zset1 10 a 10.5 b`)
+ **zrange key start stop**						通过索引区间返回有序集合中指定区间内的成员 (`zrange zset1 0 -1`)
+ **zincrby key increment member**				有序集合中对指定成员的分数加上增量 increment (`zincrby zset1 10 a`)
+ **zrem key member1 [member2]**				移除有序集合中的一个或多个成员 (`zrem zset1 a`)

### 5.6. 通用命令
+ **keys pattern**	查找所有符合给定模式pattern的key		(`keys *`)  (`keys set*`)
+ **exists key**		检查给定key是否存在				(`exists zset1`)
+ **type key**		返回key所储存的值的类型				(`type zset1`)
+ **del key**		key存在时删除key					(`del zset1`)

## 6. 在Java中使用
Spring Data Redis 使用方式：

1.**导入Spring Data Redis的maven坐标**

::: code-group
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```
:::

2.**配置Redis数据源**

::: code-group
```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 252748377
```
:::

3.**编写配置类，创建RedisTemplate对象**

::: code-group
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfiguration {
    @Bean
    public RedisTemplate redisTemplate(RedisConnectionFactory redisConnectionFactory){
        RedisTemplate redisTemplate = new RedisTemplate();
        //设置redis的连接工厂对象
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        //设置redis key的序列化器
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
```
:::

4.**通过RedisTemplate对象操作Redis**

### 6.1. 字符串(String)
::: code-group
```java
public void testString(){
    //set get setex setnx
    ValueOperations valueOperations = redisTemplate.opsForValue();
    valueOperations.set("city","上海");//set
    String city = (String) valueOperations.get("city");//get
    System.out.println(city);
    valueOperations.set("name","小明",3, TimeUnit.MINUTES);//setex
    valueOperations.setIfAbsent("age","2");//setnx
}
```
:::


### 6.2. 哈希(Hash)
::: code-group
```java
public void testHash(){
    //hset hget hdel hkeys hvals
    HashOperations hashOperations = redisTemplate.opsForHash();
    hashOperations.put("hash1","name","tom");//hset
    hashOperations.put("hash1","age","18");//hset
    String name = (String) hashOperations.get("hash1", "name");//hget
    System.out.println(name);
    Set keys = hashOperations.keys("hash1");//hkeys
    System.out.println(keys);
    List values = hashOperations.values("hash1");//hvals
    System.out.println(values);
    hashOperations.delete("hash1","name");//hdel
}
```
:::

### 6.3. 列表(List)
::: code-group
```java
public void testList(){
    //lpush lrange lpop llen
    ListOperations listOperations = redisTemplate.opsForList();
    listOperations.leftPushAll("list","a","b","c");//lpush
    listOperations.leftPush("list","x");//lpush
    List list = listOperations.range("list", 0, -1);//lrange
    System.out.println(list);
    Object rightPop = listOperations.rightPop("list");//lpop
    System.out.println(rightPop);
    Long size = listOperations.size("list");//llen
    System.out.println(size);
}
```
:::


### 6.4. 集合(Set)
::: code-group
```java
public void testSet(){
    //sadd smember scard sinter sunion srem
    SetOperations setOperations = redisTemplate.opsForSet();
    setOperations.add("set1","a","b","c","d");//sadd
    setOperations.add("set2","a","b","x","y");//sadd
    Set members = setOperations.members("set1");//smember
    System.out.println(members);
    Long size = setOperations.size("set1");//scard
    System.out.println(size);
    Set intersect = setOperations.intersect("set1", "set2");//sinter
    System.out.println(intersect);
    Set union = setOperations.union("set1", "set2");//sunion
    System.out.println(union);
    setOperations.remove("set1","a","b");//srem
}
```
:::


### 6.5. 有序集合(sorted set/zset)
::: code-group
```java
public void testZSet(){
    //zadd zrange zincrby zrem
    ZSetOperations zSetOperations = redisTemplate.opsForZSet();
    zSetOperations.add("zset1","a",10);//zadd
    zSetOperations.add("zset1","b",9.5);//zadd
    zSetOperations.add("zset1","c",10.5);//zadd
    Set zset1 = zSetOperations.range("zset1", 0, -1);//zrange
    System.out.println(zset1);
    zSetOperations.incrementScore("zset1","c",10);//zincrby
    zSetOperations.remove("zset1","a");//zrem
}
```
:::

### 6.6. 通用命令
::: code-group
```java
public void testCommon(){
    //keys exists type del
    Set keys = redisTemplate.keys("*");//keys
    System.out.println(keys);
    Boolean name = redisTemplate.hasKey("name");//exists
    System.out.println(name);
    Boolean set1 = redisTemplate.hasKey("set1");//exists
    System.out.println(set1);
    for (Object key : keys) {
        DataType type = redisTemplate.type(key);//type
        System.out.println(type.name());
    }
    redisTemplate.delete("zset1");//del
}
```
:::

**🥳 将来的你，一定会感谢现在努力奋斗的你，加油！💯**
