# ProsperLite 面试项目深度复盘

> "我在这个项目中做了什么？遇到了什么问题？如何解决的？"

---

## 目录

1. [项目介绍 - 3分钟版本](#1-项目介绍---3分钟版本)
2. [核心技术挑战与解决方案](#2-核心技术挑战与解决方案)
3. [Zustand 复杂状态管理实战](#3-zustand-复杂状态管理实战)
4. [React Hooks 深度解析](#4-react-hooks-深度解析)
5. [面试问题回答模板](#5-面试问题回答模板)
6. [技术深度问题](#6-技术深度问题)
7. [项目亮点与总结](#7-项目亮点与总结)

---

## 1. 项目介绍 - 3分钟版本

### 1.1 项目背景（30秒）

"我独立开发了一个个人财富管理应用 **ProsperLite**。这个项目的初衷是因为我发现在市面上的记账软件要么太复杂，要么数据不透明，所以我想要一个轻量级、数据完全由自己掌控的解决方案。"

### 1.2 核心功能（1分钟）

"目前项目实现了四大核心功能：

1. **交易记录管理** - 支持收支记录的增删改查，带分页和日期筛选
2. **数据可视化** - 用 Recharts 展示收支趋势和分类统计
3. **多账本管理** - 可以管理多个账户（比如支付宝、微信、银行卡）
4. **数据持久化** - 使用 LocalStorage 存储，支持数据导出导入

整个应用现在运行在纯前端，但我已经预留了后端架构（NestJS + Prisma），可以随时迁移到真实后端。"

### 1.3 技术栈（30秒）

```
前端: React 19 + TypeScript 5 + React Router v7
状态: Zustand + Immer + Persist
样式: Tailwind CSS v4 + Shadcn/UI + Radix UI
验证: React Hook Form + Zod
构建: Vite + Pnpm Monorepo
可视化: Recharts
```

### 1.4 项目亮点（30秒）

"这个项目虽然规模不大，但我在里面实践了很多工程化的最佳实践：

1. **Monorepo 架构** - 使用 pnpm workspace 管理多包
2. **类型安全** - TypeScript strict mode + Zod 运行时验证
3. **模块化状态管理** - Zustand Slice 模式实现功能解耦
4. **数据迁移策略** - 设计了版本化的状态迁移机制
5. **金额精度处理** - 使用'分'作为存储单位避免浮点数问题

特别是状态管理部分，我实现了一套跨模块的副作用协调机制，让我印象深刻。"

---

## 2. 核心技术挑战与解决方案

### 2.1 挑战一：复杂的状态关联问题

**问题场景：**

"在开发过程中，我遇到了一个典型的状态同步问题：当用户**修改或删除一笔交易**时，关联的**账户余额**也需要同步更新。这看起来简单，但在代码组织上有很多坑。"

**我的解决方案：**

```typescript
// 文件位置: features/transactions/store/transactionSlice.ts

// 1. 首先定义交易对余额的影响
const calculateImpact = (transaction: Transaction) =>
  transaction.type === "income" ? transaction.amount : -transaction.amount

// 2. 设计副作用协调函数
const syncBalanceEffect = (oldTx: Transaction | null, newTx: Transaction | null) => {
  // 先扣除旧交易的影响
  if (oldTx) get().adjustBalance(oldTx.ledgerId, -calculateImpact(oldTx))
  // 再添加新交易的影响
  if (newTx) get().adjustBalance(newTx.ledgerId, calculateImpact(newTx))
}

// 3. 在每个交易操作中调用
addTransaction: (transaction) => {
  const newTx = { ...transaction, id: nanoid(), createdAt: Date.now() }
  set((state) => {
    state.transactions.unshift(newTx)
  })
  syncBalanceEffect(null, newTx) // 新增交易
}

updateTransaction: (id, updates) => {
  const oldTx = get().transactions.find(t => t.id === id)
  const newTx = { ...oldTx, ...updates }
  set((state) => {
    const index = state.transactions.findIndex(t => t.id === id)
    state.transactions[index] = newTx
  })
  syncBalanceEffect(oldTx, newTx) // 更新交易
}

deleteTransaction: (id) => {
  const oldTx = get().transactions.find(t => t.id === id)
  set((state) => {
    state.transactions = state.transactions.filter(t => t.id !== id)
  })
  syncBalanceEffect(oldTx, null) // 删除交易
}
```

**面试回答要点：**

> "这里我用了**副作用协调模式**。核心思想是：状态变更的副作用应该和数据变更放在一起维护，而不是散落在各个组件里。这样有两个好处：
>
> 1. **单一数据源** - 所有余额计算逻辑都在一个地方
> 2. **易于测试** - 可以单独测试副作用逻辑
>
> 通过 `get()` 方法访问全局 store，我实现了跨 Slice 的状态操作。"

### 2.2 挑战二：数据迁移问题

**问题场景：**

"项目在迭代过程中，数据结构会发生变化。比如我在 v2 版本给 Category 加了 `iconKey` 字段，但老用户的数据里没有这个字段。直接读取会报错或者显示异常。"

**我的解决方案：**

```typescript
// 文件位置: store/useStore.ts

// 1. 类型守卫函数 - 确保从 LocalStorage 读取的数据安全
function isValidCategory(value: unknown): value is Record<string, unknown> & {
  id?: string
  name?: string
  iconKey?: string
} {
  return (
    isValidObject(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string"
  )
}

// 2. 迁移函数
function migrateState(persistedState: unknown, version: number): StoreState {
  // Version 0-1 → Version 2: 添加 iconKey
  if (version < 2) {
    const categories = persistedState.categories
    if (isValidArray(categories)) {
      persistedState.categories = categories.map((cat) => {
        if (isValidCategory(cat)) {
          return {
            ...cat,
            iconKey: cat.iconKey || "smile" // 默认值
          }
        }
        return cat
      })
    }
  }

  // Version 2 → Version 3: 添加 monthlyLimit
  if (typeof persistedState.monthlyLimit !== "number") {
    persistedState.monthlyLimit = 5000
  }

  // Version 3 → Version 4: 分页状态不再持久化
  // (版本 4 开始，分页状态会在每次页面加载时重置)

  return persistedState as StoreState
}

// 3. 在 persist 配置中使用
export const useStore = create<StoreState>()(
  immer(
    persist(
      (...r) => ({
        ...createTransactionSlice(...r),
        ...createCategorySlice(...r),
        ...createLedgerSlice(...r),
      }),
      {
        name: "prosperlite-storage",
        version: 4, // 每次数据结构变更都要递增
        migrate: migrateState,
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error("Store rehydration error:", error)
            } else if (state) {
              console.log("Store rehydrated, version:", state._persist.version)
            }
          }
        }
      }
    )
  )
)
```

**面试回答要点：**

> "我设计了一个**版本化的状态迁移系统**。核心思路是：
>
> 1. 每次数据结构变更时，递增 `version` 号
> 2. 在 `migrate` 函数中判断版本号，执行对应的迁移逻辑
> 3. 使用 `unknown` 类型 + 类型守卫，确保类型安全
>
> 这样无论用户使用哪个版本的代码，数据都能正确迁移到最新版本。"

### 2.3 挑战三：金额精度问题

**问题场景：**

"在处理金额时，我遇到了 JavaScript 经典的浮点数精度问题："

```javascript
// 用户的实际体验
0.1 + 0.2 = 0.30000000000000004  // ❌ 出现了精度误差
```

**我的解决方案：**

```typescript
// 1. 存储层：统一使用"分"作为单位
interface Transaction {
  amount: number  // 单位：分，不是元
  // ...其他字段
}

// 2. UI 层：显示时除以 100
const formatAmount = (amountInFen: number): string => {
  return (amountInFen / 100).toFixed(2)
}

// 3. 输入层：表单提交时乘以 100
const onSubmit = (data: TransactionInput) => {
  const transaction = {
    ...data,
    amount: Math.round(data.amount * 100) // 元转分
  }
  useStore.getState().addTransaction(transaction)
}
```

**面试回答要点：**

> "金融类应用对精度要求极高，我采用了**整数存储方案**：
>
> 1. 所有金额在 Store 中都以'分'为单位存储
> 2. UI 层显示时除以 100
> 3. 用户输入时乘以 100
> 4. 使用 `Math.round()` 避免浮点数乘法产生的误差
>
> 这样从根源上避免了浮点数精度问题。"

---

## 3. Zustand 复杂状态管理实战

### 3.1 为什么选择 Zustand？

**面试回答模板：**

> "在选择状态管理方案时，我对比了 Redux Toolkit 和 Zustand：
>
> | 维度 | Zustand | Redux Toolkit |
> |------|---------|---------------|
> | Bundle Size | ~1KB | ~10KB+ |
> | 样板代码 | 几乎没有 | 相对较少 |
> | API 设计 | 更符合 Hooks 思维 | 需要理解 dispatch/action |
> | 学习曲线 | 更平缓 | 相对陡峭 |
>
> 最终我选择了 Zustand，原因是：
>
> 1. **轻量级** - 对于我这种个人项目，1KB 的体积很有吸引力
> 2. **简洁的 API** - 不需要定义 action types、reducers、thunks
> 3. **TypeScript 友好** - 类型推导开箱即用
> 4. **中间件生态** - Immer、Persist 等中间件成熟稳定
>
> 不过我也认识到 Redux 在大型团队、时间旅行调试等方面有优势，所以我的选择是基于项目规模和团队规模的权衡。"

### 3.2 Slice 模式架构

**问题：你是如何组织 Zustand Store 的？**

**面试回答：**

> "我采用了 **Slice 模式** 来组织 Store，把状态按功能模块拆分：
>
> ```
> store/
> ├── useStore.ts              # 主入口，组合所有 Slices
> ├── types.ts                 # 类型定义
> └── features/
>     ├── transactions/
>     │   └── store/
>     │       ├── index.ts
>     │       └── transactionSlice.ts
>     ├── categories/
>     │   └── store/
>     │       ├── index.ts
>     │       └── categorySlice.ts
>     └── ledgers/
>         └── store/
>             ├── index.ts
>             └── ledgerSlice.ts
> ```
>
> 每个 Slice 都是独立的，有自己的状态和操作方法。然后在主 Store 中组合：
>
> ```typescript
> // store/useStore.ts
> export const useStore = create<StoreState>()(
>   subscribeWithSelector(
>     immer(
>       persist(
>         (...args) => ({
>           ...createTransactionSlice(...args),
>           ...createCategorySlice(...args),
>           ...createLedgerSlice(...args),
>         }),
>         // ...persist 配置
>       )
>     )
>   )
> )
> ```
>
> **这种架构的好处：**
>
> 1. **模块化** - 每个 Slice 可以独立维护和测试
> 2. **可扩展性** - 新增功能只需添加新 Slice
> 3. **团队协作** - 不同开发人员可以并行开发不同的 Slice
> 4. **代码分割** - 配合懒加载，按需加载相关状态"

### 3.3 中间件链的配置与原理

**问题：你是如何配置 Zustand 中间件的？每个中间件的作用是什么？**

**面试回答：**

> "我使用了三层中间件，从内到外分别是：
>
> ```typescript
> export const useStore = create<StoreState>()(
>   subscribeWithSelector(           // 最外层
>     immer(                          // 中间层
>       persist(                      // 最内层
>         (...args) => ({ ...slices }),
>         persistConfig
>      ),
>      immerConfig
>   ),
>   selectorConfig
> )
> ```
>
> **1. persist 中间件** - 数据持久化
> - 把状态自动同步到 LocalStorage
> - 支持版本迁移（前面讲的 migrate 函数）
> - 可以配置 `partialize` 选择性持久化部分状态
>
> ```typescript
> persist(
>   (set, get) => ({ ... }),
>   {
>     name: "prosperlite-storage",
>     partialize: (state) => ({
>       transactions: state.transactions,
>       categories: state.categories,
>       // 分页状态不持久化，每次刷新重置
>       // currentPage: state.currentPage  ❌
>     })
>   }
> )
> ```
>
> **2. immer 中间件** - 不可变更新简化
> - 允许我直接修改 state，Immer 会自动生成不可变对象
> - 底层使用 ES6 Proxy 实现
>
> ```typescript
> // 没有 Immer：需要手动展开
> set((state) => ({
>   transactions: [newTx, ...state.transactions]
> }))
>
> // 有 Immer：直接修改
> set((state) => {
>   state.transactions.unshift(newTx)  // ✅ Immer 处理不可变性
> })
> ```
>
> **3. subscribeWithSelector 中间件** - 精确订阅
> - 允许监听状态的特定字段变化
> - 比如只在 transactions 变化时执行某些逻辑
>
> ```typescript
> useStore.subscribe(
>   (state) => state.transactions,  // 只监听 transactions
>   (transactions) => {
>     console.log('Transactions updated:', transactions.length)
>   }
> )
> ```
>
> **中间件顺序很重要** - persist 最内层是因为它需要在状态更新前就拦截，immer 在中间是因为要处理状态更新后的不可变性。"

### 3.4 跨 Slice 状态操作

**问题：不同 Slice 之间如何交互？**

**面试回答：**

> "在我的项目中，Transaction 和 Ledger 是两个 Slice，但它们有关联：
>
> - 当添加/修改/删除交易时，需要同步更新账户余额
> - 这是一个跨 Slice 的状态操作
>
> 我的解决方案是使用 **`get()` 方法访问全局状态**：
>
> ```typescript
> // transactionSlice.ts
> export const createTransactionSlice: StateCreator<StoreState, ..., [], TransactionSlice> = (set, get) => ({
>   transactions: [],
>
>   addTransaction: (transaction) => {
>     const newTx = { ...transaction, id: nanoid() }
>     set((state) => {
>       state.transactions.unshift(newTx)
>     })
>
>     // 通过 get() 访问其他 Slice 的方法
>     get().adjustBalance(newTx.ledgerId, calculateImpact(newTx))
>   }
> })
> ```
>
> **为什么这样做：**
>
> 1. **保持独立性** - Slices 之间不需要直接引用
> 2. **类型安全** - TypeScript 能推导出 `get()` 返回的类型是 `StoreState`
> 3. **易于测试** - 可以 mock `get()` 来测试副作用
>
> **需要注意的问题：**
>
> 如果两个 Slice 相互调用，可能会产生循环依赖。我的解决方案是：
> - 明确调用方向：Transaction → Ledger（单向）
> - 如果需要双向调用，考虑把共享逻辑提取到第三个 Slice"

### 3.5 状态选择与性能优化

**问题：你是如何优化 Zustand 的渲染性能的？**

**面试回答：**

> "Zustand 的性能优化核心是**精确选择状态**，避免不必要的重渲染。
>
> **常见的性能问题：**
>
> ```typescript
> // ❌ 每次状态变化都会重渲染
> function Component() {
>   const transactions = useStore((state) => state.transactions)
>   // 即使 transactions 没变，其他状态变了也会重渲染
> }
> ```
>
> **优化方案 1：使用 shallow 比较**
>
> ```typescript
> import { shallow } from 'zustand/shallow'
>
> // ✅ 只有 transactions 数组引用变了才重渲染
> const transactions = useStore(
>   (state) => state.transactions,
>   shallow
> )
> ```
>
> **优化方案 2：选择特定的状态字段**
>
> ```typescript
> // ✅ 只监听需要的字段
> const totalExpense = useStore((state) =>
>   state.transactions
>     .filter(t => t.type === 'expense')
>     .reduce((sum, t) => sum + t.amount, 0)
> )
> ```
>
> **优化方案 3：使用 selector 函数**
>
> ```typescript
> // ✅ 把选择逻辑提取成函数，可以复用和测试
> const selectTotalExpense = (state: StoreState) =>
>   state.transactions
>     .filter(t => t.type === 'expense')
>     .reduce((sum, t) => sum + t.amount, 0)
>
> function Component() {
>   const totalExpense = useStore(selectTotalExpense)
> }
> ```
>
> **我的项目中实际应用：**
>
> 在交易列表组件中，我使用了分页 + 选择器组合：
>
> ```typescript
> // 只选择当前页的数据
> const currentPageTransactions = useStore((state) => {
>   const start = (state.currentPage - 1) * state.itemsPerPage
>   const end = start + state.itemsPerPage
>   return state.transactions.slice(start, end)
> })
> ```
>
> 这样即使有上千条交易记录，组件也只会处理当前页的 10 条数据。"

---

## 4. React Hooks 深度解析

> "React Hooks 是 React 16.8 引入的特性，彻底改变了我们写 React 组件的方式。我的项目中大量使用了 Hooks，让我积累了不少实践经验。"

### 4.1 Hooks 核心概念

**Q: 为什么需要 Hooks？它解决了什么问题？**

> "Hooks 主要解决了三个问题：
>
> **1. 组件逻辑复用困难**
> ```typescript
> // 之前：HOC 和 Render Props
> withAuth(withTheme(DataFetcher)))
>
> // 之后：Hooks 组合
> const data = useData() + useAuth() + useTheme()
> ```
>
> **2. 复杂组件难以理解**
> - class 组件的 lifecycle 方法分散了相关逻辑
> - Hooks 让相关逻辑聚集在一起
>
> **3. class 组件的 this 指向问题**
> - 不需要绑定 `this`
> - 更容易进行代码优化和压缩
>
> 在我的项目中，我用 Hooks 封装了复用的业务逻辑，比如分页逻辑、日期筛选逻辑等。"

### 4.2 最容易滥用的 Hook：useEffect

**Q: 你觉得最容易滥用的 Hook 是什么？**

> "**useEffect 绝对是最容易被滥用的 Hook**。我在项目中见到过很多误用：
>
> **误用 1：把 useEffect 当作「mounted」使用**
> ```typescript
> // ❌ 错误：依赖项为空但实际使用了外部变量
> function Component({ id }) {
>   const [data, setData] = useState(null)
>
>   useEffect(() => {
>     fetch(`/api/${id}`).then(setData)  // 使用了 id 但没有声明
>   }, [])  // ❌ 依赖数组为空
> }
>
> // ✅ 正确：声明所有依赖
> useEffect(() => {
>   fetch(`/api/${id}`).then(setData)
> }, [id])  // ✅ 声明依赖
> ```
>
> **误用 2：过度使用 useEffect**
> ```typescript
> // ❌ 不必要的 useEffect
> const [count, setCount] = useState(0)
> const [doubled, setDoubled] = useState(0)
>
> useEffect(() => {
>   setDoubled(count * 2)
> }, [count])
>
> // ✅ 直接计算
> const doubled = count * 2
> ```
>
> **误用 3：在 useEffect 中更新状态导致无限循环**
> ```typescript
> // ❌ 无限循环
> useEffect(() => {
>   setCount(count + 1)
> }, [count])  // count 变化触发 effect，effect 又更新 count
>
> // ✅ 使用函数式更新
> useEffect(() => {
>   setCount(c => c + 1)
> }, [])  // 空依赖数组
> ```
>
> **我的经验法则：**
> 1. 先问自己：这个逻辑真的需要 effect 吗？
> 2. 如果是计算派生状态，直接计算
> 3. 如果是响应事件，用事件处理器
> 4. 只有需要「与外部系统同步」时才用 useEffect"

### 4.3 useEffect 的依赖项陷阱

**Q: useEffect 的依赖项要注意什么？**

> "useEffect 的依赖项是一个**常见陷阱**：
>
> **陷阱 1：依赖函数导致的无限循环**
> ```typescript
> // ❌ 每次 render 都是新函数
> function Component() {
>   const fetchData = async () => {
>     const data = await api.getData()
>     setState(data)
>   }
>
>   useEffect(() => {
>     fetchData()
>   }, [fetchData])  // ❌ fetchData 每次都是新的引用
> }
>
> // ✅ 方案 1：把函数移到 effect 内
> useEffect(() => {
>   const fetchData = async () => {
>     const data = await api.getData()
>     setState(data)
>   }
>   fetchData()
> }, [])
>
> // ✅ 方案 2：使用 useCallback
> const fetchData = useCallback(async () => {
>   const data = await api.getData()
>   setState(data)
> }, [])  // 依赖不变，函数引用不变
>
> useEffect(() => {
>   fetchData()
> }, [fetchData])
> ```
>
> **陷阱 2：依赖对象/数组导致的无限循环**
> ```typescript
> // ❌ 对象字面量每次都是新引用
> useEffect(() => {
>   api.search({ keyword: 'test' })
> }, [{ keyword: 'test' }])  // ❌ 每次都是新对象
>
> // ✅ 方案 1：移到组件外
> const SEARCH_PARAMS = { keyword: 'test' }
> useEffect(() => {
>   api.search(SEARCH_PARAMS)
> }, [SEARCH_PARAMS])
>
> // ✅ 方案 2：使用 useMemo
> const params = useMemo(() => ({ keyword: 'test' }), [])
> useEffect(() => {
>   api.search(params)
> }, [params])
>
> // ✅ 方案 3：只依赖真正的值
> useEffect(() => {
>   api.search({ keyword: 'test' })
> }, [])  // 不依赖对象，因为值是固定的
> ```
>
> **陷阱 3：遗漏依赖导致闭包陷阱**
> ```typescript
> // ❌ 依赖项不完整
> function Component() {
>   const [count, setCount] = useState(0)
>
>   useEffect(() => {
>     const timer = setInterval(() => {
>       console.log(count)  // ❌ 永远是 0（闭包陷阱）
>     }, 1000)
>
>     return () => clearInterval(timer)
>   }, [])  // ❌ 缺少 count 依赖
>
>   // ✅ 添加依赖
>   useEffect(() => {
>     const timer = setInterval(() => {
>       console.log(count)
>     }, 1000)
>
>     return () => clearInterval(timer)
>   }, [count])  // ✅ 添加 count
>
>   // ✅ 或者使用 ref（不推荐，但有时必要）
>   const countRef = useRef(count)
>   countRef.current = count
>
>   useEffect(() => {
>     const timer = setInterval(() => {
>       console.log(countRef.current)  // ✅ 总是最新值
>     }, 1000)
>
>     return () => clearInterval(timer)
>   }, [])
> }
> ```
>
> **我的实践：**
> 在项目中，我使用 **ESLint 的 react-hooks 插件**，它会自动检查依赖项是否完整：
> ```json
> {
>   "rules": {
>     "react-hooks/exhaustive-deps": "warn"
>   }
> }
> ```"

### 4.4 useMemo 和 useCallback 的正确使用

**Q: useMemo 和 useCallback 是用来优化性能的吗？什么时候用？**

> "这是一个**常见的误区**：很多人认为 useMemo 和 useCallback 总是能优化性能，其实不一定。
>
> **useMemo 的正确使用场景：**
>
> 1. **昂贵的计算**（真正的性能优化）
> ```typescript
> // ✅ 合理使用：过滤大量数据
> const filteredTransactions = useMemo(() =>
>   transactions.filter(t =>
>     t.date >= startDate && t.date <= endDate
>   ),
>   [transactions, startDate, endDate]
> )
>
> // ❌ 过度使用：简单计算不需要缓存
> const doubled = useMemo(() => count * 2, [count])
> // 直接 const doubled = count * 2 更快
> ```
>
> 2. **保持引用稳定**（防止子组件不必要的重渲染）
> ```typescript
> function Parent() {
>   const [count, setCount] = useState(0)
>
>   // ✅ 稳定 handleClick 的引用，避免 Child 不必要的重渲染
>   const handleClick = useCallback(() => {
>     console.log('clicked')
>   }, [])
>
>   return <Child onClick={handleClick} />
> }
>
> // Child 用 React.memo 包裹
> const Child = React.memo(({ onClick }) => {
>   console.log('Child rendered')
>   return <button onClick={onClick}>Click</button>
> })
> ```
>
> 3. **作为其他 Hook 的依赖**
> ```typescript
> // ✅ 作为 useEffect 的依赖
> const options = useMemo(() => ({
>   root: document.getElementById('scroll-container'),
>   threshold: 0.5
> }), [])
>
> const observer = useMemo(
>   () => new IntersectionObserver(callback, options),
>   [options]
> )
> ```
>
> **useCallback 的本质：**
> ```typescript
> // useCallback(fn, deps) 等价于
> useMemo(() => fn, deps)
> ```
>
> **何时不需要使用：**
> ```typescript
> // ❌ 不需要：传给原生 DOM 事件
> <button onClick={() => setCount(c => c + 1)}>  // ✅ 每次新函数也没问题
>
> // ❌ 不需要：子组件没有用 React.memo
> function Parent() {
>   const handleClick = useCallback(...)  // 没用，Child 还是会重渲染
>   return <Child onClick={handleClick} />  // Child 没有 React.memo
> }
> ```
>
> **我的判断标准：**
> 1. 这个计算真的昂贵吗？（过滤/排序大量数据才考虑）
> 2. 这个值/函数会被作为子组件的 props 吗？（子组件用 React.memo 才有意义）
> 3. 会被用作其他 Hook 的依赖吗？（useEffect、useMemo 等）
>
> 如果三个答案都是 NO，那就不需要用。"

### 4.5 自定义 Hooks 设计模式

**Q: 你在项目中写过哪些自定义 Hooks？能举个例子吗？**

> "我在项目中写了很多自定义 Hooks，这里举几个典型的例子：
>
> **1. useConfirm - 确认对话框封装**
> ```typescript
> // hooks/useConfirm.ts
> export function useConfirm() {
>   const [confirmState, setConfirmState] = useState({
>     open: false,
>     title: '',
>     message: '',
>     onConfirm: () => {}
>   })
>
>   const confirm = (title: string, message: string, onConfirm: () => void) => {
>     return new Promise<boolean>((resolve) => {
>       setConfirmState({
>         open: true,
>         title,
>         message,
>         onConfirm: () => {
>           onConfirm()
>           resolve(true)
>           setConfirmState(prev => ({ ...prev, open: false }))
>         }
>       })
>     })
>   }
>
>   const cancel = () => {
>     setConfirmState(prev => ({ ...prev, open: false }))
>   }
>
>   return { confirm, cancel, confirmState }
> }
>
> // 使用
> function TransactionList() {
>   const { confirm, cancel, confirmState } = useConfirm()
>
>   const handleDelete = async (id: string) => {
>     const confirmed = await confirm(
>       '确认删除',
>       '删除后无法恢复，确定要删除这笔交易吗？'
>     )
>     if (confirmed) {
>       useStore.getState().deleteTransaction(id)
>     }
>   }
>
>   return (
>     <>
>       {transactions.map(tx => (
>         <TransactionCard
>           key={tx.id}
>           onDelete={() => handleDelete(tx.id)}
>         />
>       ))}
>       <ConfirmDialog
>         open={confirmState.open}
>         title={confirmState.title}
>         message={confirmState.message}
>         onConfirm={confirmState.onConfirm}
>         onCancel={cancel}
>       />
>     </>
>   )
> }
> ```
>
> **2. useMobile - 响应式检测**
> ```typescript
> // hooks/useMobile.ts
> export function useMobile(breakpoint: number = 768) {
>   const [isMobile, setIsMobile] = useState(
>     typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
>   )
>
>   useEffect(() => {
>     const handleResize = () => {
>       setIsMobile(window.innerWidth < breakpoint)
>     }
>
>     window.addEventListener('resize', handleResize)
>     return () => window.removeEventListener('resize', handleResize)
>   }, [breakpoint])
>
>   return isMobile
> }
>
> // 使用
> function Layout() {
>   const isMobile = useMobile()
>
>   return isMobile ? <MobileNav /> : <DesktopNav />
> }
> ```
>
> **3. usePagination - 分页逻辑封装**
> ```typescript
> // hooks/usePagination.ts
> export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
>   const [currentPage, setCurrentPage] = useState(1)
>
>   const totalPages = Math.ceil(items.length / itemsPerPage)
>   const currentItems = useMemo(() => {
>     const start = (currentPage - 1) * itemsPerPage
>     const end = start + itemsPerPage
>     return items.slice(start, end)
>   }, [items, currentPage, itemsPerPage])
>
>   const nextPage = () => {
>     setCurrentPage(p => Math.min(p + 1, totalPages))
>   }
>
>   const prevPage = () => {
>     setCurrentPage(p => Math.max(p - 1, 1))
>   }
>
>   const goToPage = (page: number) => {
>     setCurrentPage(Math.max(1, Math.min(page, totalPages)))
>   }
>
>   return {
>     currentPage,
>     totalPages,
>   currentItems,
>     nextPage,
>     prevPage,
>     goToPage,
>     canGoNext: currentPage < totalPages,
>     canGoPrev: currentPage > 1
>   }
> }
> ```
>
> **自定义 Hooks 的设计原则：**
> 1. **单一职责** - 每个 Hook 只做一件事
> 2. **参数化配置** - 通过参数控制行为
> 3. **返回稳定引用** - 必要时使用 useCallback/useMemo
> 4. **清晰的命名** - 以「use」开头，描述功能"

### 4.6 useState 的函数式更新

**Q: useState 的函数式更新是什么场景下用的？**

> "函数式更新是解决**状态更新依赖旧状态**的问题：
>
> **问题场景：**
> ```typescript
> // ❌ 错误：连续更新可能丢失中间状态
> function Counter() {
>   const [count, setCount] = useState(0)
>
>   const handleClick = () => {
>     setCount(count + 1)  // 读取的是当前 render 的 count
>     setCount(count + 1)  // 两次都是读取同一个 count
>     // 结果只增加了 1
>   }
>
>   return <button onClick={handleClick}>{count}</button>
> }
>
> // ✅ 正确：使用函数式更新
> function Counter() {
>   const [count, setCount] = useState(0)
>
>   const handleClick = () => {
>     setCount(c => c + 1)  // c 是最新的 state
>     setCount(c => c + 1)  // 每次都基于最新的值
>     // 结果增加了 2
>   }
>
>   return <button onClick={handleClick}>{count}</button>
> }
> ```
>
> **我的项目中使用的场景：**
> ```typescript
> // 批量添加交易时
> const addMultipleTransactions = (newTransactions: Transaction[]) => {
>   setTransactions(current => [
>     ...newTransactions.map(t => ({ ...t, id: nanoid() })),
>     ...current
>   ])
> }
> ```
>
> **规则：**
> - 如果新状态依赖旧状态，使用函数式更新
> - 如果新状态与旧状态无关，直接传值"

### 4.7 useRef 的正确使用

**Q: useRef 和 useState 有什么区别？什么时候用 useRef？**

> "useRef 和 useState 的核心区别：
>
> | 特性 | useState | useRef |
> |------|----------|--------|
> | 返回值 | [state, setState] | { current: value } |
> | 触发重渲染 | ✅ 是 | ❌ 否 |
> | 更新方式 | setState(newValue) | ref.current = newValue |
> | 适用场景 | 需要渲染的数据 | 不需要渲染的数据 |
>
> **useRef 的使用场景：**
>
> **1. 访问 DOM 元素**
> ```typescript
> function InputFocus() {
>   const inputRef = useRef<HTMLInputElement>(null)
>
>   useEffect(() => {
>     inputRef.current?.focus()  // 组件挂载后自动聚焦
>   }, [])
>
>   return <input ref={inputRef} />
> }
> ```
>
> **2. 存储定时器 ID**
> ```typescript
> function Timer() {
>   const timerRef = useRef<number | null>(null)
>
>   const start = () => {
>     timerRef.current = window.setInterval(() => {
>       console.log('tick')
>     }, 1000)
>   }
>
>   const stop = () => {
>     if (timerRef.current) {
>       clearInterval(timerRef.current)
>       timerRef.current = null
>     }
>   }
>
>   useEffect(() => {
>     return () => {
>       // 组件卸载时清理定时器
>       if (timerRef.current) {
>         clearInterval(timerRef.current)
>       }
>     }
>   }, [])
>
>   return (
>     <>
>       <button onClick={start}>Start</button>
>       <button onClick={stop}>Stop</button>
>     </>
>   )
> }
> ```
>
> **3. 存储上一次的值**
> ```typescript
> function usePrevious<T>(value: T): T | undefined {
>   const ref = useRef<T>()
>
>   useEffect(() => {
>     ref.current = value
>   }, [value])
>
>   return ref.current
> }
>
> // 使用
> function Counter() {
>   const [count, setCount] = useState(0)
>   const prevCount = usePrevious(count)
>
>   return (
>     <div>
>       Current: {count}, Previous: {prevCount}
>     </div>
>   )
> }
> ```
>
> **4. 跨 render 保持可变数据（不触发重渲染）**
> ```typescript
> function Logger() {
>   const renderCountRef = useRef(0)
>
>   renderCountRef.current += 1  // 不会触发重渲染
>
>   return <div>Rendered: {renderCountRef.current} times</div>
> }
> ```
>
> **我的项目中的使用：**
> ```typescript
> // 用于存储组件是否已卸载
> function TransactionList() {
>   const isMountedRef = useRef(true)
>
>   useEffect(() => {
>     return () => {
>       isMountedRef.current = false  // 卸载时标记
>     }
>   }, [])
>
>   const handleDelete = async (id: string) => {
>     await api.deleteTransaction(id)
>
>     // 避免在组件卸载后更新状态
>     if (isMountedRef.current) {
>       useStore.getState().deleteTransaction(id)
>     }
>   }
>
>   // ...
> }
> ```"

### 4.8 useContext 的使用场景

**Q: 什么时候应该用 Context？什么时候不该用？**

> "**Context 的适用场景：**
>
> 1. **主题、语言等全局配置**
> ```typescript
> // 主题 Context
> const ThemeContext = createContext({
>   theme: 'light',
>   toggleTheme: () => {}
> })
>
> function App() {
>   const [theme, setTheme] = useState('light')
>
>   return (
>     <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
>       <Header />
>       <Main />
>       <Footer />
>     </ThemeContext.Provider>
>   )
> }
>
> function Header() {
>   const { theme, toggleTheme } = useContext(ThemeContext)
>   return <button onClick={toggleTheme}>{theme}</button>
> }
> ```
>
> 2. **用户信息、认证状态**
> 3. **表单的多层组件通信**
>
> **Context 不适用的场景：**
>
> ❌ 频繁变化的状态（会导致所有消费者重渲染）
> ```typescript
> // ❌ 不好的实践：频繁变化的计数器
> const CountContext = createContext(0)
>
> // 每次更新都会导致所有消费者重渲染
> ```
>
> ✅ 应该用状态管理库（Zustand/Redux）
> ```typescript
> // 使用 Zustand，只有订阅的组件会重渲染
> const useStore = create((set) => ({
>   count: 0,
>   increment: () => set((state) => ({ count: state.count + 1 }))
> }))
>
> function Counter() {
>   const count = useStore((state) => state.count)  // 只有这个组件会重渲染
>   return <div>{count}</div>
> }
> ```
>
> **我的项目中的选择：**
>
> 我使用 Zustand 而不是 Context，原因是：
> 1. Zustand 的选择器更灵活
> 2. 避免了 Context 的性能问题（所有消费者都会重渲染）
> 3. 不需要 Provider 包裹
> 4. 更容易实现持久化
>
> 但我会用 Context 来做一些不会频繁变化的全局配置，比如主题、语言等。"

### 4.9 React Hooks 的原理

**Q: 你能简单解释一下 React Hooks 的原理吗？**

> "React Hooks 的核心原理是**基于 Fiber 的链表结构**：
>
> **1. Hooks 的存储方式**
> ```typescript
> // 简化版原理
> let currentHookIndex = 0
> let hooks = []  // 每个 Fiber 节点都有自己的 hooks 数组
>
> function useState(initialState) {
>   const hookIndex = currentHookIndex
>
>   // 首次渲染时创建 hook
>   if (hooks[hookIndex] === undefined) {
>     hooks[hookIndex] = {
>       state: initialState,
>       queue: []  // 待处理的更新
>     }
>   }
>
>   const hook = hooks[hookIndex]
>   currentHookIndex++  // 重要：每次调用都要移动索引
>
>   // 处理更新队列
>   while (hook.queue.length > 0) {
>     const update = hook.queue.shift()
>     hook.state = typeof update === 'function' ? update(hook.state) : update
>   }
>
>   const setState = (update) => {
>     hook.queue.push(update)
>     // 触发重渲染
>     scheduleRerender()
>   }
>
>   return [hook.state, setState]
> }
>
> // useEffect 也是类似，只是多了 effect 函数和依赖数组
> function useEffect(effect, deps) {
>   const hookIndex = currentHookIndex
>   const hook = hooks[hookIndex] || { deps: null }
>   currentHookIndex++
>
>   // 检查依赖是否变化
>   const hasChanged = !hook.deps || !deps ||
>     deps.some((dep, i) => dep !== hook.deps[i])
>
>   if (hasChanged) {
>     hook.deps = deps
>     // 注册 effect，稍后执行
>     registerEffect(effect)
>   }
> }
> ```
>
> **2. 为什么 Hooks 必须在顶层调用？**
> ```typescript
> // ❌ 错误：条件调用
> if (condition) {
>   useState(0)  // 第一次渲染有，第二次渲染没有
> }
> useState(1)  // 第一次是第二个 hook，第二次变成第一个
>
> // ✅ 正确：总是在顶层调用
> const [a, setA] = useState(0)
> const [b, setB] = useState(1)
>
> if (condition) {
>   // 使用状态，不是调用 hook
>   setA(2)
> }
> ```
>
> 因为 React 依靠**调用顺序**来识别每个 hook，如果顺序改变，就会出错。
>
> **3. Hooks 的规则总结**
> - 只能在 React 函数组件中调用
> - 只能在顶层调用，不能在条件、循环、嵌套函数中调用
> - 为了保证调用顺序稳定
>
> 这个理解让我在使用 Hooks 时更加谨慎，避免了常见的错误。**"

### 4.10 React 19 的新特性

**Q: 你用了 React 19，有什么新特性吗？**

> "React 19 有几个值得注意的新特性：
>
> **1. use() Hook - 资源读取**
> ```typescript
> // React 19 之前：在 useEffect 中获取数据
> function User({ id }) {
>   const [user, setUser] = useState(null)
>
>   useEffect(() => {
>     fetchUser(id).then(setUser)
>   }, [id])
>
>   if (!user) return <Loading />
>   return <div>{user.name}</div>
> }
>
> // React 19：使用 use()
> import { use } from 'react'
>
> function User({ id }) {
>   const user = use(fetchUser(id))  // 自动处理 Suspense
>   return <div>{user.name}</div>
> }
>
> // 配合 Suspense
> <Suspense fallback={<Loading />}>
>   <User id={1} />
> </Suspense>
> ```
>
> **2. useActionState - 表单 action**
> ```typescript
> import { useActionState } from 'react'
>
> function Form() {
>   const [state, formAction] = useActionState(async (prevState, formData) => {
>     const result = await submitForm(formData)
>     return result
>   }, null)
>
>   return (
>     <form action={formAction}>
>       <input name="username" />
>       <button type="submit">Submit</button>
>       {state?.error && <div>{state.error}</div>}
>     </form>
>   )
> }
> ```
>
> **3. useOptimistic - 乐观更新**
> ```typescript
> import { useOptimistic } from 'react'
>
> function LikeButton({ postId, initialLikes }) {
>   const [likes, setLikes] = useState(initialLikes)
>   const [optimisticLikes, addOptimisticLike] = useOptimistic(
>     likes,
>     (state, newLike) => state + 1
>   )
>
>   const handleLike = async () => {
>     addOptimisticLike(1)  // 立即更新 UI
>     await api.like(postId)  // 后台发送请求
>     setLikes(l => l + 1)  // 请求完成后确认
>   }
>
>   return <button onClick={handleLike}>{optimisticLikes} ❤️</button>
> }
> ```
>
> **4. 改进的 TypeScript 类型**
> - React.FC 不再需要（可以直接写函数组件）
> - 更好的 JSX 元素类型推导
>
> **5. Server Components 支持**
> - 虽然我的项目是纯前端，但 React 19 为服务端组件做了更好的准备
>
> 我的项目目前还是以 React 18 的方式开发，但我计划在未来尝试使用 React 19 的新特性，特别是 use() 和 useOptimistic。**"

### 4.11 常见的 React 性能优化问题

**Q: 你在项目中做了哪些 React 性能优化？**

> "我在项目中做了几个层次的性能优化：
>
> **1. 组件级别的优化 - React.memo**
> ```typescript
> // ❌ 每次父组件更新都会重渲染
> function TransactionCard({ transaction }) {
>   return <div>{transaction.note}</div>
> }
>
> // ✅ 只在 transaction 变化时重渲染
> const TransactionCard = React.memo(({ transaction }) => {
>   return <div>{transaction.note}</div>
> }, (prevProps, nextProps) => {
>   // 自定义比较函数
>   return prevProps.transaction.id === nextProps.transaction.id
> })
> ```
>
> **2. 状态派生的优化 - 避免不必要的状态**
> ```typescript
> // ❌ 冗余状态
> const [transactions, setTransactions] = useState([])
> const [filteredTransactions, setFilteredTransactions] = useState([])
>
> useEffect(() => {
>   setFilteredTransactions(
>     transactions.filter(t => t.type === 'expense')
>   )
> }, [transactions])
>
> // ✅ 派生状态，不存储
> const [transactions, setTransactions] = useState([])
> const filteredTransactions = useMemo(() =>
>   transactions.filter(t => t.type === 'expense'),
>   [transactions]
> )
> ```
>
> **3. 列表渲染优化 - 虚拟滚动**
> ```typescript
> // 对于大量数据，使用 react-window
> import { FixedSizeList } from 'react-window'
>
> function TransactionList({ transactions }) {
>   const Row = ({ index, style }) => (
>     <div style={style}>
>       {transactions[index].note}
>     </div>
>   )
>
>   return (
>     <FixedSizeList
>       height={600}
>       itemCount={transactions.length}
>       itemSize={50}
>       width="100%"
>     >
>       {Row}
>     </FixedSizeList>
>   )
> }
> ```
>
> **4. 懒加载组件**
> ```typescript
> // 路由级别懒加载
> const Dashboard = lazy(() => import('@/pages/Dashboard'))
> const Settings = lazy(() => import('@/pages/Settings'))
>
> // 条件懒加载
> function ConditionalChart({ showChart }) {
>   const Chart = useMemo(() =>
>     lazy(() => import('./Chart')),
>     []
>   )
>
>   return showChart ? (
>     <Suspense fallback={<Loading />}>
>       <Chart />
>     </Suspense>
>   ) : null
> }
> ```
>
> **5. Context 优化 - 拆分 Context**
> ```typescript
> // ❌ 一个大 Context，任何值变化都会导致所有消费者重渲染
> const AppContext = createContext({
>   user: null,
>   theme: 'light',
>   notifications: []
> })
>
> // ✅ 拆分成多个 Context
> const UserContext = createContext(null)
> const ThemeContext = createContext('light')
> const NotificationContext = createContext([])
>
> // 只有使用特定 Context 的组件才会在相关值变化时重渲染
> ```
>
> **6. 防抖和节流**
> ```typescript
> import { useDebouncedCallback } from 'use-debounce'
>
> function SearchInput() {
>   const [query, setQuery] = useState('')
>
>   // 防抖：用户停止输入 300ms 后才执行搜索
>   const debouncedSearch = useDebouncedCallback(
>     (value) => {
>       api.search(value)
>     },
>     300
>   )
>
>   const handleChange = (e) => {
>     const value = e.target.value
>     setQuery(value)
>     debouncedSearch(value)
>   }
>
>   return <input value={query} onChange={handleChange} />
> }
> ```
>
> **我的优化优先级：**
> 1. 先用 React DevTools Profiler 找到真正的性能瓶颈
> 2. 优先优化算法和数据结构
> 3. 再考虑组件级别的优化（React.memo、useMemo）
> 4. 最后才考虑列表虚拟化等复杂方案
>
> 过早优化是万恶之源，先确保代码正确，再考虑优化。**"

---

## 5. 面试问题回答模板

### 5.1 项目介绍类

**Q: 请介绍一下你的项目**

> "我开发了一个个人财富管理应用 ProsperLite。这个项目用 React 19 + TypeScript 构建，使用 Zustand 做状态管理。
>
> 项目的核心功能是帮用户管理交易记录和账本，支持收支统计和数据可视化。虽然现在运行在纯前端，但我预留了后端架构。
>
> 在这个项目中，我主要解决了三个技术挑战：
> 1. 复杂的状态管理，特别是跨模块的状态同步
> 2. LocalStorage 数据的版本迁移
> 3. 金融金额的精度处理
>
> 我还实践了 Monorepo 架构和模块化开发模式，让我对前端工程化有了更深的理解。"

**Q: 你在项目中遇到的最大挑战是什么？**

> "最大的挑战是**跨模块状态同步**的设计。
>
> 场景是这样的：当用户修改或删除一笔交易时，关联的账户余额需要同步更新。这两个状态分别在不同的 Zustand Slice 中。
>
> 我尝试了几种方案：
>
> 1. **组件层面处理** - 在组件里手动调用两个 action
>    - 问题：容易遗漏，代码重复
>
> 2. **使用 useEffect 监听** - 监听 transactions 变化，然后更新余额
>    - 问题：会有延迟，可能产生竞态条件
>
> 3. **最终方案：副作用协调函数** - 在数据变更的同时，通过 `get()` 访问其他 Slice 的方法
>    - 优点：逻辑集中、类型安全、易于测试
>
> 这个过程让我理解了状态管理的本质：不是简单地把数据放在一起，而是要设计好数据之间的关联和副作用。"

### 5.2 技术选型类

**Q: 为什么选择 Zustand 而不是 Redux？**

> "我做过详细的技术调研，主要从三个维度对比：
>
> **1. 开发体验**
> - Zustand: API 简洁，几乎不需要样板代码
> - Redux Toolkit: 虽然比原生 Redux 简单，但仍需定义 actions/reducers
>
> **2. 性能**
> - Zustand: 更小的 bundle size (~1KB)
> - Redux Toolkit: ~10KB+
>
> **3. 团队规模**
> - Zustand: 适合小团队或个人项目
> - Redux: 大型团队、复杂项目有更多最佳实践
>
> 我的判断是：对于个人财富管理这个场景，Zustand 完全够用，而且开发效率更高。不过我也认识到如果团队扩大或项目复杂度增加，迁移到 Redux 也是一个选项。"

**Q: 为什么选择 Shadcn/UI 而不是 Ant Design？**

> "Shadcn/UI 和 Ant Design 是两种不同的思路：
>
> **Ant Design：**
> - 是一个完整的 npm 包
> - 开箱即用，但定制困难
> - 包体积大（即使只用到几个组件）
>
> **Shadcn/UI：**
> - 不是包，是一组可以复制的代码
> - 基于 Radix UI Primitives（无障碍 + 键盘导航）
> - 使用 Tailwind 定制样式
> - 完全控制代码，可以随意修改
>
> 我选择 Shadcn/UI 的原因是：
> 1. **学习价值** - 能看到组件的实现细节
> 2. **灵活性** - 可以根据项目需求定制
> 3. **包体积** - 只复制用到的组件
> 4. **TypeScript** - 类型定义更精准
>
> 这个选择让我对 UI 组件的设计有了更深的理解。"

**Q: 为什么用 Zod 而不是 Yup？**

> "我对比了 Zod 和 Yup，最终选择 Zod 的原因是：
>
> **1. 类型推导**
> ```typescript
> // Zod: 自动推导类型
> const schema = z.object({ name: z.string() })
> type User = z.infer<typeof schema>  // ✅ 自动推导
>
> // Yup: 需要手动定义类型
> interface User { name: string }  // ❌ 重复定义
> const schema = yup.object({ name: yup.string() })
> ```
>
> **2. TypeScript 优先**
> - Zod 是为 TypeScript 设计的
> - Yup 是从 JavaScript 迁移过来的
>
> **3. API 设计**
> - Zod 的链式 API 更符合直觉
> - 错误信息更易于定制
>
> **4. 性能**
> - Zod 的验证性能略优于 Yup
>
> 在我的项目中，Zod 的类型推导特性帮了大忙，实现了真正的'单一数据源'。"

### 5.3 实现细节类

**Q: React Hook Form 是怎么和 Zod 集成的？**

> "集成的核心是 `zodResolver`，它把 Zod schema 转换成 React Hook Form 的 validator：
>
> ```typescript
> import { zodResolver } from '@hookform/resolvers/zod'
> import { useForm } from 'react-hook-form'
> import { transactionSchema } from '@/schemas/transaction'
>
> function TransactionForm() {
>   const form = useForm<TransactionInput>({
>     resolver: zodResolver(transactionSchema),  // 🔑 关键
>     defaultValues: {
>       amount: 0,
>       type: 'expense',
>       categoryId: '',
>       ledgerId: '',
>       date: new Date().toISOString()
>     }
>   })
>
>   const onSubmit = (data: TransactionInput) => {
>     // 这里 data 已经是类型安全的
>     useStore.getState().addTransaction(data)
>   }
>
>   return (
>     <form onSubmit={form.handleSubmit(onSubmit)}>
>       {/* 表单字段 */}
>     </form>
>   )
> }
> ```
>
> **数据流向：**
> ```
> 用户输入 → Controller/Controller
>          ↓
>    zodResolver 验证
>          ↓
>    验证通过 → 提交表单
>    验证失败 → 显示错误信息
> ```
>
> 这个方案的优点是：
> 1. **类型安全** - 从输入到存储全程类型推导
> 2. **代码复用** - Zod schema 可以用于多个地方（API 验证等）
> 3. **错误处理** - Zod 的错误信息更灵活"

**Q: 你是如何实现分页和筛选的？**

> "我设计了一个**状态管理 + UI 分离**的分页方案：
>
> **1. Store 层：管理分页状态**
>
> ```typescript
> interface TransactionSlice {
>   // 数据
>   transactions: Transaction[]
>
>   // 分页状态
>   currentPage: number
>   itemsPerPage: number
>
>   // 筛选状态
>   dateRangeStart: string | null
>   dateRangeEnd: string | null
>
>   // Actions
>   setCurrentPage: (page: number) => void
>   setDateRange: (start: string | null, end: string | null) => void
>   resetFilters: () => void
> }
> ```
>
> **2. Selector 层：计算派生数据**
>
> ```typescript
> // 获取筛选后的交易
> const getFilteredTransactions = (state: StoreState) => {
>   let result = state.transactions
>
>   // 日期筛选
>   if (state.dateRangeStart && state.dateRangeEnd) {
>     result = result.filter(t => {
>       const date = new Date(t.date).getTime()
>       return date >= new Date(state.dateRangeStart).getTime() &&
>              date <= new Date(state.dateRangeEnd).getTime()
>     })
>   }
>
>   return result
> }
>
> // 获取当前页的交易
> const getCurrentPageTransactions = (state: StoreState) => {
>   const filtered = getFilteredTransactions(state)
>   const start = (state.currentPage - 1) * state.itemsPerPage
>   const end = start + state.itemsPerPage
>   return filtered.slice(start, end)
> }
> ```
>
> **3. UI 层：展示数据和控制**
>
> ```typescript
> function TransactionList() {
>   const transactions = useStore(getCurrentPageTransactions)
>   const currentPage = useStore(state => state.currentPage)
>   const totalPages = useStore(state =>
>     Math.ceil(getFilteredTransactions(state).length / state.itemsPerPage)
>   )
>
>   return (
>     <>
>       {/* 交易列表 */}
>       {transactions.map(tx => <TransactionCard key={tx.id} {...tx} />)}
>
>       {/* 分页控件 */}
>       <Pagination
>         current={currentPage}
>         total={totalPages}
>         onChange={(page) => useStore.getState().setCurrentPage(page)}
>       />
>     </>
>   )
> }
> ```
>
> **关键设计决策：**
>
> 1. **分页状态不持久化** - 每次刷新重置到第一页
> 2. **筛选改变时重置页码** - 避免显示空页面
> 3. **选择器函数复用** - 计算逻辑可以在多处使用
>
> 这个方案让我理解了**状态和派生数据的区别** - 分页状态是原始状态，而筛选后的列表是派生数据，应该用选择器计算。"

**Q: 你的项目如何保证类型安全？**

> "我在项目中实践了**多层类型安全策略**：
>
> **1. TypeScript 编译时检查**
> - 开启 strict mode
> - 所有函数都有明确的参数和返回类型
> - 不使用 any（除了极少数必要场景用 unknown + 类型守卫）
>
> **2. Zod 运行时验证**
> ```typescript
> // 定义 Schema
> const transactionSchema = z.object({
>   amount: z.number().positive(),
>   type: z.enum(['expense', 'income'])
> })
>
> // 推导类型
> type TransactionInput = z.infer<typeof transactionSchema>
>
> // 验证输入
> const result = transactionSchema.parse(userInput)
> ```
>
> **3. 类型守卫处理外部数据**
> ```typescript
> // 从 LocalStorage 读取的数据类型是 unknown
> function isValidCategory(value: unknown): value is Category {
>   return (
>     typeof value === 'object' &&
>     value !== null &&
>     'id' in value &&
>     typeof value.id === 'string'
>   )
> }
> ```
>
> **4. API 响应类型定义**（预留）
> ```typescript
> // 未来接入后端时使用
> interface ApiResponse<T> {
>   data: T
>   error: string | null
> }
>
> async function fetchTransactions(): Promise<ApiResponse<Transaction[]>> {
>   // ...
> }
> ```
>
> **这些实践让我认识到：类型安全不是单一的技术，而是一整套工程化体系。**"

### 5.4 工程化类

**Q: 为什么要用 Monorepo？**

> "我选择 Monorepo 是基于以下考虑：
>
> **优势：**
>
> 1. **代码复用**
>    - shared 包存放类型定义和工具函数
>    - web 和 server（未来）都可以引用
>
> 2. **统一版本管理**
>    - 所有子项目使用相同版本的 TypeScript、ESLint
>    - 避免依赖冲突
>
> 3. **原子提交**
>    - 跨应用的修改可以在一个 PR 中完成
>    - 代码审查更方便
>
> 4. **统一工具链**
>    - 一套 ESLint 配置
>    - 一套 TypeScript 配置
>
> **我的目录结构：**
> ```
> prosperlite/
> ├── apps/
> │   ├── web/           # 前端应用
> │   └── server/        # 后端应用（预留）
> └── packages/
>     └── shared/        # 共享类型和工具
>         ├── schemas/   # Zod schemas
>         └── utils/     # 工具函数
> ```
>
> **需要注意的挑战：**
> - 构建时间会增加
> - 需要学习 pnpm workspace 的概念
>
> 但对于我这个规模的个人项目，优势远大于挑战。"

**Q: 你是如何做代码分割的？**

> "我使用了**多层代码分割策略**：
>
> **1. 路由级别分割 - React.lazy**
>
> ```typescript
> // router/router.tsx
> import { lazy } from 'react'
>
> const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'))
> const Transactions = lazy(() => import('@/pages/Transaction/Transaction'))
> const Statistic = lazy(() => import('@/pages/Statistic/Statistic'))
>
> // 用户访问时才加载对应的 chunk
> ```
>
> **2. Vite 自动分割**
>
> ```typescript
> // vite.config.ts
> export default defineConfig({
>   build: {
>     rollupOptions: {
>       output: {
>         manualChunks: {
>           'react-vendor': ['react', 'react-dom', 'react-router-dom'],
>           'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
>           'charts': ['recharts']
>         }
>       }
>     }
>   }
> })
> ```
>
> **3. 动态导入第三方库**
>
> ```typescript
> // 比如图表库，只在需要时加载
> const loadChart = async () => {
>   const { LineChart } = await import('recharts')
>   return LineChart
> }
> ```
>
> **效果：**
> - 首屏加载体积从 ~800KB 降到 ~300KB
> - 每个页面加载时只加载必要的代码
>
> 这让我理解了性能优化的本质：**不是减少代码，而是延迟加载**。"

---

## 6. 技术深度问题

### 6.1 Zustand 原理

**Q: 你能简单实现一下 Zustand 的核心原理吗？**

> "Zustand 的核心是一个**发布订阅模式**的状态容器：
>
> ```typescript
> // 简化版 Zustand 实现
> function createStore<T>(createState: (setState, getState) => T) {
>   let state: T
>   const listeners = new Set<(state: T) => void>()
>
>   const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
>     const nextState = typeof partial === 'function'
>       ? { ...state, ...(partial as (state: T) => Partial<T>)(state) }
>       : { ...state, ...partial }
>
>     if (nextState !== state) {
>       state = nextState
>       listeners.forEach(listener => listener(state))
>     }
>   }
>
>   const getState = () => state
>
>   const subscribe = (listener: (state: T) => void) => {
>     listeners.add(listener)
>     return () => listeners.delete(listener)  // 取消订阅
>   }
>
>   state = createState(setState, getState)
>
>   return { getState, setState, subscribe }
> }
>
> // React Hook 绑定
> function useStore<T>(store: ReturnType<typeof createStore<T>>, selector?: (state: T) => any) {
>   const [state, setState] = useState(() =>
>     selector ? selector(store.getState()) : store.getState()
>   )
>
>   useEffect(() => {
>     const listener = (newState: T) => {
>       const selected = selector ? selector(newState) : newState
>       setState(selected)
>     }
>
>     const unsubscribe = store.subscribe(listener)
>     return unsubscribe
>   }, [selector])
>
>   return state
> }
> ```
>
> **关键点：**
> 1. 不依赖 React Context，直接用订阅机制
> 2. 状态变化时通知所有订阅者
> 3. 支持选择器，只订阅部分状态
> 4. 取消订阅防止内存泄漏"

### 6.2 Immer 原理

**Q: Immer 是如何实现不可变更新的？**

> "Immer 使用 **ES6 Proxy** 来拦截对象操作：
>
> ```typescript
> // 简化版 Immer 实现
> function produce(baseState, recipe) {
>   const changes = new Set<string>()
>
>   const draft = new Proxy(baseState, {
>     set(target, key, value) {
>       // 记录修改的字段
>       changes.add(key as string)
>       target[key] = value
>       return true
>     },
>
>     get(target, key) {
>       const value = target[key]
>
>       // 如果是对象，递归创建 Proxy
>       if (typeof value === 'object' && value !== null) {
>         return new Proxy(value, {
>           set(subTarget, subKey, subValue) {
>             changes.add(`${key}.${subKey as string}`)
>             subTarget[subKey] = subValue
>             return true
>           }
>         })
>       }
>
>       return value
>     }
>   })
>
>   // 用户直接修改 draft
>   recipe(draft)
>
>   // 如果没有修改，返回原对象
>   if (changes.size === 0) {
>     return baseState
>   }
>
>   // 否则生成新对象
>   const newState = { ...baseState }
>   changes.forEach(key => {
>     // 实际上需要递归处理嵌套
>     newState[key] = draft[key]
>   })
>
>   return newState
> }
> ```
>
> **关键点：**
> 1. Proxy 拦截所有读写操作
> 2. 记录修改路径
> 3. 根据修改生成新对象
> 4. 未修改的部分共享引用（结构共享）
>
> 这就是为什么在 Immer 中可以直接修改对象，但最终还是不可变的原因。"

### 6.3 Zod 类型推导

**Q: Zod 的类型推导是如何实现的？**

> "Zod 的类型推导依赖于 TypeScript 的**条件类型和映射类型**：
>
> ```typescript
> // 简化版 Zod 类型推导原理
>
> // 1. 定义每个 Zod 类型都有一个 _type 辅助类型
> class ZodString {
>   _type!: string  // 使用 !: 强制赋值
> }
>
> class ZodNumber {
>   _type!: number
> }
>
> class ZodObject<T extends Record<string, ZodTypeAny>> {
>   _type!: { [K in keyof T]: T[K]['_type'] }  // 🔑 关键：映射类型
> }
>
> // 2. z.infer 提取 _type
> type infer<T extends ZodTypeAny> = T['_type']
>
> // 3. 使用
> const schema = new ZodObject({
>   name: new ZodString(),
>   age: new ZodNumber()
> })
>
> type User = infer<typeof schema>
> // 推导为：{ name: string; age: number }
> ```
>
> **核心技术点：**
> 1. **映射类型** - `[K in keyof T]: T[K]['_type']`
> 2. **索引访问** - `T[K]['_type']`
> 3. **条件类型** - 根据不同的类型返回不同的结果
>
> 这也是为什么 Zod 能实现真正的**单一数据源** - schema 即类型。"

---

## 7. 项目亮点与总结

### 7.1 项目亮点（可用于简历）

**1. 复杂状态管理架构**
- 使用 Zustand + Immer + Persist 实现可扩展的状态管理系统
- 设计了跨 Slice 的副作用协调机制
- 实现了版本化的数据迁移策略

**2. 类型安全工程实践**
- TypeScript strict mode 全程覆盖
- Zod Schema 实现编译时 + 运行时双重类型检查
- 类型守卫处理外部数据

**3. 性能优化**
- 路由级代码分割（React.lazy）
- 精确的状态选择器（避免不必要的重渲染）
- 分页 + 虚拟列表处理大数据

**4. 工程化能力**
- Pnpm Monorepo 架构
- Vite 构建优化
- 模块化组件设计

**5. 业务逻辑处理**
- 金融金额精度处理（整数存储方案）
- 复杂的筛选和分页逻辑
- 数据导入导出功能

### 7.2 可以展开的技术点

| 技术点 | 深度 | 面试适用性 |
|--------|------|------------|
| Zustand Slice 模式 | ⭐⭐⭐⭐⭐ | 状态管理架构 |
| 跨模块副作用协调 | ⭐⭐⭐⭐⭐ | 解决实际问题 |
| 数据迁移策略 | ⭐⭐⭐⭐ | 工程化能力 |
| 类型安全体系 | ⭐⭐⭐⭐ | TypeScript 实践 |
| Shadcn/UI 组件定制 | ⭐⭐⭐ | UI 组件设计 |
| 金额精度处理 | ⭐⭐⭐⭐ | 业务逻辑处理 |

### 7.3 个人成长总结

> "通过这个项目，我主要有以下几方面的成长：
>
> **1. 技术深度**
> - 深入理解了状态管理的本质：不是简单的数据存储，而是要处理好数据关联和副作用
> - 掌握了 TypeScript 高级特性在项目中的应用
> - 理解了各种性能优化技术的原理和权衡
>
> **2. 工程化思维**
> - 从'能跑就行'到'可维护、可扩展'
> - 学会了从项目规模选择合适的技术栈
> - 理解了 Monorepo 等架构的适用场景
>
> **3. 问题解决能力**
> - 遇到浮点数精度问题，主动查找原因并设计解决方案
> - 遇到状态同步问题，对比多种方案后选择最优解
> - 遇到数据迁移问题，设计了版本化迁移机制
>
> **4. 技术选型能力**
> - 学会了从多个维度对比技术方案
> - 理解了没有银弹，只有适合场景的方案
> - 能够权衡技术方案的成本和收益
>
> 这些成长让我从一个'写代码的人'变成了一个'解决问题的人'。"

### 7.4 后续优化方向

**如果面试官问：你有什么想改进的？**

> "项目目前还有很多可以改进的地方：
>
> **1. 测试覆盖**
> - 目前主要是手动测试，后续想加上单元测试和 E2E 测试
>
> **2. 性能监控**
> - 添加性能指标收集
> - 优化大列表渲染（虚拟滚动）
>
> **3. 后端集成**
> - 接入真实的后端 API
> - 实现 JWT 认证
> - 添加 WebSocket 实时更新
>
> **4. 用户体验**
> - 添加暗色模式
> - 实现 PWA 离线支持
> - 优化移动端适配
>
> **5. 数据分析**
> - 添加更多统计图表
> - 支出预测功能
> - 异常交易提醒
>
> 这些改进方向让我对项目的未来有清晰的规划。"

---

## 附录：React Hooks 面试速查表

### 最容易被滥用的 Hooks

| Hook | 滥用场景 | 正确做法 |
|------|----------|----------|
| **useEffect** | 把它当作 componentDidMount | 使用 useEffect 的依赖数组正确声明依赖 |
| **useMemo** | 缓存简单计算（如 `a + b`） | 只在计算真正昂贵时使用 |
| **useCallback** | 传给原生 DOM 事件 | 只在配合 React.memo 的子组件时使用 |
| **useState** | 存储派生状态 | 直接计算派生值 |
| **useContext** | 管理频繁变化的状态 | 使用状态管理库（Zustand/Redux） |

### Hooks 的「黄金法则」

1. **只在顶层调用 Hooks** - 不要在循环、条件或嵌套函数中调用
2. **只在 React 函数中调用 Hooks** - 不是在普通 JavaScript 函数中
3. **使用 ESLint 插件** - `react-hooks/rules-of-hooks` 和 `react-hooks/exhaustive-deps`

### useEffect 依赖项陷阱

```typescript
// ❌ 错误示例
useEffect(() => {
  fetchData(id)  // 使用了 id 但没声明
}, [])  // 依赖数组为空

// ✅ 正确做法
useEffect(() => {
  fetchData(id)
}, [id])  // 声明所有依赖
```

### useState 函数式更新

```typescript
// ❌ 可能丢失中间状态
setCount(count + 1)
setCount(count + 1)

// ✅ 函数式更新
setCount(c => c + 1)
setCount(c => c + 1)
```

### 自定义 Hooks 命名规范

```typescript
// ✅ 好的命名：描述功能
useConfirm()
useMobile()
usePagination()
usePrevious()

// ❌ 不好的命名：不清晰
useData()
useHook()
useStuff()
```

---

## 附录：面试准备清单

### 必须掌握的核心代码

| 文件 | 面试重要性 | 关键代码 |
|------|------------|----------|
| `store/useStore.ts` | ⭐⭐⭐⭐⭐ | 中间件配置、migrate 函数 |
| `features/transactions/store/transactionSlice.ts` | ⭐⭐⭐⭐⭐ | 副作用协调、CRUD 逻辑 |
| `schemas/transaction.ts` | ⭐⭐⭐⭐ | Zod Schema 定义 |
| `router/router.tsx` | ⭐⭐⭐ | 懒加载配置 |

### 需要能解释清楚的概念

#### React 相关
- [ ] 为什么需要 Hooks？解决了什么问题？
- [ ] useEffect 的依赖项陷阱（函数、对象、闭包）
- [ ] useMemo 和 useCallback 的正确使用场景
- [ ] useRef 和 useState 的区别
- [ ] 为什么 Hooks 必须在顶层调用？（原理）
- [ ] useState 的函数式更新
- [ ] useContext 的适用场景和不适用场景
- [ ] 自定义 Hooks 的设计原则
- [ ] React.memo 的正确使用
- [ ] React 19 的新特性（use、useOptimistic、useActionState）

#### 项目架构相关
- [ ] Zustand 为什么不需要 Provider？
- [ ] Immer 的 Proxy 原理
- [ ] Zod 的类型推导机制
- [ ] Slice 模式的优势
- [ ] 跨 Slice 状态操作
- [ ] 数据迁移策略设计
- [ ] 金额精度处理方案
- [ ] Shadcn/UI 和 Ant Design 的区别

#### 常见反模式
- [ ] 过度使用 useEffect
- [ ] 冗余状态存储（应该直接计算的派生状态）
- [ ] 滥用 useMemo/useCallback（性能优化的误区）
- [ ] Context 管理频繁变化的状态

### 常见追问准备

**Q: 如果让你们团队改用 Redux，你会怎么迁移？**
> "我会这样规划：
> 1. 保持 Slice 的结构，把每个 Slice 转换成 Redux Toolkit 的 slice
> 2. 把 Zustand 的中间件（persist、immer）替换成 Redux 的配置
> 3. 逐步替换组件中的 useStore 调用为 useSelector/useDispatch
> 4. 测试确保功能正常
>
> 因为我的架构已经是模块化的，迁移成本会相对较低。"

**Q: 你的项目如果用户量暴增，会有什么问题？**
> "主要问题会是：
> 1. LocalStorage 容量限制（5-10MB）
>    - 解决方案：迁移到 IndexedDB 或后端
> 2. 大量交易记录的性能问题
>    - 解决方案：虚拟滚动 + 分页
> 3. 多设备数据同步
>    - 解决方案：接入后端 + WebSocket
>
> 这些问题我在设计时已经有所考虑，所以架构上支持迁移。"

**Q: 如果让你重做一次，你会做什么改变？**
> "可能会做这些改进：
> 1. 从一开始就加入测试
> 2. 使用 React Query 管理服务端状态（如果有后端）
> 3. 更早地引入性能监控
> 4. 使用 tRPC 替代传统的 REST API（如果用后端）
>
> 但总体架构我还是会保持，因为它已经证明了是适合这个项目规模的。"

---

## 8. Angular vs React 对比指南（针对 Angular 背景）

> "作为 Angular 开发者转向 React，我发现这两个框架在很多概念上有对应关系，但思路完全不同。"

### 8.1 核心理念对比

| 维度 | Angular | React |
|------|---------|-------|
| **设计哲学** | 完整框架（Opinionated） | 库（Unopinionated） |
| **状态管理** | RxJS + Services | 多种方案（Redux/Zustand/Context） |
| **依赖注入** | 内置 DI 系统 | 需要第三方库或手动实现 |
| **模板** | HTML 模板 + 指令 | JSX（JS 中写 HTML） |
| **变化检测** | Zone.js 自动追踪 | 手动声明依赖（useEffect 依赖数组） |
| **表单** | ReactiveFormsModule | React Hook Form + Zod |
| **HTTP** | HttpClient + RxJS | fetch/axios + async/await |
| **路由** | @angular/router（内置） | react-router-dom（第三方） |
| **模块化** | NgModules | 组件自动 tree-shaking |
| **生命周期** | ngOnInit, ngOnDestroy | useEffect, useEffect cleanup |

### 8.2 概念映射表

#### 组件定义对比

```typescript
// Angular
@Component({
  selector: 'app-user',
  template: '<div>{{ user.name }}</div>',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
  }
}
```

```tsx
// React (Hooks)
function User() {
  const [user, setUser] = useState<User | null>(null);
  const userService = useContext(UserServiceContext);

  useEffect(() => {
    userService.getUser().then(setUser);
  }, [userService]);

  return <div>{user?.name}</div>;
}
```

**关键区别：**
- Angular: 类组件，依赖注入，RxJS Observable
- React: 函数组件，Hooks，Promise/async-await
- Angular: 模板和逻辑分离
- React: JSX 让逻辑和视图更紧密

#### 状态管理对比

```typescript
// Angular Service + RxJS
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  updateUser(user: User) {
    this.userSubject.next(user);
  }
}

// 在组件中使用
@Component({...})
export class UserComponent {
  user$ = this.userService.user$;
}
```

```tsx
// React Zustand
interface UserStore {
  user: User | null;
  updateUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  updateUser: (user) => set({ user })
}));

// 在组件中使用
function UserComponent() {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
}
```

**关键区别：**
- Angular: RxJS Observable（流式思维），BehaviorSubject 保持最新值
- React: Zustand 直接读取状态，选择器模式
- Angular: 需要手动管理订阅（或用 async pipe）
- React: Hook 自动处理订阅和取消订阅

#### 表单处理对比

```typescript
// Angular Reactive Forms
@Component({...})
export class UserFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

```tsx
// React Hook Form + Zod
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email")
});

function UserForm() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = (data: z.infer<typeof userSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
    </form>
  );
}
```

**关键区别：**
- Angular: 强类型的表单模型，与 DOM 绑定
- React: 非受控组件（默认），性能更好
- Angular: Validators 在表单模型中定义
- React: Zod Schema 独立定义，可复用于 API 验证
- Angular: `form.value` 获取数据
- React: `handleSubmit` 提供验证后的数据

#### 生命周期对比

```typescript
// Angular 生命周期
@Component({...})
export class UserComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId: number | null = null;

  // 初始化
  ngOnInit() {
    console.log('Component initialized');
  }

  // 输入变化
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId']) {
      this.loadUser(changes['userId'].currentValue);
    }
  }

  // 销毁
  ngOnDestroy() {
    console.log('Component destroyed');
  }
}
```

```tsx
// React Hooks 生命周期
function User({ userId }: { userId: number | null }) {
  // ngOnInit + ngOnChanges
  useEffect(() => {
    console.log('Component initialized or userId changed');
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);  // 依赖数组 = ngOnChanges

  // componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('Component destroyed');
    };
  }, []);

  return <div>User</div>;
}
```

**关键区别：**
- Angular: 明确的生命周期钩子，每个职责清晰
- React: useEffect 统一处理所有副作用，依赖数组控制执行时机
- Angular: ngOnChanges 可以知道哪个属性变化了
- React: 需要用 useRef 保存旧值来对比

#### 依赖注入对比

```typescript
// Angular DI
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
}

@Component({...})
export class UserComponent {
  constructor(
    private userService: UserService,
    private logger: LoggerService
  ) {}
}
```

```tsx
// React - 方案 1: Context（类似 Angular DI）
const UserServiceContext = createContext<UserService | null>(null);

function App() {
  const userService = useMemo(() => new UserService(), []);

  return (
    <UserServiceContext.Provider value={userService}>
      <UserComponent />
    </UserServiceContext.Provider>
  );
}

function UserComponent() {
  const userService = useContext(UserServiceContext);
  // ...
}

// React - 方案 2: Zustand（全局单例）
const useUserStore = create(() => ({
  userService: new UserService()
}));

function UserComponent() {
  const { userService } = useUserStore();
  // ...
}
```

**关键区别：**
- Angular: 内置 DI 系统，自动管理依赖树
- React: Context 或全局状态管理库
- Angular: 装饰器 + TypeScript 类型推导
- React: useContext Hook

#### 路由对比

```typescript
// Angular 路由
const routes: Routes = [
  { path: 'users/:id', component: UserComponent },
  { path: '**', redirectTo: '/404' }
];

// 在组件中获取参数
@Component({...})
export class UserComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.loadUser(userId);
    });
  }
}
```

```tsx
// React Router v7
const router = createBrowserRouter([
  {
    path: '/users/:id',
    element: <User />
  }
]);

// 在组件中获取参数
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadUser(id);
    }
  }, [id]);

  return <div>User</div>;
}
```

**关键区别：**
- Angular: 路由配置和组件分离，ActivatedRoute Observable
- React: 路由配置直接关联组件，useParams Hook
- Angular: 路由守卫（canActivate, canDeactivate）
- React: 需要在组件中手动实现或用 loader/action

#### 异步数据对比

```typescript
// Angular + RxJS
@Component({...})
export class UserComponent {
  users$ = this.userService.getUsers().pipe(
    catchError(error => {
      console.error('Error loading users:', error);
      return of([]);
    })
  );

  constructor(private userService: UserService) {}
}
```

```tsx
// React - 自定义 Hook
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userService.getUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { users, error, loading };
}

function UserList() {
  const { users, error, loading } = useUsers();

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

**关键区别：**
- Angular: RxJS Observable 强大但学习曲线陡峭
- React: async/await 更直观，需要手动管理 loading/error
- Angular: async pipe 自动处理订阅
- React: useEffect 手动管理异步生命周期

### 8.3 心智模式转换

#### 1. 从"模板驱动"到"JSX 驱动"

**Angular 思维：**
- 模板是 HTML，逻辑在 TypeScript 类中
- 使用指令（*ngIf, *ngFor）控制视图

**React 思维：**
- JSX 是 JavaScript 的增强语法
- 直接用 JS 的 map/filter/&&/|| 控制视图

```tsx
// Angular 模板
<div *ngIf="user">
  <span>{{ user.name }}</span>
</div>
<ul>
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>

// React JSX
{user && <span>{user.name}</span>}
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
```

#### 2. 从"Observable 流"到"状态快照"

**Angular 思维：**
- 数据是流（Observable），持续变化
- 用 operators 转换流（map, filter, switchMap）

**React 思维：**
- 数据是状态的快照
- 状态变化触发重新渲染

```typescript
// Angular: 流式思维
users$ = this.http.get<User[]>('/api/users').pipe(
  map(users => users.filter(u => u.active)),
  switchMap(users => combineLatest(
    users.map(u => this.getUserStats(u.id))
  ))
);
```

```tsx
// React: 快照思维
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data.filter(u => u.active)));
}, []);
```

#### 3. 从"依赖注入"到"组件组合"

**Angular 思维：**
- 通过 DI 获取服务
- 服务是全局单例

**React 思维：**
- 通过 props 传递数据
- 通过 Context 或状态管理共享全局状态
- 组件组合优于继承

```tsx
// Angular: DI
constructor(private userService: UserService) {}

// React: Props
function UserList({ userService }: { userService: UserService }) {
  // ...
}

// React: Context
function UserList() {
  const userService = useContext(UserServiceContext);
  // ...
}
```

#### 4. 从"Zone.js 自动检测"到"手动声明依赖"

**Angular 思维：**
- Zone.js 自动追踪异步操作
- 状态变化自动触发变更检测

**React 思维：**
- 必须手动声明 useEffect 的依赖
- 依赖数组决定 effect 是否执行

```typescript
// Angular: 自动追踪
this.users = [...this.users, newUser];  // 自动更新视图
```

```tsx
// React: 手动声明依赖
useEffect(() => {
  console.log('Users changed:', users.length);
}, [users]);  // 必须声明 users 依赖
```

### 8.4 常见陷阱与解决方案

#### 陷阱 1: 把 useEffect 当作 ngOnInit

```tsx
// ❌ 错误：依赖项为空但使用外部变量
function User({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);  // 使用了 userId 但没声明
  }, []);  // ❌ 依赖数组为空，userId 永远是初始值

  // ✅ 正确：声明所有依赖
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);  // ✅ 声明 userId 依赖
}
```

#### 陷阱 2: 过度使用 useEffect

```tsx
// ❌ 不必要的 useEffect
const [count, setCount] = useState(0);
const [doubled, setDoubled] = useState(0);

useEffect(() => {
  setDoubled(count * 2);
}, [count]);

// ✅ 直接计算派生状态
const [count, setCount] = useState(0);
const doubled = count * 2;
```

#### 陷阱 3: 忘记 key 属性

```tsx
// ❌ 错误：没有 key
{users.map(user => <UserCard user={user} />)}

// ✅ 正确：添加稳定的 key
{users.map(user => <UserCard key={user.id} user={user} />)}
```

### 8.5 迁移建议

**第一阶段（1-2天）：**
- 理解 JSX 和组件概念
- 学习 useState 和基础 Hooks
- 理解 props 和 children

**第二阶段（2-3天）：**
- 深入 useEffect 和依赖数组
- 学习自定义 Hooks
- 理解 React 的渲染机制

**第三阶段（3-4天）：**
- 状态管理（Context 或 Zustand）
- 表单处理（React Hook Form + Zod）
- 路由（React Router）

**第四阶段（4-5天）：**
- 性能优化（useMemo, useCallback, React.memo）
- 实战项目
- 对比 Angular 和 React 的最佳实践

---

## 9. IKM React.js 考试重点预测

> "基于 Angular 背景和项目经验，以下是 IKM React.js 考试可能涉及的重点领域。"

### 9.1 Hooks 相关（权重：40%）

#### 必考知识点：

**1. useEffect 的依赖数组**
```tsx
// 问题：这段代码会有什么问题？
useEffect(() => {
  fetchData(userId);
}, []);  // ❌ 缺少 userId 依赖

// 答案：闭包陷阱，userId 永远是初始值
```

**2. useState 的函数式更新**
```tsx
// 问题：count 会变成多少？
setCount(count + 1);
setCount(count + 1);

// 答案：count + 1（两次都读取同一个旧值）
// 解决方案：setCount(c => c + 1)
```

**3. 自定义 Hooks 的命名规范**
- 必须以 "use" 开头
- 用于复用状态逻辑

**4. Hooks 的规则**
- 只能在顶层调用
- 只能在 React 函数中调用
- 原理：依赖调用顺序

### 9.2 状态管理（权重：25%）

**1. Context vs Redux vs Zustand**
- Context 的适用场景：主题、语言、用户信息
- Context 不适用：频繁变化的状态
- Redux 的单向数据流
- Zustand 的简洁 API

**2. Provider 模式**
```tsx
// 创建 Context
const ThemeContext = createContext('light');

// 提供 Context
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 消费 Context
const theme = useContext(ThemeContext);
```

### 9.3 性能优化（权重：20%）

**1. React.memo 的使用**
```tsx
const MemoComponent = React.memo(({ name }) => {
  return <div>{name}</div>;
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.name === nextProps.name;
});
```

**2. useMemo 和 useCallback**
- useMemo 缓存计算结果
- useCallback 缓存函数引用
- 何时使用：配合 React.memo 或作为其他 Hook 的依赖

**3. Key 属性的重要性**
- 必须使用稳定的、唯一的 key
- 避免 index 作为 key（除非列表是静态的）

### 9.4 表单处理（权重：10%）

**1. 受控组件 vs 非受控组件**
```tsx
// 受控组件
<input value={value} onChange={e => setValue(e.target.value)} />

// 非受控组件
const inputRef = useRef();
<input ref={inputRef} />
```

**2. React Hook Form**
```tsx
const { register, handleSubmit, formState: { errors } } = useForm();
```

### 9.5 TypeScript 集成（权重：5%）

**1. Props 类型定义**
```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

**2. 泛型组件**
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

---

**祝你面试顺利！记住：自信地讲你的故事，面试官更看重你的思考过程和解决问题的能力，而不是背诵标准答案。**
