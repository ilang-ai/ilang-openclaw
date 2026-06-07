/**
 * SoulForge — 灵魂打印机
 *
 * 两个按钮：
 *   distill_search  — 输入人名 → 搜索采集 → 蒸馏 → 确认后写soul.md
 *   distill_corpus  — 读Drive文件或粘贴文本 → 蒸馏 → 确认后写soul.md
 *
 * © 2026 iLang Inc., Canada. MIT License.
 */

import { homedir } from "os";
import { writeFileSync, readFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const OPENCLAW_DIR = join(homedir(), ".openclaw");
const SOUL_PATH = join(OPENCLAW_DIR, "soul.md");
const SOUL_BACKUP_PATH = join(OPENCLAW_DIR, "soul.md.bak");
const SAMPLING_LIMIT = 50000;

function sampleCorpus(text: string, limit: number = SAMPLING_LIMIT): string {
  if (text.length <= limit) return text;
  const third = Math.floor(limit / 3);
  const front = text.slice(0, third);
  const midStart = Math.floor(text.length / 2 - third / 2);
  const middle = text.slice(midStart, midStart + third);
  const back = text.slice(-third);
  return `${front}\n\n[...中段采样...]\n\n${middle}\n\n[...后段采样...]\n\n${back}`;
}

function buildDistillPrompt(corpus: string, source: string): string {
  return `你是一台表达指纹蒸馏机。以下是来自"${source}"的写作语料。
请分析这些文字，提取7个维度的写作特征。

语料：
---
${corpus}
---

请严格按以下I-Lang GENE格式输出，不要输出任何其他内容：

::ILANG::v4.0
[TYPE:soul]
[SOURCE:蒸馏自${source}]
[DATE:${new Date().toISOString().split("T")[0]}]

::GENE{opening|style:____}
  分析此人的开头习惯：先上数字？先讲故事？先抛问题？先亮观点？
  用1-2个关键词概括，写在style值里。
  T:用具体描述补充

::GENE{vocabulary|fingerprint:____,____,____|never:____,____}
  fingerprint：此人最高频的10个特征词/口头禅
  never：此人从不使用的表达

::GENE{rhythm|avg_para_lines:____|pattern:____}
  avg_para_lines：平均每段多少行
  pattern：长短段交替模式

::GENE{question|freq:____|style:____}
  freq：每千字大约多少个反问句
  style：反问风格

::GENE{ending|style:____}
  此人的结尾套路

::GENE{tone|style:____}
  整体视角立场

::GENE{audience|profile:____}
  从称呼、假设、用语推断的目标读者画像

只输出上面的I-Lang GENE格式内容。不要解释，不要加前言后语。`;
}

function backupAndWriteSoul(content: string): { success: boolean; backedUp: boolean } {
  try {
    if (!existsSync(OPENCLAW_DIR)) {
      mkdirSync(OPENCLAW_DIR, { recursive: true });
    }
    let backedUp = false;
    if (existsSync(SOUL_PATH)) {
      copyFileSync(SOUL_PATH, SOUL_BACKUP_PATH);
      backedUp = true;
    }
    writeFileSync(SOUL_PATH, content, "utf-8");
    return { success: true, backedUp };
  } catch {
    return { success: false, backedUp: false };
  }
}

export default function register(api: any) {
  api.registerTool("distill_corpus", {
    description: "语料模式：从Drive读文件或用户粘贴文本，蒸馏写作风格。蒸馏完成后展示结果并请求用户确认，确认后写入soul.md（自动备份旧版本）。",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "用户粘贴的文本内容。如果用户提到Drive文件，先用Drive工具读取内容再传入此参数。",
        },
        source: {
          type: "string",
          description: "语料来源描述（文件名或人名）",
        },
        confirmed: {
          type: "boolean",
          description: "用户是否已确认写入soul.md。首次调用传false，展示预览；用户确认后传true执行写入。",
          default: false,
        },
      },
      required: ["text", "source"],
    },
    execute: async (params: { text: string; source: string; confirmed?: boolean }) => {
      const { text, source, confirmed } = params;

      if (!text || text.trim().length < 500) {
        return "语料太短（不足500字），无法蒸馏出可靠的写作风格。请提供更多内容。";
      }

      const sampled = sampleCorpus(text);

      // 隐私声明
      const privacyNotice = `【数据说明】你提供的语料将发送给AI模型进行风格分析。分析过程中：
• 语料仅用于本次蒸馏，不会被存储到任何外部服务器
• 蒸馏结果（soul.md）仅保存在你本机 ~/.openclaw/ 目录
• 如果你的语料包含敏感信息，建议先脱敏后再投喂`;

      const prompt = buildDistillPrompt(sampled, source);

      try {
        const result = await api.llm.complete({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        const soulContent = result?.content || result?.text || "";

        if (!soulContent.includes("::ILANG::v4.0")) {
          return "蒸馏失败：输出格式不符合预期。请重试。";
        }

        if (!confirmed) {
          return `${privacyNotice}

【蒸馏预览】以下是从「${source}」提取的写作风格：

${soulContent}

确认使用这个风格吗？确认后将：
• 备份当前soul.md为soul.md.bak
• 写入新的soul.md

回复"确认"执行写入。`;
        }

        const { success, backedUp } = backupAndWriteSoul(soulContent);

        if (success) {
          const backupMsg = backedUp ? "（旧版本已备份为soul.md.bak）" : "";
          return `你的写作风格已经跟${source}一致，随时可以再次替换为其他风格。${backupMsg}`;
        } else {
          return `蒸馏完成，但写入soul.md失败。以下是你的IP人设卡，请手动保存：\n\n${soulContent}`;
        }
      } catch (err) {
        return `蒸馏过程出错：${err}。请重试。`;
      }
    },
  });

  api.registerTool("distill_search", {
    description: "搜索模式：输入人名，引导用户用搜索skill采集资料后蒸馏写作风格。蒸馏完成后展示结果并请求用户确认，确认后写入soul.md（自动备份旧版本）。",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "要蒸馏的人物名称",
        },
      },
      required: ["name"],
    },
    execute: async (params: { name: string }) => {
      const { name } = params;

      return `准备蒸馏「${name}」的写作风格。

请先用搜索工具采集以下内容：
1. 此人的公开文章、博客、长文（至少10篇）
2. 此人的社交媒体发言（微博/X/即刻等）
3. 此人的演讲或访谈文字稿（如有）

采集完成后，把所有文本内容汇总，然后调用 distill_corpus 工具进行蒸馏。

【数据说明】采集到的文本将发送给AI模型进行风格分析，仅用于本次蒸馏，不会存储到外部服务器。蒸馏结果保存在你本机。

提示：
• 如果你安装了 web-article-reader、agent-reach 等搜索类skill，可以直接使用
• 如果没有搜索类skill，请先安装一个
• 采集的内容越多越好，至少需要5000字以上`;
    },
  });
}
