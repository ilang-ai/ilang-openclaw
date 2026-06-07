/**
 * SoulForge — 灵魂打印机 v4.0
 *
 * 架构重写：plugin不碰LLM。
 * 三个工具各司其职：
 *   distill_search → 返回搜索任务prompt
 *   distill_corpus → 返回蒸馏prompt（agent用自己的模型跑）
 *   soulforge_write → 接收SOUL内容，预览+确认+备份+写文件
 *
 * © 2026 iLang Inc., Canada. MIT License.
 */

import { homedir } from "os";
import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

function resolveSoulPath(api: any): string {
  try {
    if (api?.runtime?.agent?.resolveAgentWorkspaceDir) {
      return join(api.runtime.agent.resolveAgentWorkspaceDir(api.config), "SOUL.md");
    }
  } catch { /* fallback */ }
  const wsPath = join(homedir(), ".openclaw", "workspace", "SOUL.md");
  if (existsSync(join(homedir(), ".openclaw", "workspace"))) return wsPath;
  return join(homedir(), ".openclaw", "SOUL.md");
}

function backupAndWrite(soulPath: string, content: string): { success: boolean; backedUp: boolean; backupPath: string; error: string } {
  try {
    const dir = dirname(soulPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    let backedUp = false;
    let backupPath = "";
    if (existsSync(soulPath)) {
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      backupPath = `${soulPath}.bak.${ts}`;
      copyFileSync(soulPath, backupPath);
      backedUp = true;
    }
    writeFileSync(soulPath, content, "utf-8");
    return { success: true, backedUp, backupPath, error: "" };
  } catch (err) {
    return { success: false, backedUp: false, backupPath: "", error: String(err) };
  }
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function log(api: any, level: string, msg: string) {
  const fn = api?.logger?.[level] || api?.logger?.info || console.log;
  fn(`[SoulForge] ${msg}`);
}

export default function register(api: any) {
  log(api, "info", "SoulForge loaded. Architecture: zero LLM calls in plugin.");

  // ========== 工具1：搜索任务 ==========
  api.registerTool({
    name: "soulforge_distill_search",
    description: "搜索蒸馏模式：输入人名，返回两阶段采集任务。你（agent）执行采集后，把传记和语料传给 soulforge_distill_corpus 获取蒸馏prompt。",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "要蒸馏的人物名称" },
      },
      required: ["name"],
    },
    execute: async (_toolCallId: string, params: { name: string }) => {
      const { name } = params;
      log(api, "info", `Search task for "${name}"`);

      return textResult(`【SoulForge 三步法蒸馏任务】

目标人物：${name}

【使用声明】采集内容仅用于分析写作风格特征，不复制不存储不再发布原文。

请你（agent）分两阶段采集，然后调用蒸馏工具。

**阶段一：传记事实采集（百科优先）**

第1轮搜索：「${name} 维基百科」—— 提取传记事实（生日、教育、职业、关键事件）
第2轮搜索：「${name} 百度百科」—— 补充传记事实

只提取事实性信息，不需要复制百科全文。整理成一段传记摘要备用。

**阶段二：一手语料采集**

第3轮搜索：「${name} 原文 全文」—— 此人写的文章、书籍片段
第4轮搜索：「${name} 语录 名言」—— 高频表达、口头禅
第5轮搜索：「${name} 演讲 访谈」—— 对话、问答

优先采集此人主动公开发表的内容。

**阶段三：调用蒸馏**

采集完成后，调用 soulforge_distill_corpus：
  text: 阶段二的语料
  source: "${name}"
  bio: 阶段一的传记摘要

目标：语料至少5000字，传记摘要至少500字。`);
    },
  });

  // ========== 工具2：生成蒸馏prompt（不调LLM） ==========
  api.registerTool({
    name: "soulforge_distill_corpus",
    description: "生成三步法蒸馏prompt：接收语料和传记信息，返回蒸馏prompt。你（agent）用你当前的模型执行这个prompt，拿到SOUL内容后调用 soulforge_write 写入。本工具不调用LLM，只生成prompt。",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string", description: "文本语料内容" },
        source: { type: "string", description: "语料来源（人名）" },
        bio: { type: "string", description: "可选。从百科采集的传记摘要。" },
      },
      required: ["text", "source"],
    },
    execute: async (_toolCallId: string, params: { text: string; source: string; bio?: string }) => {
      const { text, source, bio } = params;

      if (!text || text.trim().length < 500) {
        return textResult("语料太短（不足500字），请提供更多内容。");
      }

      log(api, "info", `Generating distill prompt for "${source}", ${text.length} chars corpus, ${bio?.length || 0} chars bio`);

      const today = new Date().toISOString().split("T")[0];

      // 采样：超长语料取前中后各一段
      let corpus = text;
      const limit = api?.pluginConfig?.samplingSize || 50000;
      if (corpus.length > limit) {
        const third = Math.floor(limit / 3);
        const front = corpus.slice(0, third);
        const midStart = Math.floor(corpus.length / 2 - third / 2);
        const middle = corpus.slice(midStart, midStart + third);
        const back = corpus.slice(-third);
        corpus = `${front}\n\n[...中段采样...]\n\n${middle}\n\n[...后段采样...]\n\n${back}`;
      }

      const prompt = `你是一台灵魂蒸馏机。用三步法从语料中提取此人的完整表达DNA。

目标人物：${source}

${bio ? `【传记事实（来自百科）】\n${bio}\n` : ""}
【写作语料】
---
${corpus}
---

请严格按三步法执行：

**第一步：观察（列出所有事实，不判断）**

A. 传记事实（如果上方提供了百科信息）：
   - 生日→星座
   - 出生地→地域文化
   - 家庭背景→阶层
   - 教育经历→知识结构
   - 职业路径→核心领域
   - 关键人生事件→转折点

B. 表达事实（从语料中直接统计）：
   - 开头方式分布
   - 高频词TOP20和从不用的词
   - 平均段落长度和长短段交替模式
   - 反问句频率和风格
   - 结尾方式分布
   - 句式特征

**第二步：推理（事实→假设→用语料验证）**

从传记事实产生性格假设，然后用语料验证：
- 假设被语料验证 → confidence:HIGH
- 假设被语料部分验证 → confidence:MEDIUM
- 假设未被语料验证 → 丢弃，不写入
- 语料中直接观察到的特征 → confidence:HIGH
- 假设有但语料不足以验证 → confidence:LOW

权重：一手语料100% > 行为事实70% > 传记事实30% > 星座推断15%
冲突时语料说了算，推断让路。

**第三步：输出（严格按以下I-Lang GENE格式）**

::ILANG::v4.0
[TYPE:soul]
[SOURCE:蒸馏自${source}]
[DATE:${today}]

[IDENTITY]
  NAME: ${source}
  ZODIAC: （从生日推算，没有传记信息则写"未知"）
  BACKGROUND: （一句话概括此人背景）
  CORE_TRAIT: （经验证的1-3个核心性格特质）

::GENE{opening|style:____|confidence:HIGH/MEDIUM/LOW}
  T: 此人的开头习惯（WHAT）
  WHY: 为什么这样开头
  EVIDENCE: 语料中的具体例子

::GENE{vocabulary|fingerprint:____,____,____|never:____,____|confidence:HIGH/MEDIUM/LOW}
  T: 高频特征词和从不用的词
  WHY: 用词习惯的成因
  EVIDENCE: 具体出现的语料片段

::GENE{rhythm|avg_para_lines:____|pattern:____|confidence:HIGH/MEDIUM/LOW}
  T: 段落节奏特征
  WHY: 节奏习惯的成因
  EVIDENCE: 语料中的典型段落

::GENE{question|freq:____|style:____|confidence:HIGH/MEDIUM/LOW}
  T: 反问句使用特征
  WHY: 反问风格的成因
  EVIDENCE: 具体反问句例子

::GENE{ending|style:____|confidence:HIGH/MEDIUM/LOW}
  T: 结尾习惯
  WHY: 结尾风格的成因
  EVIDENCE: 语料中的结尾例子

::GENE{tone|style:____|confidence:HIGH/MEDIUM/LOW}
  T: 整体视角立场
  WHY: 为什么形成这种立场
  EVIDENCE: 体现立场的语料片段

::GENE{audience|profile:____|confidence:HIGH/MEDIUM/LOW}
  T: 目标读者画像
  WHY: 从称呼和用语推断
  EVIDENCE: 语料中指向读者的表达

[META]
  FACTS_USED: 使用了多少条传记事实
  HYPOTHESES_TESTED: 测试了多少条假设
  HYPOTHESES_VERIFIED: 验证通过了多少条
  CONFIDENCE_DISTRIBUTION: HIGH:X / MEDIUM:X / LOW:X

只输出上面的I-Lang格式内容。每个GENE的WHY和EVIDENCE尽量填写。`;

      return textResult(`【蒸馏prompt已生成】

请你（agent）直接执行以下prompt，用你当前的模型跑蒸馏分析。

执行完成后，把输出的I-Lang GENE内容传给 soulforge_write 工具：
  content: 蒸馏输出的完整SOUL内容
  source: "${source}"

---

${prompt}`);
    },
  });

  // ========== 工具3：预览+确认+写文件（不调LLM） ==========
  api.registerTool({
    name: "soulforge_write",
    description: "写入SOUL.md：接收蒸馏完成的SOUL内容，展示预览，用户确认后备份旧文件并写入。本工具不调用LLM。",
    parameters: {
      type: "object",
      properties: {
        content: { type: "string", description: "蒸馏输出的完整SOUL内容（I-Lang GENE格式）" },
        source: { type: "string", description: "语料来源（人名）" },
        confirmed: { type: "boolean", description: "false=预览，true=确认写入" },
      },
      required: ["content", "source"],
    },
    execute: async (_toolCallId: string, params: { content: string; source: string; confirmed?: boolean }) => {
      const { content, source, confirmed } = params;

      if (!content || !content.trim()) {
        return textResult("SOUL内容为空，无法写入。请检查蒸馏是否成功。");
      }

      const soulPath = resolveSoulPath(api);

      if (!confirmed) {
        log(api, "info", `Preview SOUL for "${source}", ${content.length} chars`);

        return textResult(`【蒸馏预览】从「${source}」用三步法提取的表达DNA：

${content}

【写入信息】
• 目标：${soulPath}
• 备份：SOUL.md.bak.{时间戳}

确认使用这个风格吗？确认后调用 soulforge_write(content, source, confirmed=true) 写入。`);
      }

      // 确认写入
      log(api, "info", `Writing SOUL for "${source}" to ${soulPath}`);
      const { success, backedUp, backupPath, error } = backupAndWrite(soulPath, content);

      if (success) {
        const bMsg = backedUp ? `\n旧版本备份：${backupPath}` : "";
        return textResult(`你的写作风格已经跟${source}一致，随时可以再次替换为其他风格。${bMsg}\n写入：${soulPath}`);
      }

      return textResult(`写入失败：${error}\n\n请手动保存到 ${soulPath}：\n\n${content}`);
    },
  });
}
