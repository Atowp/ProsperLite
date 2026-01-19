import { Wallet, TrendingUp, ArrowUpRight, PieChart } from "lucide-react"

function App() {
  const totalBalance = 1234.5;
  const dayChange = +2.45;

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-6">
        <nav className="max-w-5xl mx-auto flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="text-white w-5 h-5"/>
            </div>
            <span>ProsperLite</span>
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-slate-50 transition-all">
            Connect Wallet
          </button>
        </nav>

        <main className="max-w-5xl mx-auto">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />

              <div className="relative">
                <p className="text-slate-500 text-sm font-medium mb-1">Total Balance</p>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  {totalBalance.toLocaleString('zh-Hans-CN', { style: 'currency', currency: 'CNY' })}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold">
                    <ArrowUpRight className="w-3 h-3" />
                    {dayChange}%
                  </span>
                  <span className="text-slate-400 text-xs">vs last 24h</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl text-white flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <PieChart className="w-5 h-5 text-slate-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium mb-1">Asset Strategy</h3>
                <p className="text-slate-400 text-xs truncate">Optimizing your portfolioooooooooooooooooooooooo</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default App
