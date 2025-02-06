# js 输入法

这是一个使用 js/ts 编写的输入法引擎，可以解析按键序列并返回候选，默认支持拼音输入法。

可以部署为云拼音，也可以作为一些输入法的后端。

## 功能

-   [x] 单字输入
-   [x] 词输入
-   [ ] 句子输入 部分候选
-   [ ] 模糊音
-   [ ] 双拼
-   [ ] 双拼混输
-   [ ] 纠错
-   [ ] 预测下一个击键
-   [ ] 声母输入
-   [ ] 与 rime 联动
-   [ ] 多平台前端
-   [ ] 语言模型预测
-   [ ] 记忆上下文
-   [ ] 用户频率学习
-   [ ] 浏览器学习

## 测试

```shell
deno run test/test_file.ts
```

测试击键效率，使用不同领域的文章模拟打字，统计击键数。

标准为 `(多余击键-理论击键)/理论击键` 接近 0 越好

理论击键：根据输入法规则，计算输入的字母数量（如`pinyin`为 6，在双拼中`pnyn`为 4），确认（空格）也纳入计算。

多余击键：需要在候选列表寻找，向后看一个就视为一次击键。

提前结束为输入拼音过程首个候选已经是目标，则此时不必再继续击键。

| 文本（截取百万字） | 单字输入 | 词输入 | 词提前结束 |
| ------------------ | -------- | ------ | ---------- |
| 古文观止           | 3.1543   | 3.0838 | 3.0838     |
| 三体               | 1.6863   | 0.8357 | 0.8353     |
| 诡秘之主           | 1.6656   | 0.8096 | 0.8095     |
| 百年孤独           | 1.6403   | 0.9069 | 0.9065     |
| 申论范文           | 2.1621   | 0.8380 | 0.8380     |
| 精神现象学         | 1.5726   | 0.5949 | 0.5945     |

### 目标

无论以哪个单位打字，首选都是尽可能符合目标的，且效率没有区别。

正确识别同音字，包括`在再`、`的得地`等。

虚词不影响词输入。

减少用户输错对词频的影响。

## 使用

见 test
