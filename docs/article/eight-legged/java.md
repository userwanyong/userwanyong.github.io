# Java 八股汇总

<img src="https://img.shields.io/badge/-Java-F78C40?logo=OpenJDK&logoColor=FFF" alt="Java" style="display: inline-block;margin-right: 2px" /> 
<img src="https://img.shields.io/badge/-八股文-8A2E2" alt="" style="display: inline-block;margin-right: 2px"/> 

## 第一部分 | HashMap

### 1. HashMap的原理
1.  jdk7及之前，是数组+链表；jdk8及之后，使用数组+链表+红黑树
2.  寻址：通过`(table.length-1)&hash(key)`计算这个key应该放在数组中位置对应的下标
3.  哈希冲突：两个key计算出来的下标一样，在jdk7及之前，是使用链表，采用头插法；jdk8及之后，使用链表+红黑树，采用尾插法，当链表长度>=8且数组容量>=64时，会将链表转化为红黑树，查询效率由O(n)变为O(logn)，当链表长度<=6时，再转变为链表（为什么是8呢，因为一个桶里元素个数达到8的概率非常低，千万分之六，如果真的达到了，说明hash分布极差，这样做可以确保极端情况下的性能）
4.  扩容：HashMap的负载因子默认是0.75，初始容量默认是16，当数组大小超过16*0.75=12时，会触发扩容，所有数据重新计算位置；jdk8及之后判断 `hash(key)&老数组长度` 的值，如果非0则是原数组下标+老数组长度，为0则不需要移动
5.  HashMap的key必须实现hashCode和equals方法，hashCode用于计算哈希值，确认存储位置的下标，equals判断两个键是否相同，如果hashCode相同而equals返回false，则这两个键不同，存储在同一个桶的不同位置，如果都相同，则覆盖旧值

### 2. HashMap扩容时为什么采用2的n次方
1.  一句话概括：提高hash值的分布均匀性和hash计算的效率
2.  分布均匀：值的大小是2的n次幂的时候，n-1换算为二进制后面全是1，和hash值进行与运算的时候，更不容易发生哈希碰撞，分布更加均匀
3.  计算效率：位运算相对于取余运算效率要高，而 hash%n = hash&(n-1) 只有n为2的n次幂时才成立

### 3. HashMap中为什么数组长度>=64才转化为红黑树
1.  避免频繁树化：如果刚树化没多久就扩容，就要重新分配了
2.  减少内存的占用：一开始不采用红黑树而是先使用链表是因为红黑树额外指针占用大，等达到一定规模后再转化为红黑树

### 4. JDK 1.8对HashMap除了红黑树还有哪些改动
1.  优化哈希函数：使用扰动函数，确保哈希的高低位都能参与计算
2.  扩容机制：不再对每个元素进行重新取模计算，而是根据 `hash(key)&老数组长度` 如果是1则下标变为原位置+旧数组长度，否则不动
3.  头插变尾插：解决多线程插入时逆序成环问题

### 5. 为什么HashMap采用拉链法？ThreadLocalMap采用开放寻址法？
1.  HashMap的应用场景主要是增删改查，采用拉链法能灵活的在链表中删除一个元素。其次就是拉链法更适合HashMap的负载因子+扩容机制，在冲突数多的情况下也只是链表变长。如果采用其他方法比如开放寻址法，在删除的时候不能直接删，要留个墓碑标记，不然会截断后续元素的探测路径，如果冲突多了，性能急剧下降
2.  ThreadLocalMap一般不会存太多数据，冲突概率很低；其次它的删除频次不高，主要是set和get，删除的劣势影响不大；还有一点就是数据都存在数组里，缓存命中率很高。如果采用拉链法会增加额外的指针从而增加内存开销

### 6. HashMap性能提升技巧
1.  设置合理的初始容量，尽量避免扩容
2.  权衡负载因子，这个一般用0.75就行，这是官方测试的时间复杂度与空间利用率最高的平衡点
3.  减少hashCode的冲突
4.  遍历时使用entrySet，获取key和value时只需要一次hash
5.  选择合适的数据结构，如保证插入顺序使用LinkedHashMap，排序使用TreeMap，线程安全使用ConcurrentHashMap

### 7. HashMap和HashSet的区别
1.  HashSet具有无序、唯一性
2.  HashSet内部其实new了一个HashMap实现的，HashSet的元素实际存储在HashMap的key中，而所有value都是一个常量。因为HashMap键唯一，值可重复的特性

### 8. HashMap和HashTable的区别
1.  线程安全角度：HashMap-非线程安全；HashTable-线程安全，因为使用了synchronized关键字，保证多线程的并发安全
2.  性能角度：因为HashTable使用了同步锁机制，性能低于HashMap
3.  空值角度：HashMap的键可以允许一个为null，值可以多个为null，HashTable的键值都不允许为null
4.  继承角度：HashMap继承自AbstractMap，HashTable继承自Dictionary，都实现了Map接口

### 9. hashCode和equals
1.  他们两个的关系主要体现在HashMap和HashSet中
2.  hashCode用于计算对象的hash值；equals用于判断两个对象是否相等，默认是比较对象的内存地址
3.  两者的关系：HashCode相同，equals不一定相等；equals相等，HashCode一定相同
4.  重写equals必须重写hashCode，如果只重写equals不重写hashCode，HashSet中可能会出现相同属性的对象，因为hashCode计算出来的hash值不同时，根本走不到目的equals方法的比较，直接返回flase了

### 10. ConcurrentHashMap 1.7和1.8有哪些区别、以及与HashTable的区别
1.  锁的粒度：jdk1.7采用的是分段锁，锁的是segment，把整个数组分为16个segment，每个segment里面都有一个HashMap；jdk1.8移除了segment，跟HashMap同步，采用数组+链表+红黑树，锁的是每个node，并发度大幅提升
2.  锁的方式：jdk1.7使用ReentrantLock；1.8使用的是CAS+synchronized，通过计算key哈希后的下标，如果该下标未有node，则使用CAS进行插入，否则使用synchronized进行上锁，然后进行对比修改
3.  扩容方式：1.7使用segment，当某个segment中的HashMap达到阈值时，对该segment内的HashMap进行扩容，不会影响其他segment；1.8的扩容机制就类似于HashMap的扩容，但他是通过CAS来保证线程安全，同时引入了渐进式扩容
4.  他与HashTable的区别：HashTable使用全表锁，而ConcurrentHashMap使用的是CAS插入，如果不为空，锁住相应node，锁的粒度更细

### 11. LinkedHashMap是什么
1.  它继承自HashMap，保留键值对的插入顺序，构造时如果指定accessOrder参数为true，则是以访问顺序排序，可以实现LRU缓存
2.  内部维护了一个双向链表来记录元素的插入/访问顺序

### 12. 让你设计一个HashMap，应该如何设计
1.  需要考虑的方向有：hash函数、扩容、处理冲突、安全性、使用场景等
2.  基本原理是将key经过hash函数进行散列得到散列值，然后用散列值对数组长度取模得到对应的下标，所以hash函数很重要，要计算快，还要保证分布均匀，减少hash碰撞；hash可以采用高位与低位异或运算，取模可以用与运算代替
3.  然后就是扩容，当数组元素超过容量与负载因子的乘积时，要考虑扩容（2的倍数，减少重新哈希的计算量），提前预估数据，避免频繁的扩容
4.  处理冲突可以采用链表法，当链表长度到达一定值时可以转化为红黑树增加查找效率
5.  在多线程环境下要保证安全性，可以使用Collections.synchronizedMap实现同步，如果并发修改失败要抛出异常
6.  对于内存受限场景，提高负载因子以减少扩容次数；高并发场景，降低负载因子以减少哈希冲突，提高查询效率

### 13. 如何设计一个线程安全的HashMap
1.  使用Collections.synchronizedMap，通过加synchronized锁来实现线程安全，会对整个Map加锁
2.  采用CAS+分段锁机制，CAS可以在无锁的情况下线程安全的写入，每次锁的是一个小节点，大幅减少锁的性能影响
3.  无锁方案：写时复制，每次进行写操作时，复制当前Map的副本，在这个副本上进行更改，最后替换掉原来的Map；这样每次读取时操作的是当前的Map，写操作是在副本进行的，不会收到影响，但会产生较大的内存开销，适用于读多写少的场景

### 14. 假设有1G大小的HashMap，此时用户请求过来刚好扩容，会发生什么，应该如何优化
1.  扩容需要一定的时间，而且数据量又大，会使用当前线程完成扩容，所以用户会被阻塞，直到扩容完毕
2.  在单线程中，可以使用渐进式rehash，分批完成扩容。具体来说就是当需要扩容的时候，HashMap维护两个数组，旧数组和新数组，新数组为旧数组的两倍，当进行扩容时，当前线程移动一部分数据，然后后续每次请求时，会判断旧数组是否还有未完成的扩容任务，有的话拿出一部分进行迁移，直到所有数据迁移完成
3.  查询：会优先从新数组进行查询，查不到再到老数组进行查询
4.  在多线程下，可以借助多线程来完成，比如ConcurrentHashMap，采用并行迁移，多个线程同时参与扩容。会先创建一个旧数组大小2倍的新数组，每次迁移一部分桶，通过使用一个变量来记录迁移进度，每个线程在扩容时会通过CAS尝试抢占一段区间，同时迁移不同的桶，缩短扩容总耗时

### 15. 在没有内存限制的情况下，如何快速、安全的将1000亿条数据插入到HashMap中
1.  首先指定初始容量比1000亿大一点，然后负载因子设置为1，防止动态扩容
2.  采用多线程进行插入，可以参考ConcurrentHashMap进行并发安全插入。采用CAS+synchronized实现，每个数据插入之前要得到对应下标的锁对象，然后才能执行插入，如果下标对应位置没有锁对象，则需先通过CAS创建锁对象

## 第二部分 | 集合

### 1. 列举一下Java中的集合类
1.  主要分为两大类，Collection（Set、List、Queue）和Map
2.  Set：`HashSet`-基于哈希表，元素无序；`LinkedHashSet`-基于双向链表+哈希表，维护插入顺序；`TreeSet`-基于红黑树，按大小排序
3.  List：`ArrayList`-底层是数组，查询快，增删慢；`LinkedList`-底层双向链表，增删快，查询慢，也可以作为队列使用；`Vector`-线程安全的ArrayList，读写都要加锁，现在基本淘汰了
4.  Queue：`PriorityQueue`-优先级队列，优先级高的先出列，默认是最小值先出列；`LinkedList`
5.  Map：`HashMap`-基于哈希表，键最多一个为null，值可以多个为null；`LinkedHashMap`-基于哈希表+双向链表，保持插入顺序；`TreeMap`-基于红黑树，key按大小排序；`HashTable`-线程安全的Map，键值都不能为null；`ConcurrentHashMap`-HashTable的代替品，性能更好，适用于高并发场景

### 2. 数组和链表的区别
1.  数组：一块连续的内存区域，查询是只需要计算 `基地址+下标×元素大小` 就能得到具体的地址，查询复杂度为O(1)；但对于从中间插入/删除时，其后面的所有元素都要改变位置，最坏情况下时间复杂度能达到O(n)
2.  链表：在内存中不连续，使用指针连接，这也意味着链表的每个节点除了存数据外，还要维护指针；对于知道具体位置的节点时，插入/删除复杂度为O(1)，但大多数情况需要遍历才能得到具体位置，而遍历最坏情况下会达到O(n)，所以性能跟数组差不多，但增加了指针的开销
3.  综上所述，大多数场景还是使用数组，如使用ArrayList，即使数组在插入/删除时需要移动部分元素，但使用的是native方法，CPU对它有优化，性能比想象中的要快；其次是现代的CPU读内存是一次读取的是一个缓存行，而数组的内存空间是连续的，读取一个元素时会顺带把周围元素也装进缓存，下次读到周围的元素时直接命中缓存，比读内存快几十倍

### 3. 说一说ArrayList的扩容机制是怎样的
1.  ArrayList默认初始容量是10，如果放入第11个元素就要进行扩容，扩大为原来的1.5倍（`a+(a>>1)`），然后创建一个新数组，使用Arrays.copyOf()方法把老数据拷贝过去
2.  为什么是1.5倍呢？因为1.5倍是时间和空间的折中，如果扩容2倍，扩容次数减小了，但会产生很大的内存浪费；1.5倍既能减少扩容次数，又不会让内存利用率太低
3.  对于内存分配方面，jdk7之前会立即分配空间，而jdk7及之后改为懒初始化，只创建一个空数组，只有在第一次调用add的时候才会分配起始容量，优化了内存

### 4. 为什么不推荐使用Stack类
1.  有两个原因，第一是Stack继承Vector，这也就意味着每个方法都有synchronized锁，太重了
2.  第二就是Stack继承Vector说明栈是一种向量，但栈只应该暴露pop/push/peek等操作，继承Vector会暴露get/set/remove这些方法，破坏了栈的语义
3.  所以说现在大多情况会使用Deque来实现栈的操作，如ArrayDeque和LinkedList

### 5. CopyOnWriteArrayList和Collection.synchronizedList的区别
1.  CopyOnWriteArrayList是写时复制，写入时会复制一个副本进行写入，读的话依然是读原数组，等写入完成后用新数组替换掉旧数组，适用于读多写少的场景
2.  Collection.synchronizedList则是采用锁设计，给原来的List套一层壳，读写都要加锁，适用于临时对一个List在多线程环境下使用的场景；但注意，迭代时仍需手动加锁

## 第三部分 | Java中的锁

### 1. 什么情况下会发生死锁，如何避免死锁
1.  互斥、持有并等待、不可抢占、循环等待是产生死锁的四个必要条件

    1.  互斥：资源只能被一个线程占有
    2.  持有并等待：已经得到一个资源，还需要其他资源
    3.  不可抢占：已获得的资源不能被抢走，只能自己释放
    4.  循环等待：A等B，B等A

2.  避免死锁主要是打破这四个条件中的其中一个或多个，比如统一加锁顺序（破坏循环等待）、设置超时时间（破坏不可抢占）、一次性申请所有资源（破坏持有并等待）、或者采用无锁CAS方案（破坏互斥）

### 2. Synchronized和ReentrantLock有什么区别
1.  synchronized：是JVM内置的关键字，加在方法或代码块上，由JVM自动管理加锁与解锁，但不代表能避免死锁

    1.  如果修饰的是实例方法，锁的是当前对象，只对同一个对象的进程生效，不同对象之间互不影响
    2.  修饰静态方法时，锁的就是当前类的Class对象，所有线程访问这个静态方法都要抢同一把锁
    3.  wait()-进入等待并释放锁；notify()-随机唤醒一个等待的进程；notifyAll()-唤醒所有等待进程，让他们竞争锁

2.  ReentrantLock：是JUC提供的可重入锁，需要手动加锁和解锁，如果操作不当会造成死锁；但他提供的功能比synchronized强大，比如tryLock()、公平锁、可中断、多条件队列等

    1.  tryLock()：在未设置超时时间的情况下，如果拿不到锁立刻返回flase
    2.  公平锁：构造函数传入true时触发，先到先得
    3.  可中断：使用lockInterruptibly()时可以打断等锁，而用lock()时不支持被打断，只能一直等
    4.  多条件队列：一个锁可以绑定多个条件，实现分组唤醒

### 3. Java中锁的自适应自旋是什么
1.  它是synchronized重量级锁的一个优化手段，线程抢锁失败后不会立刻阻塞，而是先自旋一会等待锁释放，自旋时间是JVM根据上次自旋结果动态调整的
2.  如果上次自旋很快拿到锁，JVM就会认为这次自旋也可能很快成功，就自旋等待一会；如果上次自旋等待了好久还是失败了，JVM就会认为这把锁的竞争很激烈，少转甚至不转，直接阻塞
3.  为什么要有自旋呢？因为线程阻塞和唤醒成本很高，涉及到用户态和内核态的切换，如果锁很快就释放了，可以多自旋等一会，减少上下文切换的开销。但自旋状态CPU会空转，所以需要自适应机制来平衡
4.  自旋发生在重量级锁阶段CAS失败后，如果是轻量级锁CAS失败了，会升级为重量级锁，不会自旋

###  4. 说一说synchronized的实现原理
1.  它的实现主要依靠于监视器锁（Monitor）和对象头（包含Mark Word）
2.  当修饰方法时，会在方法的访问标志中加 `ACC_SYNCHRONIZED`，线程进入方法前JVM会检查这个标志，有的话就要拿到对象的监视器锁才能执行
3.  修饰代码块时，编译器会在代码块入口插入 `monitorenter`这个字节码指令，在正常出口和异常出口都添加 `monitorexit`字节码指令，保证发生异常也能结束。线程执行 `monitorenter` 时会尝试获取监视器锁，获取成功则进入临界区，失败则阻塞等待；执行 `monitorexit`时释放锁并唤醒等待队列中的线程
4.  对象头中的Mark Word会根据锁的状态存储不同的信息：无锁时存对象的hashCode和GC信息；偏向锁存线程ID；轻量级锁存指向栈中Lock Record的指针；重量级锁存指向Monitor对象的指针
5.  JDK1.6给synchronized加了一套锁升级机制，偏向锁->轻量级锁->重量级锁，只升不降（这里的只升不降指的是竞争过程中不会降级，如果所有线程都释放锁了，就会恢复成无锁状态）

### 5. 说一下synchronized的锁升级机制
1.  偏向锁：为“始终只有一个线程访问”的场景而设计。第一个线程来的时候，JVM通过CAS把线程ID写到Mark Word里，下一次这个线程再来的时候直接放行。但如果有第二个线程来了，就要撤销偏向锁，升级为轻量级锁（偏向锁的撤销要在安全点进行，JDK15默认禁用偏向锁，JDK18彻底移除了偏向锁）
2.  轻量级锁：适合多个线程交替访问，没有真正竞争的场景。线程在自己的栈帧中创建一个Lock Record，把对象的Mark Word信息拷贝过去，然后CAS把对象头指向这个Lock Record。成功就拿到锁，失败就升级为重量级锁（重入的时候，再入栈一个栈桢，Lock Record里的displaced header设为null，解锁的时候看到null就知道是重入的，直接返回）
3.  重量级锁：重量级锁的核心是ObjectMonitor，它是c++实现的，使用操作系统的互斥量（mutex）机制来实现线程的阻塞与唤醒
4.  为什么偏向锁的撤销需要在安全点进行？撤销时需要遍历线程栈，找到持有这个锁的栈桢，修改Lock Record，这个操作在线程跑着的时候做会把数据弄乱，安全点是JVM约定可以暂停的位置，停在安全点才能安全的执行操作

### 6. 为什么JDK15要废弃偏向锁
1.  偏向锁是为“始终只有一个线程访问”的场景设计的，现在的应用基本都是多线程的，偏向锁能派上用场的机会很少，偏向锁的撤销需要等到安全点，还要遍历线程栈，开销很大，官方在做了大量测试之后，发现禁用偏向锁后，大多数应用性能反而更好，所以JDK15默认禁用偏向锁，JDK18彻底移除了相关代码

## 第四部分 | 线程、线程池

### 1. 说一下Java线程的生命周期
1.  Java线程生命周期有6种状态，分别是new、runnable、blocked、waiting、timed_waiting、terminated

    1.  new：线程刚创建出来，还没调用start()
    2.  runnable：线程调用start()后进入这个状态，它包含了操作系统层面的就绪和运行
    3.  blocked：线程没抢到锁就会进入这个状态
    4.  waiting：主动调用wait()/park()/join()，需要被其他线程唤醒
    5.  timed_waiting：与waiting类似，带超时时间，sleep(n)/wait(n)/join(n)
    6.  terminated：run()方法正常结束/抛异常

2.  操作系统中也把线程分为5种状态，分别是新建、就绪、运行、阻塞、终止，与Java线程的对应关系是

    1.  new-新建
    2.  runnable-就绪+运行（因为JVM无法精准感知线程是在CPU上跑着还是在就绪队列里等着）
    3.  blocked、waiting、timed_waiting-阻塞
    4.  terminated-终止

3.  在开发期间应该注意几个关键点

    1.  如果线程持有锁，sleep期间锁不会释放，想要让出锁应该用wait
    2.  wait必须在同步块里调用，不然会抛异常，因为wait要释放锁，没有锁就没法释放
    3.  interrupt不一定能打断线程，它只是设置中断标志位，需要代码主动检查Thread.interrupted

### 2. Thread.sleep()和Thread.yield()的区别
1.  Thread.sleep()：会让线程进入timed_waiting状态，睡眠期间不会占用CPU时间片，等到醒来再重新竞争
2.  Thread.yield()：提示调度器我可以让出CPU时间片，但如果没有合适的线程，当前线程会继续执行，依然是runnable状态；换句话说，我只是可以让出，你如果不要，那我就继续跑了
3.  使用场景：sleep主要用于轮询等待、限流控制、模拟延迟的场景；而yield在实际生产中用的很少，比如自旋锁优化、CPU密集型任务，给其他竞争者一点机会
4.  sleep(0)等价于yield()吗？不一样！sleep(0)一定可以触发一次调度，让线程放弃剩余时间片，执行一次上下文的切换；而yield()只是给建议，JVM可以不采纳
5.  sleep被中断后会发生什么？如果线程在sleep期间被其他线程调用了interrupt()，会立刻抛出 InterruptedException 并清除中断标志位，这就导致了上层代码不知道发生了中断，这时候就要使用try-catch捕获InterruptedException异常并重新设置中断标志（Thread.currentThread().interrupt()）
6.  需要注意的是，sleep并不能精确暂停一段时间，在不同操作系统上会有几毫秒到几十毫秒的误差；要想实现高精度，可以使用LockSupport.parkNanos()，可以精确到纳秒，也可以使用专门的实时系统或者硬件时钟

### 3. Java线程之间如何进行通讯
1.  进程通讯可以分为内存共享和消息传递两种手段
2.  内存共享是最直接的方式，多个线程可以共享同一块数据，但要注意保证可见性、原子性和有序性，volatile只能保证可见性和有序性，因此需要使用synchronized或者锁来实现
3.  消息传递可以通过 等待/通知、阻塞队列 这些机制来实现

    1.  wait/notify：配合synchronized来使用，线程调wait释放锁进行等待，其他线程调notify唤醒它
    2.  Lock+Condition：使用ReentrantLock创建多个条件队列，一把锁绑定多个条件队列，与wait/notify的区别在于它不把所有线程放在一起，而是把不同等待原因的线程分开（notFull/notEmpty）存放，避免无效唤醒
    3.  BlockingQueue：put和take方法自带阻塞逻辑，生产者/消费者场景首选
    4.  volatile：轻量级同步，只适合一个线程写，多个线程读的场景（因为他只能保证可见性和有序性，原子性不能保证）

### 4. 关于BlockingQueue的几种实现
1.  ArrayBlockingQueue：由数组实现，容量固定，适合已知上限的缓冲区；使用的是ReentrantLock，put和take互斥
2.  LinkedBlockingQueue：由链表实现，默认容量是Integer.MAX_VALUE；在头尾都加锁，put和take可并发（线程池的ThreadPoolExecutor默认的任务队列就是它）
3.  SynchronousQueue：容量为0，生产者必须等消费者来取才能返回
4.  PriorityBlockingQueue：具有优先级，元素要实现Comparable接口或构造时传入Comparator。如果是同优先级，那么出队顺序就不能保证了

### 5. Java中创建线程有几种方式
1.  实现Runnable接口：返回viod，不能抛异常
2.  继承Thread类，重写run()方法【不常用，因为Java是单继承的，继承了Thread类就没法继承其他类了】
3.  实现Callable接口：可以返回任意类型，可以抛异常
4.  使用线程池 ExecutorService【生产环境推荐，线程可复用】
5.  使用 CompletableFuture 异步编程模型：默认使用ForkJoinPool.commonPool()这个线程池，默认线程数=CPU核心数-1

### 6. 说一说你对线程池的了解
1.  线程池是一种池化技术，用来复用线程，避免线程频繁的创建与销毁导致的开销；他有几个核心参数，分别是核心线程数、最大线程数、空闲存活时间、工作队列、拒绝策略（还有 时间单位 和 线程工厂）
2.  具体的工作流程为：新任务到来->看核心线程数是否有空闲，有空闲直接处理，否则加入到工作队列->如果工作队列也满了，开始创建非核心线程，但总线程不得超过指定的最大线程数->队列满了，最大线程数也满了，就会触发拒绝策略->空闲线程超过空闲存活时间后进行回收，直到降为核心线程数->如果指定allowCoreThreadTimeOut为true，核心线程也会回收
3.  为什么是先排队再加线程？因为创建线程会有开销，还会导致上下文的切换，工作队列起到削峰填谷的作用
4.  如果将核心线程数设为0，会发生什么？任务先入队，若当前没有线程则会创建一个非核心线程进行处理，如果队列满了，才会尝试直接创建非核心线程

### 7. Java中如何控制线程的执行顺序
1.  Thread.join()：在主线程调用x.join()，主线程会阻塞，等x执行完才继续走。如果前面任务抛异常，join()照样结束，继续执行下一个线程，可以在线程内部使用try-catch处理
2.  CompletableFuture链式调用：thenRun()会在前一个任务执行完成后执行下一个任务。如果前面任务抛异常，后面的thenRun()会被跳过，可以使用execptionally()/handle()捕获异常并返回新值，继续往下走
3.  CountDownLatch：a线程要等b线程执行完，可以a.await()，b完成后countDown()
4.  单线程线程池：任务按顺序提交，天然串行执行

### 8. 线程池有哪些拒绝策略
1.  AbortPolicy（中止）：默认策略，直接抛异常，让上游服务知道具体状况，适用于核心业务场景
2.  CallerRunsPolicy（调用者运行）：谁提交的谁执行，由调用者线程负责执行
3.  DiscardOldestPolicy（丢弃最旧）：移除队列中最久的任务，将新任务塞进去
4.  DiscardPolicy（直接丢弃）：直接丢弃，不执行也不抛异常
5.  当然也可以实现RejectedExecutionHandler接口自定义策略【生产环境常用】，比如阻塞等待、日志告警、降级处理等
6.  为什么不用CallerRunsPolicy呢？如果调用者是Tomcat的工作线程，任务执行太久会导致请求超时，可能拖垮整个服务，并且自我恢复概率极低
7.  自定义拒绝策略需要考虑序列化、幂等、补偿时机等。因为Runnable本身不能直接序列化，需要将参数提取出来，调用时重新组装；幂等要考虑任务本身的幂等和跟正常执行重复的幂等；补偿时机可以考虑定时任务或监听线程池空闲事件

### 9. Executors类提供了哪几种线程池的实现？为什么不推荐用Executors创建线程池？
1.  FixedThreadPool（固定线程池）：核心线程数=最大线程数，使用无界LinkedBlockingQueue队列，适合任务量可预估的场景
2.  CachedThreadPool（缓存线程池）：核心线程数是0，最大线程数为Integer.MAX_VALUE，使用SynchronousQueue队列，每个任务创建一个线程，空闲60s后回收，适合突发性短任务
3.  SingleThreadExecutor（单线程执行）：只有1个线程，使用无界LinkedBlockingQueue队列，适合保证顺序的场景
4.  ScheduledThreadPool（定时线程池）：核心线程数可指定，最大线程数为Integer.MAX_VALUE，使用DelayedWorkQueue队列，适合定时任务场景
5.  WorkStealingPool（工作窃取线程池）：底层使用ForkJoinPool，线程数=CPU核心数，每个线程有自己的任务队列，空闲时会从其他队列里取，适合可拆分小任务场景
6.  不推荐用Executors创建线程池是应为无界队列任务堆积会导致OOM（FixedThreadPool、SingleThreadExecutor），创建大量线程会占用大量资源（CachedThreadPool、ScheduledThreadPool）

### 10. 如何设置Java线程池的线程数
1.  经典公式是：对于CPU密集型任务（加密解密、复杂计算）设置线程数=CPU核心数+1；对于IO密集型任务（读数据库、调用接口）设置线程数=CPU核心数×2；还有个通用公式是线程数=CPU核心数×（1+等待时间/计算时间）
2.  但是在实际场景中，可能一台机器跑着好几个服务，有好几个线程池这类复杂场景，需要根据压测结果调整（CPU利用率、平均响应时间RT、队列堆积）
3.  如何判断是CPU密集型还是IO密集型呢？使用top或jstack去看线程状态，如果大部分时间是runnable说明CPU在计算，属于CPU密集型；如果大部分时间是waiting/timed_waiting，说明都在等IO，属于IO密集型。还可以算等待时间和计算时间的比值，值越大越偏向IO密集型
4.  线程数设置太大会有什么问题？1.内存占用增多；2.上下文切换开销增大，真正干活的反而少了；3.资源竞争加剧，比如数据库连接池就那么多连接，线程多了都在抢
5.  压测时CPU利用率一直上不去，有哪些可能原因？1.下游响应慢，都在等IO，CPU没活干；2.锁竞争严重；3.线程数太少，并发上不去；4.压测工具本省瓶颈

### 11. 线程池出现异常后，如何知道是哪个线程出了异常
1.  自定义ThreadFactory设置UncaughtExceptionHandler：线程抛异常时自动触发回调，全局生效（仅execute()提交生效）
2.  使用submit代替execute：submit返回Future对象，如果抛了异常，调用Future.get()可以拿到
3.  使用try-catch：在run()方法里包一层try-catch，自己记录日志，处理异常
4.  生产环境建议结合使用，自定义ThreadFactory作为兜底，防止异常完全丢掉；关键任务用submit()提交，通过Future获取结果和异常；任务内部也要用try-catch，便于排查问题

### 12. execute()和submit()的区别
1.  execute()：如果发生异常，会触发UncaughtExceptionHandler，抛出异常，然后这个线程就废了，新建一个线程补上。适用于不关心结果的任务，比如日志记录、异步通知
2.  submit()：因为submit提交的任务包了一层RunnableFuture()，如果发生异常会将异常存起来，线程也不会销毁，只有在调用get()方法时才能拿到这个异常。适用于关心结果或异常的任务，比如计算、确认

### 13. Java中的ForkJoinPool是什么
1.  它是JDK7引入的处理分治任务的线程池，会将大任务递归拆成小任务，并行执行，最后将结果合并

    1.  Fork：将大任务递归拆成小任务，提交到当前线程的工作队列
    2.  Compute：小任务在各个线程并行执行
    3.  Join：子任务执行完，逐层向上合并结果

2.  它与其他线程池的最大区别是“工作窃取算法”，每个工作线程都有自己的双端队列，自己产生的子任务从队列头入/取，空闲时从别的线程队列尾偷任务来执行，极大提高了CPU的利用率
3.  在JDK8引入了ForkJoinPool.commonPool()，线程数默认是CPU核心数-1，可通过JVM参数调整；并行流（parallelStream）和CompletableFuture默认就是用的它；但它是JVM全局共享的，如果在其中执行阻塞操作，会影响到其他用到commonPool的代码，所以它适用于CPU密集型任务
4.  它有两个常用子类，RecursiveTask和RecursiveAction，一个有返回值一个无返回值，按是否需要合并结果选取即可
5.  它还提供了ManagedBlocker用来处理阻塞操作，如果任务里有阻塞调用，可以实现这个接口，阻塞前通知ForkJoinPool，让它临时补偿一个线程来维持并行度，阻塞结束后再回收。但频繁阻塞还是会有性能问题

### 14. Java中的CompletableFuture是什么
1.  它是JDK8引入的异步编程工具，支持链式调用，不用手动阻塞等结果（解决了Future只能get阻塞拿结果、没法链式组合、异常处理麻烦的问题）基本用法如下

    1.  使用supplyAsync/runAsync提交一个有返回值/无返回值的任务
    2.  thenApply处理结果；thenAccept消费结果-无返回值；thenRun继续执行后续任务
    3.  whenComplete无论成功失败都会执行，返回结果/异常；exceptionally捕获异常并返回默认值；handle成功/失败都会执行，可以处理结果/异常，返回新结果（whenComplete+exceptionally）
    4.  thenCombine合并两个任务结果；allOf等待多个任务全部完成；anyOf等任意任务执行完；thenCompose串联

2.  它默认的线程池是ForkJoinPool.commonPool，但因为是JVM共享，如果有阻塞调用，会影响其他用到的地方，所以建议生产环境自定义线程池。还要注意异常处理、设置超时、监控线程池状态等
3.  thenApply和thenApplyAsync的区别：thenApply用的是上一个任务的执行线程，而thenApplyAsync则是把任务扔到线程池，用线程池里的线程执行，如果回调里有耗时操作，可以用Async版本避免阻塞
4.  CompletableFuture里的get和join的区别：都是阻塞拿结果，但抛出的异常类型不同。get抛出的是受检异常（ExecutionException/InterruptedExecption），必须try-catch或者throws；join抛的是非受检异常（CompletionException），所以在Stream的lambda里用join更方便，不用处理受检异常

## 第五部分 | ThreadLocal

### 1. 什么是ThreadLocal
1.  它主要解决线程隔离的问题，让每个线程拥有自己的独立副本，不需要加锁，属于以空间换时间
2.  每一个线程有一个ThreadLocalMap类型的threadLocals字段，这个Map的key是ThreadLocal对象本身，value为你存进去的值。调用threadLocals.get()的时候会先拿到当前线程的ThreadLocalMap，然后将this作为key去查。这样每个线程可以利用同一个对象作为key，去各自的Map里去查

    ```plain
    Thread
     └── ThreadLocalMap
          ├── ThreadLocalA -> valueA
          ├── ThreadLocalB -> valueB
          ├── ThreadLocalC -> valueC
    ```

3.  但使用时需要注意内存泄漏问题，因为ThreadLocalMap的Entry继承了WeakReference，key为弱引用。如果ThreadLocal对象没有强引用了，GC会把key回收，但value还在！这时候Entry就变成了key为null，value还占着内存的脏数据。如果这个线程是线程池里的，时间一长，脏数据不断堆积就造成了内存泄漏。所以在用完后一定要手动remove掉（即使调用get/set方法时也会顺手清理一部分，但最好还是手动remove）
4.  它主要的使用场景有：用户上下文、事务管理、日志追踪等

### 2. ThreadLocal中的key为强引用，value为弱引用，为什么这样设计
1.  对key使用弱引用：主要是为了配合线程池场景下的内存回收。如果key使用强引用，线程池中的部分线程可能存在整个应用的生命周期，如果业务代码不再使用这个ThreadLocal，它也没法被回收，因为线程一直持有它（线程强引用着ThreadLocalMap，ThreadLocalMap强引用着Entry，Entry又强引用着key）。相反，使用弱引用的话，如果栈上对ThreadLocal的强引用没了，Entry对它是弱引用，那么下次GC就能把它回收掉
2.  对value使用强引用：value一般是方法里的局部变量，方法执行完栈桢出栈，局部变量的强引用就没了，这时如果Entry对value是弱引用，GC的时候会把value清除，下次get的时候就找不到了，所以Entry对value要强引用。但这又导致可能会发生内存泄漏的问题，用完后需要手动remove

### 3. ThreadLocalMap为什么使用线性探测法处理哈希冲突，而不是使用链表法
1.  大多数ThreadLocalMap的使用场景下，一个线程里不会有太多ThreadLocal对象；线性探测法相邻元素在内存中是连续的，缓存命中率更高；清理过期Entry时，线性探测法可以顺带把后面的元素往前挪，保持数组紧凑
2.  线性探测法：冲突了就往后找空位，查找时也是从哈希位置往后找、ThreadLocal有个专门的threadLocalHashCode，每次新建ThreadLocal都会原子递增一个固定值，能让哈希分布的更加均匀

### 4. 使用ThreadLocal时需要注意什么
1.  声明为static final，避免每次请求都在线程中new一个ThreadLocal对象，保证一个线程对应一种ThreadLocal实例就够了
2.  使用withInitial设置默认值，防止get的时候拿到null
3.  业务逻辑执行完必须调用remove。例如Tomcat工作线程是复用的，不清理的话下一个请求可能会拿到上一个请求的数据
4.  能用方法参数传递的上下文信息，就不要用ThreadLocal，否则代码难以追踪和调试

    ```java
    private static final ThreadLocal<Integer> USER_CONTEXT = ThreadLocal.withInitial(Integer::new);
    ```

### 5. 什么是InheritableThreadLocal
1.  它是ThreadLocal的子类，可以在创建子线程时把父线程的值拷贝一份给子线程，这是ThreadLocal做不到的
2.  具体流程为：线程里除了threadLocals还有个inheritableThreadLocal类型的ThreadLocalMap，创建子线程时，会检查父线程的inheritableThreadLocal是否有值，有的话拷贝一份放到子线程的inheritableThreadLocal里。这个拷贝只发生在new线程的时候，之后父线程怎么改，子线程都不收影响了（这也就解释了InheritableThreadLocal在线程池场景中基本没用，因为线程一旦创建出来就开始复用了---线程池场景想要拷贝的话可以使用阿里开源的TransmittableThreadLocal）
3.  不适用于线程池场景，但可以用于手动创建子线程处理任务的场景
4.  还有一点，拷贝的时候是浅拷贝（数组、对象拷贝的是引用地址），所以如果value是可变对象，父子线程拿到的是同一个引用，一方修改另一方也会发生变化

## 第六部分 | 并发

### 1. Java中的线程同步是什么
1.  线程同步就是给共享资源加把锁，保证同一时刻只有一个线程能访问它；也可以使用原子操作实现
2.  他主要解决的问题是：防止多个线程同时修改同一个数据，造成数据不一致
3.  Java中常见的同步方式有三种，分别是JVM内置关键字synchronized、JUC提供的ReentrantLock、以及一些并发工具类（CountDownLatch/CyclicBarrier/Semaphore等）

### 2. 介绍一下Java中的并发工具类（CountDownLatch/CyclicBarrier/Semaphore等）
1.  CountDownLatch：允许线程（可以多个）等待其他多个线程完成操作后再进行，本质是一个计数器，构造时指定计数器的值，每次调用countDown()都会使计数器的值-1，直到变为0时唤醒主线程（全部等待的线程）继续执行
2.  CyclicBarrier：循环屏障，一组线程相互等待，直到所有线程都到达屏障点后再继续执行。本质也是一个计数器，每个线程到达屏障await()时-1，直到为0统一放行。他与CountDownLatch的主要区别是一轮结束后屏障会自动重置，开启下一轮【基于ReentrantLock+Condition，不是AQS】
3.  Semaphore：信号量，本质也是一个计数器，在构造时可以指明许可的数量，当线程调用acquire()时，如果当前计数器值大于1，则计数器-1；如果等于0，会阻塞等待。线程结束后调用release()，计数器+1。可在构造时设置是否公平获取锁

### 3. AQS是什么
1.  AbstractQueuedSynchronizer，是JUC包里同步和锁的基础框架，ReentrantLock、CountDownLatch、Semaphore都是基于他实现的。它主要包含两大部分，一个是volatile int 类型的 state 变量，另一个就是双向链表实现的FIFO队列
2.  AQS有两种模式，独占模式和共享模式，ReentrantLock就是独占模式，state为0代表没被占用，大于0说明被线程占用中；CountDownLatch、Semaphore则是共享模式，state用来计数
3.  state 具体含义由子类定义，比如在ReentrantLock代表锁被重入了多少次；在CountDownLatch代表剩余的计数；在Semaphore代表剩余多少许可
4.  当线程想要获取资源->CAS改state->成功了就拿到资源，失败了就包装成节点加入队列尾部，然后park挂起等着，直到前面线程unpark释放资源后唤醒队列中的节点
5.  再说说它的那个队列，其实是CLH的变体，CLH是自旋等待其前驱节点释放锁，每个线程只需要关注自己前驱的状态，避免所有线程都CAS同一个变量导致总线风暴；AQS把自旋改成park阻塞，这样长时间等锁不会浪费CPU，但怎样检查自己的前驱节点状态呢？所以改成了双向链表，让前驱主动unpark唤醒后继

### 4. AtomicLong和LongAdder有什么区别
1.  AtomicLong：通过CAS保证原子性，所有线程都抢同一个变量，CAS失败就重试，在高并发场景下，CPU白白空转。
2.  LongAdder：是对AtomicLong写性能的优化，内部维护了一个base值和一个cell数组，不同线程更新不同的cell，最后base+所有cell即可。起初只有一个base，并没有cell数组，当第一次CAS失败后才会创建初始长度为2的数组，扩容时每次×2确保可以使用位运算（按位与）快速定位下标，但最大不超过CPU核心数。
3.  他们两个的主要区别是拿到的值的准确度，AtomicLong可以保证拿到的是实时的值；而LongAdder因为要累加base和多个cell，在累加的期间可能有cell进行了变更，所以拿到的只是近似值，如果想要拿精确值，可以在业务层自己加锁；而且高并发下LongAdder不一定比AtomicLong快，因为AtomicLong直接volatile读一次，而LongAdder需要累加所有cell
4.  综上所述AtomicLong适用于读多写少、低并发、对实时性要求高的场景；而LongAdder更适合于写多读少、高并发、最终一致性的场景

### 5. volatile关键字的作用是什么
1.  保证可见性和禁止指令重排序，但不能保证原子性
2.  可见性：当一个线程修改了被volatile修饰的变量，其他线程立刻就能看到新值（每次读都从主内存拿新值，每次写都会立刻刷回主内存）；但对于数组来说，volatile只能保证数组引用的可见性，对于数组元素的可见性就不管了，如果要保证数组元素的可见性，可以使用AtomicIntegerArray这类原子数组
3.  禁止指令重排：编译器为了优化性能，可能会将指令进行重新排序。volatile通过内存屏障禁止指令重排，在写操作前插StoreStore屏障，写操作后插StoreLoad屏障；在读操作后插LoadStore屏障和LoadLoad屏障，经典场景就是双重检查锁（DCL）单例模式 分配内存->调用构造方法->引用赋值

    1.  StoreStore：保证volatile写之前的普通写，不会被重排到volatile写之后
    2.  StoreLoad：保证volatile写之后的读写，不会被重排到volatile写之前
    3.  LoadStore：保证volatile读之后的普通写，不会被重排到volatile读之前
    4.  LoadLoad：保证volatile读之后的普通读，不会被重排到volatile读之前

### 6. volatile与synchronized的区别
1.  他们之间最大的一个区别就是synchronized可以保证原子性，而volatile不能保证；都能保证可见性
2.  volatile：修饰变量，每次读都会从主内存拿新值，每次写都立刻刷回主内存，不需要加锁，但对于`i++`这种读-改-写的操作，不能保证它的原子性，可能两个线程同时读取到新值，+1后写回去，导致最终少加了一次
3.  synchronized：修饰方法或代码块，进入时加锁，退出时解锁，加锁时会清空工作内存从主内存重新读，解锁时会把修改刷回主内存。但由于加了锁可能会导致线程阻塞，性能开销比volatile大
4.  适用场景：volatile常用于状态标志位、双重检查锁单例模式等状态通知的场景；synchronized常用于计数器、多变量一致性状态修改的场景

## 第七部分 | 其他

### 1. `>>`和`>>>`的区别
1.  `>>`是算数右移，高位补符号位，用于保持数值的正负
2.  `>>>`是逻辑右移，高位统一补0，不关心符号，常用于位运算和哈希计算
3.  对于正数来说，两者效果相同；对于负数来说，两者效果就不同了

### 2. 说一说什么是红黑树
1.  五条规则

    1.  每个节点不是黑色就是红色
    2.  根节点必须是黑色
    3.  所有叶子结点都是黑色（null节点）
    4.  红色节点的子节点必须是黑色（两个红色节点不能挨着）
    5.  从任意节点到他的所有叶子结点，经过的黑色节点数量相同

2.  以上五条规则保证了最长路径不会超过最短路径的2倍，树高<=2log(n+1)
3.  插入时，会将新节点染成红色，如果父节点也是红色，就需要通过变色和旋转来修复
4.  左旋就是把右孩子提上来当父节点，原节点变成他的左孩子；右旋也是同样的道理

### 3. Java中强、软、弱、虚引用分别是什么
1.  强引用：是最常见的引用类型，只要对象通过GC Root可达，就不会被回收，如`Object o = new Object()`
2.  软引用：使用SoftReference包装的引用，在JVM发生内存不足前，进行回收，常用于内存敏感的缓存场景
3.  弱引用：使用WeakReference包装的引用，无论内存是否充足，只要发生GC，就会被回收
4.  虚引用：使用PhantomReference包装的引用，get()永远返回null，主要用于在对象回收前收到通知，配合ReferenceQueue做资源清理

### 4. 什么是as-if-serial、什么是happens-before，它们之间有什么区别
1.  as-if-serial：是单线程语义保证，不管怎么重排，单线程执行结果不变
2.  happens-before：是多线程语义保证，约束了操作之间的可见性和顺序性。如果操作A happens-before 操作B，那么A的执行结果对B一定是可见的，且A的执行顺序在B之前

### 5. 什么是Java中的原子性、可见性、有序性
1.  原子性：一个操作必须执行完，中间不能被打断。（比如`i++`，分为读-改-写三个步骤，多线程环境下可能出现问题---解决方案：锁/CAS）
2.  可见性：一个线程修改了共享变量，其他线程要能看到最新值。（CPU有自己的缓存，当线程修改的值还在缓存里，没有刷回主内存，别的线程就读到了旧值---解决方案：volatile/锁/final[前提是在构造结束前不会被其他线程看到(不发生this逃逸)，否则final可见性的保证就失效了]）
3.  有序性：程序执行顺序要和写的代码顺序一样。（编译器和CPU为了优化性能会对指令做重排序，单线程下没问题，多线程下可能会出bug，比如双重检查锁定场景---解决方案：volatile）