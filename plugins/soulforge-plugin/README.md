# SoulForge 灵魂打印机

**输入人名或语料，蒸馏写作风格，自动覆盖soul.md。**

你全程不碰终端，不碰配置文件，不需要知道soul.md是什么。

## 安装

```bash
openclaw plugins install clawhub:@adsorgcn/soulforge-plugin
```

## 两个按钮

| 说一句话 | 发生什么 |
|---------|---------|
| "蒸馏XXX" | 搜索模式：引导你用搜索skill采集资料 → 蒸馏 → 风格更新 |
| "用这个语料蒸馏"（粘贴文本或Drive文件）| 语料模式：直接蒸馏 → 风格更新 |

完成后你会看到：

> 你的写作风格已经跟XXX一致，随时可以再次替换为其他风格。

就这样。下次你用任何写作skill，出来的内容就带那个风格。

## 蒸馏什么

从语料中提取7个维度的写作指纹：

| 维度 | 提取什么 |
|------|---------|
| 开头习惯 | 先上数字？先讲故事？先抛问题？ |
| 用词指纹 | 高频词、口头禅、从不用的词 |
| 段落节奏 | 平均段落长度、长短段交替模式 |
| 反问频率 | 每千字多少个反问句、反问风格 |
| 结尾套路 | 回扣标题？金句收？反问收？ |
| 视角立场 | 犀利/温和/调侃/理性/务实 |
| 读者画像 | 目标读者是谁 |

## 语料从哪来

• 咸鱼4元买一个公众号全部文章txt
• 自己写过的文章/朋友圈/笔记
• 任何人的公开文章合集
• 演讲/访谈文字稿

语料越多越准。至少500字才能蒸馏，5000字以上效果最好。

## Drive支持

如果你绑定了Google Drive（通过Composio），可以直接说"蒸馏Drive里那个文件"。没绑也没关系，粘贴文本一样用。

## 输出格式

I-Lang GENE格式，自动写入 `~/.openclaw/soul.md`：

```
::ILANG::v4.0
[TYPE:soul]
[SOURCE:蒸馏自XXX]

::GENE{opening|style:data-first}
::GENE{vocabulary|fingerprint:说白了,搞毛,讲真|never:值得注意的是}
::GENE{rhythm|avg_para_lines:2|pattern:短-短-长-短}
::GENE{question|freq:3|style:犀利质问}
::GENE{ending|style:反问+回扣标题}
::GENE{tone|style:犀利务实}
::GENE{audience|profile:跨境创业者}
```

你不需要看懂这个。其他写作skill会自动读取它。

## 网络与隐私

• Drive访问通过Composio OAuth授权，不存储你的文件
• 语料仅在蒸馏时读取，不上传到任何服务器
• soul.md是本地文件，蒸馏完成后不依赖任何外部服务

## 配合使用

| 产品 | 作用 |
|------|------|
| SoulForge（本插件）| 造灵魂 |
| [WeChat-Awesome](https://clawhub.ai/adsorgcn/WeChat-Awesome) | 用灵魂写公众号爆文 |
| [DeAI](https://clawhub.ai/adsorgcn/DeAI) | 去AI味编辑 |
| [freemoney](https://clawhub.ai/adsorgcn/freemoney) | 理赔追踪 |

## 许可

MIT — © 2026 iLang Inc., Canada
