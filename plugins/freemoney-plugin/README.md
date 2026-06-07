# 白拿钱 (Free Money) — OpenClaw Plugin

**美国、加拿大、英国、澳洲集体诉讼理赔追踪插件**

安装后直接在OpenClaw里说中文查理赔，不用翻墙不用看英文网站。

## 安装

```bash
openclaw plugins install clawhub:@adsorgcn/freemoney-plugin
```

## 4个工具

| 工具 | 说一句话就行 | 返回什么 |
|------|------------|---------|
| query_claims | "有什么理赔案子" | 全部开放案件列表 |
| query_no_proof | "哪些不需要凭证" | 免凭证案件（声明即可申请） |
| query_new | "今天有新案子吗" | 今日新增案件 |
| query_stats | "理赔统计" | 总数/新增/免凭证/更新时间 |

## 自动推送

开启 `dailyPush` 后，每天早上9点自动检查新案件。有新的就推送，没有就静默。

```json
{
  "dailyPush": true
}
```

## 数据来源

• 数据接口：api.ilang.ai（I-Lang Research维护，每日更新）
• 原始数据：OpenClassActions + TopClassActions + ClaimDepot + 各国官方公告
• 覆盖国家：美国、加拿大、英国、澳洲

## 网络与隐私

• 仅通过GET请求读取 api.ilang.ai 的公开数据
• 不上传任何用户数据
• 不连接任何第三方服务
• 不写入Cookie、不追踪用户行为

## 配合使用

本插件是[白拿钱技能](https://clawhub.ai/adsorgcn/freemoney)的代码版。区别：

| | 技能版 | 插件版（本产品） |
|--|--------|----------------|
| 安装 | 粘贴文本 | `openclaw plugins install` |
| 查询 | 用户主动问 | 用户主动问 |
| 推送 | 不支持 | 每日自动推送 |
| 适合 | 任何AI | OpenClaw用户 |

## 生态

| 产品 | 作用 |
|------|------|
| [freemoney skill](https://clawhub.ai/adsorgcn/freemoney) | 技能版（粘贴即用） |
| [WeChat-Awesome](https://clawhub.ai/adsorgcn/WeChat-Awesome) | 公众号写作助手 |
| [DeAI](https://clawhub.ai/adsorgcn/DeAI) | 去AI味编辑器 |
| [I-Lang协议](https://ilang.ai) | AI通信协议 |

## 许可

MIT — © 2026 iLang Inc., Canada
