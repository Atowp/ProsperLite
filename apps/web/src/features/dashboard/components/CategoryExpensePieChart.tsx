import { useStore } from "@/store/useStore";
import { Card } from "@ui/card";
import dayjs from "@/lib/dayjs";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

interface CategoryExpensePieChartProps {
  className?: string;
  /** Filter by current month (default: true) */
  currentMonthOnly?: boolean;
}

interface CategoryExpenseData {
  name: string;
  value: number;
  fill: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: CategoryExpenseData }[];
}

// Define proper label renderer props interface
interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
  value?: number;
}

// Define color palette outside component to avoid recreation
const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
];

// Move CustomTooltip outside component to avoid recreation
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          ¥{data.value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

// Move label renderer outside component with proper types
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if the slice is big enough
  if (percent < 0.05) return null;

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

export function CategoryExpensePieChart({
  className,
  currentMonthOnly = true,
}: CategoryExpensePieChartProps) {
  const { transactions, categories } = useStore();

  // Memoize data calculation to avoid recalculation on every render
  const data: CategoryExpenseData[] = useMemo(() => {
    const now = dayjs();

    // Calculate expenses by category
    const categoryExpenses = categories
      .map((category) => {
        const expenses = transactions
          .filter((tx) => {
            const txDate = dayjs(tx.date);

            // Filter by expense type
            if (tx.type !== "expense") return false;

            // Filter by current month if enabled
            if (currentMonthOnly) {
              return txDate.isSame(now, "month") && txDate.isSame(now, "year");
            }

            return true;
          })
          .filter((tx) => tx.categoryId === category.id)
          .reduce((sum, tx) => sum + tx.amount, 0);

        return {
          name: category.name,
          value: expenses,
          fill: "", // Will be set below
        };
      })
      .filter((item) => item.value > 0); // Remove categories with no expenses

    // Assign colors to each category
    return categoryExpenses.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));
  }, [transactions, categories, currentMonthOnly]);

  const totalExpenses = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return (
    <Card className={className}>
      <div className="flex flex-col items-center p-6 min-h-[350px]">
        {/* Header */}
        <div className="w-full mb-4">
          <h3 className="text-lg font-semibold">Monthly Category</h3>
          {/* <p className="text-sm text-muted-foreground mt-1">
            {currentMonthOnly ? dayjs().format("MMMM YYYY") : "All time"}
          </p> */}
        </div>

        {/* Pie Chart */}
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No expense data yet</p>
          </div>
        ) : (
          <div className="w-full h-[300px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend as custom list below chart */}
            <div className="w-full mt-4 grid grid-cols-2 gap-2">
              {data.map((item, index) => {
                const percentage =
                  totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="flex-1 truncate font-medium">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
