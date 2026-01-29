export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  ledgerId: string;
  date: string;
  remark?: string;
  createdAt: number;
}
