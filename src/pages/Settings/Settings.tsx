import { CategoryList } from "@/features/categories";
import { LedgerList } from "@/features/ledgers";

export function Settings() {
  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-6">
        Settings
      </h1>
      <div className="space-y-8">
        <CategoryList />
        <LedgerList />
      </div>
    </div>
  );
}
