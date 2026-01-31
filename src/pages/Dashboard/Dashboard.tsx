import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@ui/card";

export function Dashboard() {
  const totalBalance = 1234.5;
  const dayChange = +2.45;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 p-8">
        <p className="text-slate-500 text-sm font-medium mb-1">Expenses</p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {totalBalance.toLocaleString("zh-Hans-CN", {
            style: "currency",
            currency: "CNY",
          })}
        </h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <ArrowDownRight className="w-3 h-3" />
            {dayChange}%
          </span>
          <span className="text-slate-400 text-xs">vs last 24h</span>
        </div>
      </Card>

      <Card className="md:row-span-2 flex flex-col justify-between">
        交易记录列表
      </Card>

      <Card>分类支出饼图</Card>

      <Card>支出环形进度条</Card>

      <Card className="md:col-span-3">本周/月/年支出柱状图或者折线图</Card>
    </section>
  );
}
