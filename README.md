# js 输入法

这是一个使用 js/ts 编写的输入法引擎，可以解析按键序列并返回候选，默认支持拼音输入法。

可以部署为云拼音，也可以作为一些输入法的后端。

## 功能

-   [x] 单字输入
-   [x] 词输入
-   [x] 句子输入
-   [x] 模糊音
-   [ ] 双拼
-   [ ] 双拼混输
-   [ ] 纠错
-   [ ] 预测下一个击键
-   [ ] 声母输入
-   [ ] 与 rime 联动
-   [ ] 多平台前端
-   [ ] 记忆上下文
-   [x] 用户频率学习
-   [ ] 浏览器学习

## 测试

```shell
deno run test/test_file.ts
```

测试击键效率，使用不同领域的文章模拟打字，统计击键数。

标准为 `多余击键/输入分段数` 接近 0 越好

输入分段数：候选框显示出来算一次，比如逐字输入，那分段数为字数，逐词则为词数。

多余击键：需要在候选列表寻找，向后看一个就视为一次击键。

提前结束为输入拼音过程首个候选已经是目标，则此时不必再继续击键。

| 文本（截取百万字） | 单字输入 | 词输入 | 词提前结束 | 句     |
| ------------------ | -------- | ------ | ---------- | ------ |
| 古文观止           | 2.1210   | 2.0336 | 2.0330     | 7.9393 |
| 三体               | 1.2679   | 0.4155 | 0.4150     | 4.7107 |
| 诡秘之主           | 1.3910   | 0.4608 | 0.4607     | 3.1806 |
| 百年孤独           | 1.4502   | 0.5331 | 0.5327     | 4.2725 |
| 申论范文           | 1.5091   | 0.5895 | 0.5895     | 4.1454 |
| 精神现象学         | 0.7674   | 0.2692 | 0.2689     | 6.9428 |

拼音来自`pinyin-pro`库，不启用模糊音。

### 目标

无论以哪个单位打字，首选都是尽可能符合目标的，且效率没有区别。

正确识别同音字，包括`在再`、`的得地`等。

虚词不影响词输入。

减少用户输错对词频的影响。

## 使用

见 test
