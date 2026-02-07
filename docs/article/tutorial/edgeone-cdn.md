# EdgeOne 免费 CDN

<img src="https://img.shields.io/badge/-GitHub Page-8A2E2" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-Cdn-8A2BE2" alt="" style="display: inline-block;margin-right: 2px"/> 


## 1. 获取资格
<Linkcard url="https://cloud.tencent.com/act/pro/eo-freeplan?ad_trace=2d44293a92a343a0a0dd7c335813f387&from=28454&from_column=28454" title="申请地址" description="https://cloud.tencent.com/" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202508181539171.png"></Linkcard>

![image-1.png](../public/article/image%20%281%29.png)

## 2. 登录控制台，新增站点

![image.png](../public/article/image.png)

## 3. 选择以域名方式接入，输入自己的域名，点击开始接入

![image-2.png](../public/article/image%20%282%29.png)

## 4. 选择绑定至已有套餐
（这里我的免费套餐已经使用过了，你的界面会有个套餐，点击即可）

![image-3.png](../public/article/image%20%283%29.png)

## 5. 选择加速区域与接入方式
（如果你的域名未备案，选择不含中国大陆区域即可）

![image-4.png](../public/article/image%20%284%29.png)

## 6. 接下来会进行域名归属验证
（在你的域名厂商添加一条 txt 记录即可，验证通过后，删除该条记录对后续操作没影响）

![image-5.png](../public/article/image%20%285%29.png)

## 7. 在域名管理界面添加域名，快速添加

![image-6.png](../public/article/image%20%286%29.png)

## 8. 添加加速域名与源站配置
- 加速域名（你要加速的域名，如 `www.wanyj.cn`）
- 源站配置（github page 给你的那个直接访问的地址，如 `userwanyong.github.io`）

![image-7.png](../public/article/image%20%287%29.png)

## 9. 之后会给你一个 CNAME 的记录值，在你的域名 DNS 解析中添加对应的 CNAME 记录即可

![image-8.png](../public/article/image%20%288%29.png)

## 10. 如果你之前在域名解析下添加过相应的 CNAME 直接停用即可

![image-9.png](../public/article/image%20%289%29.png)

## 11. 开启 https

![image-10.png](../public/article/image%20%2810%29.png)

选择申请免费证书，点击确认

![image-11.png](../public/article/image%20%2811%29.png)

等待几分钟，你的网站即可用 https 协议访问了

## 12. 总结

整体跟上一节 [Github Page 自定义域名](https://www.wanyj.cn/article/github-page) 最终效果一样，但是接入了 CDN 加速，你就可以把图片直接放到 github 仓库中了（图片加载速度已经不受影响了），不需要再使用云存储，降低了存储成本

