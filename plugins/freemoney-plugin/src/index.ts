/**
 * 白拿钱 (Free Money) — OpenClaw Plugin
 * 
 * US class action settlement tracker.
 * Data source: api.ilang.ai/claims (maintained by I-Lang Research, updated daily)
 * 
 * Tools:
 *   query_claims   — all open settlements
 *   query_no_proof — no-proof-required settlements
 *   query_new      — today's new settlements
 *   query_stats    — tracking statistics
 * 
 * Hooks:
 *   daily_push     — auto-push new settlements at 9am daily
 * 
 * Network: only GET requests to api.ilang.ai, no user data uploaded.
 * 
 * © 2026 iLang Inc., Canada. MIT License.
 */

const API_BASE = "https://api.ilang.ai/claims";

interface Settlement {
  name: string;
  amount: string;
  deadline: string;
  proof_required: boolean;
  claim_url: string;
  category: string;
  source_name: string;
}

interface ApiResponse {
  count: number;
  updated_at: string;
  settlements: Settlement[];
}

interface StatsResponse {
  total: number;
  new_today: number;
  no_proof: number;
  updated_at: string;
}

async function fetchApi(endpoint: string): Promise<any> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function formatSettlement(s: Settlement): string {
  const proof = s.proof_required ? "需要凭证" : "免凭证 ✅";
  return [
    `案件：${s.name}`,
    `金额：${s.amount}`,
    `凭证：${proof}`,
    `类型：${s.category}`,
    `截止：${s.deadline || "见官网"}`,
    `申请：${s.claim_url}`,
  ].join("\n");
}

function formatSettlementList(data: ApiResponse, title: string): string {
  if (data.count === 0) {
    return `${title}\n\n暂无案件。`;
  }

  const items = data.settlements.map(formatSettlement).join("\n\n---\n\n");
  return `${title}（共${data.count}条，更新于${data.updated_at}）\n\n${items}\n\n⚠️ 虚假申请是联邦犯罪。只申请你确实符合条件的案件。`;
}

export default function register(api: any) {
  // Tool: query all open claims
  api.registerTool("query_claims", {
    description: "查询全部开放理赔案件",
    parameters: {},
    execute: async () => {
      const data: ApiResponse = await fetchApi("/api/latest");
      return formatSettlementList(data, "当前开放理赔案件");
    },
  });

  // Tool: query no-proof claims
  api.registerTool("query_no_proof", {
    description: "查询免凭证案件（不需要购物凭证即可申请）",
    parameters: {},
    execute: async () => {
      const data: ApiResponse = await fetchApi("/api/no-proof");
      return formatSettlementList(data, "免凭证理赔案件");
    },
  });

  // Tool: query today's new claims
  api.registerTool("query_new", {
    description: "查询今日新增理赔案件",
    parameters: {},
    execute: async () => {
      const data: ApiResponse = await fetchApi("/api/new");
      if (data.count === 0) {
        return "今天暂无新增理赔案件。发「理赔全部」可查看已有案件。";
      }
      return formatSettlementList(data, "今日新增理赔案件");
    },
  });

  // Tool: query stats
  api.registerTool("query_stats", {
    description: "理赔追踪统计概览",
    parameters: {},
    execute: async () => {
      const data: StatsResponse = await fetchApi("/api/stats");
      return [
        "理赔追踪统计",
        "",
        `总开放案件：${data.total}`,
        `今日新增：${data.new_today}`,
        `免凭证案件：${data.no_proof}`,
        `最后更新：${data.updated_at}`,
        "",
        "数据来源：OpenClassActions + TopClassActions + ClaimDepot",
      ].join("\n");
    },
  });

  // Hook: daily push for new settlements
  api.registerHook("daily_push", {
    event: "cron",
    schedule: "0 9 * * *",
    execute: async (ctx: any) => {
      const data: ApiResponse = await fetchApi("/api/new");
      if (data.count === 0) return; // silent if no new claims

      const today = new Date().toISOString().split("T")[0];
      const items = data.settlements.map(formatSettlement).join("\n\n---\n\n");
      const message = [
        `💰 白拿钱日报 — ${today}`,
        "",
        `今日新增 ${data.count} 条理赔案件：`,
        "",
        items,
        "",
        "数据来源：api.ilang.ai | 问题反馈QQ群：615298",
      ].join("\n");

      await ctx.sendMessage(message);
    },
  });
}
