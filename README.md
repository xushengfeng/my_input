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

标准为 `多余击键/字符数` 接近 0 越好。

多余击键：需要在候选列表寻找，向后看一个就视为一次击键。

提前结束为输入拼音过程**首个**候选已经是目标，则此时不必再继续击键。

这样的计算方式直接表示了输入法的联系能力，与双拼特殊拼音模式等无关。

在同一篇文章的一种模式里，已经启用了用户输入频率记忆。

| 文本（截取百万字） | 单字输入 | 词输入 | 词提前结束 | 句     |
| ------------------ | -------- | ------ | ---------- | ------ |
| 古文观止           | 2.0362   | 1.7069 | 1.7069     | 3.4773 |
| 三体               | 1.2554   | 0.2416 | 0.2416     | 1.6866 |
| 诡秘之主           | 1.3517   | 0.2474 | 0.2474     | 1.4596 |
| 百年孤独           | 1.4448   | 0.3204 | 0.3204     | 1.8367 |
| 申论范文           | 1.4732   | 0.3471 | 0.3471     | 1.0027 |
| 精神现象学         | 0.6632   | 0.1171 | 0.1171     | 1.3159 |

拼音来自`pinyin-pro`库，不启用模糊音。

### 目标

无论以哪个单位打字，首选都是尽可能符合目标的，且效率没有区别。

正确识别同音字，包括`在再`、`的得地`等。

虚词不影响词输入。

减少用户输错对词频的影响。

## 使用

见 test
