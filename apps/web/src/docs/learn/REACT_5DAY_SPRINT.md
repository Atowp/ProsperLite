# React 五天冲刺计划（Angular 开发者版 + IKM 考试定向）

> **目标**：从 Angular 背景出发，在 5 天内掌握 React 核心概念，**重点攻克 IKM 考试高频考点**。

## IKM 考试高频考点（必看）

根据历年 IKM React.js 考试数据分析，以下是最常考的知识点：

| 考点                                      | 出题频率   | 难度  | Day   |
| ----------------------------------------- | ---------- | ----- | ----- |
| **useEffect 依赖数组**                    | ⭐⭐⭐⭐⭐ | 中-高 | Day 2 |
| **useState 函数式更新**                   | ⭐⭐⭐⭐⭐ | 中    | Day 2 |
| **Hooks 规则**                            | ⭐⭐⭐⭐⭐ | 低    | Day 2 |
| **React.memo + useMemo + useCallback**    | ⭐⭐⭐⭐   | 高    | Day 3 |
| **闭包陷阱**                              | ⭐⭐⭐⭐   | 高    | Day 2 |
| **React 渲染机制（key, reconciliation）** | ⭐⭐⭐⭐   | 中    | Day 1 |
| **React 18 自动批处理**                   | ⭐⭐⭐     | 中    | Day 2 |
| **事件处理**                              | ⭐⭐⭐     | 低    | Day 1 |
| **Context API**                           | ⭐⭐⭐     | 中    | Day 4 |
| **React 原理（Virtual DOM）**             | ⭐⭐⭐     | 高    | Day 1 |

> **考试策略**：重点掌握标⭐⭐⭐⭐的考点，这些题目占了IKM考试的60%以上。

---

## 学习路径概览

```
Day 1: React 基础 + JSX → 组件与 Props + React 渲染原理（IKM基础）
Day 2: useState + useEffect → Hooks 深度理解 + IKM必考5大陷阱
Day 3: 性能优化 → React.memo + useMemo + useCallback（IKM高频）
Day 4: Context API → Redux Toolkit → Zustand → 三者选择策略
Day 5: React Router + 完整应用 → IKM 模拟题实战
```

---

# Day 1: React 基础与 JSX（6小时）

## 上午：React 核心概念与心智转换（3小时）

### 1.1 React vs Angular：框架哲学对比（30分钟）

**Angular 的思维方式：**

- 完整框架提供所有解决方案
- 依赖注入管理服务
- RxJS Observable 处理异步
- NgModules 组织代码
- Zone.js 自动检测变化

**React 的思维方式：**

- 库而非框架，只负责视图层
- 组件组合优于继承
- 单向数据流
- JSX 让 JavaScript 更强大
- 手动声明依赖（Hooks）

**关键认知转换：**

| Angular                               | React                                                     | 思维转换         |
| ------------------------------------- | --------------------------------------------------------- | ---------------- |
| `*ngIf`                               | `{condition && <div/>}`                                   | 条件是 JS 表达式 |
| `*ngFor`                              | `{items.map(item => <li key={item.id}>{item.name}</li>)}` | 用 JS 数组方法   |
| `[class.active]="isActive"`           | `className={isActive ? 'active' : ''}`                    | 字符串拼接       |
| `(click)="handleClick()"`             | `onClick={handleClick}`                                   | 函数引用，不调用 |
| `{{ value }}`                         | `{value}`                                                 | JS 表达式插值    |
| `@Input() userId`                     | `function User({ userId })`                               | 函数参数         |
| `@Output() emit = new EventEmitter()` | `props.onEmit()`                                          | 回调函数         |
| `ngOnInit()`                          | `useEffect(() => {}, [])`                                 | Hooks 依赖数组   |
| `ngOnDestroy()`                       | `useEffect(() => { return cleanup }, [])`                 | 返回清理函数     |
| `BehaviorSubject`                     | `useState` + 选择器                                       | 状态快照         |

### 1.2 JSX 深度解析（1小时）

#### 什么是 JSX？

```tsx
// JSX 只是 React.createElement 的语法糖
const element = <h1>Hello, world!</h1>;

// 编译后
const element = React.createElement("h1", null, "Hello, world!");
```

#### JSX 核心规则

**规则 1: 只能有一个根元素**

```tsx
// ❌ 错误：多个根元素
function Component() {
  return (
    <div>First</div>
    <div>Second</div>
  );
}

// ✅ 方案 1: Fragment（React 19+ 可以省略外层标签）
function Component() {
  return (
    <>
      <div>First</div>
      <div>Second</div>
    </>
  );
}

// ✅ 方案 2: div 包裹
function Component() {
  return (
    <div>
      <div>First</div>
      <div>Second</div>
    </div>
  );
}
```

**规则 2: 所有标签必须闭合**

```tsx
// ❌ 错误
<input>
<br>
<img>

// ✅ 正确
<input />
<br />
<img />
```

**规则 3: 使用 camelCase 命名属性**

```tsx
// HTML
<div class="container" onclick="handleClick()">

// JSX
<div className="container" onClick={handleClick}>
```

**规则 4: 内联样式是对象**

```tsx
// ❌ 错误：字符串
<div style="color: red; margin: 10px;">

// ✅ 正确：对象
<div style={{ color: 'red', margin: 10 }}>

// 为什么是两个花括号？
// 外层 {} = JSX 表达式
// 内层 {} = JavaScript 对象
```

**规则 5: 属性名转换**

| HTML 属性  | JSX 属性    | 说明               |
| ---------- | ----------- | ------------------ |
| `class`    | `className` | class 是 JS 保留字 |
| `for`      | `htmlFor`   | for 是 JS 保留字   |
| `tabindex` | `tabIndex`  | camelCase          |
| `readonly` | `readOnly`  | camelCase          |
| ` colspan` | `colSpan`   | camelCase          |

**规则 6: 布尔属性**

```tsx
// Angular
<button [disabled]="isDisabled">Click</button>

// React
<button disabled={isDisabled}>Click</button>
// 或简写
<button disabled={!canEdit}>Click</button>
```

**规则 7: 条件渲染**

```tsx
// Angular
<div *ngIf="isVisible">Content</div>

// React - 方案 1: &&
{isVisible && <div>Content</div>}

// React - 方案 2: 三元表达式
{isVisible ? <div>Content</div> : null}

// React - 方案 3: 立即执行函数（复杂逻辑）
{(() => {
  if (type === 'A') return <ComponentA />;
  if (type === 'B') return <ComponentB />;
  return <ComponentC />;
})()}
```

**规则 8: 列表渲染**

```tsx
// Angular
<li *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</li>

// React
{items.map(item => (
  <li key={item.id}>
    {item.name}
  </li>
))}

// 为什么需要 key？
// - React 用 key 来识别哪些元素改变了
// - 必须是稳定、唯一、不变的
// - 避免 index 作为 key（除非列表是静态的）

// ❌ 错误：用 index 作为 key（动态列表）
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// ✅ 正确：用唯一 ID
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

### 1.3 组件定义（1小时）

#### 函数组件 vs 类组件

```tsx
// 类组件（旧方式，不推荐）
class UserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <div>{this.props.name}</div>;
  }
}

// 函数组件（推荐）
function UserComponent({ name }: { name: string }) {
  return <div>{name}</div>;
}

// 箭头函数
const UserComponent = ({ name }: { name: string }) => {
  return <div>{name}</div>;
};

// 隐式返回（单行）
const UserComponent = ({ name }: { name: string }) => <div>{name}</div>;
```

**为什么函数组件更好？**

- 更简洁，没有 this 绑定问题
- Hooks 让状态管理更简单
- 更容易进行代码优化和压缩
- React 19+ 官方推荐

## 下午：Props、State 与事件处理（3小时）

### 1.4 Props 深度理解（1.5小时）

#### Props 是什么？

- Props = Properties（属性）
- 父组件向子组件传递数据
- **单向数据流**，只读不能修改

#### Props 的使用

```tsx
// 定义 Props 类型
interface UserCardProps {
  name: string;
  age?: number; // 可选
  onUpdate?: (newName: string) => void; // 回调函数
  children?: React.ReactNode; // 子元素
}

// 使用 Props
function UserCard({ name, age, onUpdate, children }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      {children}
      <button onClick={() => onUpdate?.("New Name")}>Update</button>
    </div>
  );
}

// 父组件使用
function App() {
  const handleUpdate = (newName: string) => {
    console.log("Updated:", newName);
  };

  return (
    <UserCard name="Alice" age={30} onUpdate={handleUpdate}>
      <p>This is children content</p>
    </UserCard>
  );
}
```

#### Props 解构与默认值

```tsx
// 解构赋值
function Button({ text, onClick, variant = "primary" }: ButtonProps) {
  // ...
}

// rest parameters
function Card({ title, ...rest }: CardProps) {
  return <div {...rest}>{title}</div>;
}

// TypeScript 默认值
interface Props {
  count: number;
  step?: number;
}

function Counter({ count, step = 1 }: Props) {
  // ...
}
```

#### children Props

```tsx
// 特殊的 children prop
function Container({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>;
}

// 使用
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>;

// React 19+ 可以用 slots
interface ContainerProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function Container({ header, children, footer }: ContainerProps) {
  return (
    <div>
      {header}
      <main>{children}</main>
      {footer}
    </div>
  );
}
```

#### Props 只读原则

```tsx
// ❌ 错误：修改 props
function UserCard({ name }: { name: string }) {
  name = "New Name"; // ❌ 不能修改 props
  return <div>{name}</div>;
}

// ✅ 正确：使用 state
function UserCard({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  return <div>{name}</div>;
}
```

### 1.5 事件处理（1.5小时）

#### 事件命名差异

```tsx
// Angular
<button (click)="handleClick($event)">
<input (input)="onInput($event)">

// React
<button onClick={handleClick}>
<input onInput={onInput}>  // 或 onChange
```

#### 常见事件列表

| 事件类型 | Angular 事件                    | React 事件                      |
| -------- | ------------------------------- | ------------------------------- |
| 点击     | `(click)`                       | `onClick`                       |
| 输入     | `(input)` / `(ngModelChange)`   | `onChange` / `onInput`          |
| 提交     | `(ngSubmit)`                    | `onSubmit`                      |
| 焦点     | `(focus)` / `(blur)`            | `onFocus` / `onBlur`            |
| 悬停     | `(mouseenter)` / `(mouseleave)` | `onMouseEnter` / `onMouseLeave` |
| 键盘     | `(keydown)` / `(keyup)`         | `onKeyDown` / `onKeyUp`         |

#### 事件处理函数

```tsx
// ❌ 错误：调用函数
<button onClick={handleClick()}>

// ✅ 正确：传递函数引用
<button onClick={handleClick}>

// ✅ 正确：箭头函数
<button onClick={() => handleClick(id)}>

// ❌ 错误：箭头函数（每次渲染都是新函数）
<button onClick={() => console.log('clicked')}>

// ✅ 正确：useCallback（Day 3 详解）
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

#### 事件对象

```tsx
function InputField() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // 输入的值
    console.log(e.target.name); // 元素的 name 属性
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认行为（表单提交）
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" onChange={handleChange} />
    </form>
  );
}
```

#### 事件对象类型速查

```typescript
// Clipboard Events
React.ClipboardEvent<T>;

// Composition Events
React.CompositionEvent<T>;

// Drag Events
React.DragEvent<T>;

// Focus Events
React.FocusEvent<T>;

// Form Events
React.FormEvent<T>;

// Keyboard Events
React.KeyboardEvent<T>;

// Mouse Events
React.MouseEvent<T>;

// Pointer Events
React.PointerEvent<T>;

// Touch Events
React.TouchEvent<T>;

// UI Events
React.UIEvent<T>;

// Wheel Events
React.WheelEvent<T>;

// Animation Events
React.AnimationEvent<T>;

// Transition Events
React.TransitionEvent<T>;
```

### 1.6 React 渲染原理与 key 的作用（IKM高频⭐⭐⭐⭐）（1小时）

#### Virtual DOM 和 Reconciliation

```tsx
// React 的渲染流程：
// 1. 初次渲染：JSX → Virtual DOM → 真实 DOM
// 2. 状态更新：新的 Virtual DOM → Diff 算法 → 最小化 DOM 操作

// Diff 算法的核心原则：
// 1. 不同类型的元素 → 替换整个树
// 2. 相同类型的元素 → 只更新属性
// 3. 子元素列表 → 通过 key 识别子元素的变化
```

#### 为什么 key 是必需的？（IKM必考）

```tsx
// ❌ 错误：使用 index 作为 key
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          <input type="checkbox" checked={todo.completed} />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// 问题场景：
// 初始状态：todos = [{id: 1, text: 'A', completed: false}, {id: 2, text: 'B', completed: false}]
// 删除第一个后：todos = [{id: 2, text: 'B', completed: false}]

// 使用 index:
// - 删除前：<li key=0>A</li>, <li key=1>B</li>
// - 删除后：<li key=0>B</li>
// - React 认为 key=0 的元素只是改了文本，会保留它的状态（比如焦点、输入内容）
// - 导致状态错乱

// ✅ 正确：使用稳定的唯一 ID
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// 使用 id:
// - 删除前：<li key=1>A</li>, <li key=2>B</li>
// - 删除后：<li key=2>B</li>
// - React 发现 key=1 消失了，key=2 还在
// - 正确地只删除 A，保留 B 的状态
```

#### key 的 IKM 考题示例

**题目：以下哪个关于 key 的说法是正确的？**

- A. key 必须是全局唯一的
- B. 使用 index 作为 key 总是安全的
- C. key 应该是稳定、唯一、不变的
- D. key 只在列表中使用

**答案：C**

> **记忆口诀**：key=身份证号，不是座位号

#### React 的渲染时机（IKM中频）

```tsx
// React 何时重新渲染组件？

// 1. state 改变
function Counter() {
  const [count, setCount] = useState(0);
  setCount(1); // 触发重新渲染
}

// 2. props 改变
function Child({ value }) {
  // 父组件重新渲染，Child 的 props 变化时，Child 重新渲染
}

// 3. context 改变
function Component() {
  const value = useContext(MyContext);
  // context 变化时，所有消费者重新渲染
}

// 4. forceUpdate（类组件，不推荐）

// ❌ 以下情况不会触发重新渲染：
// - 修改 state 的属性（直接修改对象/数组）
// - 调用普通函数
// - 修改局部变量

// ❌ 错误示例
function Counter() {
  const [user, setUser] = useState({ name: "Alice" });

  const handleClick = () => {
    user.name = "Bob"; // 直接修改对象
    setUser(user); // 引用没变，React 不会重新渲染
  };
}

// ✅ 正确示例
function Counter() {
  const [user, setUser] = useState({ name: "Alice" });

  const handleClick = () => {
    setUser({ ...user, name: "Bob" }); // 创建新对象
  };
}
```

### 1.7 React 18 特性（30分钟）

#### 自动批处理（Automatic Batching）

```tsx
// React 18 之前：只在事件处理器中批处理
function handleClick() {
  setCount(1); // 批处理
  setName("Alice"); // 批处理
  // 只触发一次重新渲染
}

fetchData().then(() => {
  setCount(2); // 不批处理（React 17）
  setName("Bob"); // 不批处理
  // 触发两次重新渲染
});

// React 18+: 自动批处理所有更新
fetchData().then(() => {
  setCount(2); // 批处理
  setName("Bob"); // 批处理
  // 只触发一次重新渲染
});

// 退出批处理（不常用）
import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => {
    setCount(2); // 立即更新
  });
  setName("Bob"); // 另一次更新
  // 触发两次重新渲染
}
```

#### 并发渲染（Concurrent Rendering）

```tsx
// React 18 的并发特性让 React 可以：
// 1. 中断渲染
// 2. 优先处理高优先级更新
// 3. 避免阻塞用户交互

// useTransition：标记低优先级更新
function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 高优先级：立即更新输入框
    setQuery(e.target.value);

    // 低优先级：延迟更新搜索结果
    startTransition(() => {
      setResults(search(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultsList items={results} />}
    </div>
  );
}

// useDeferredValue：延迟更新值
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);

  // 只有在 query 停止变化一段时间后，才重新渲染列表
  const results = useMemo(() => search(deferredQuery), [deferredQuery]);

  return <ResultsList items={results} />;
}
```

---

## 今日练习（Day 1）

### 练习 1: JSX 转换（IKM基础题）

将以下 Angular 模板转换为 React JSX：

```html
<!-- Angular -->
<div *ngIf="user">
  <h1 [class.admin]="user.isAdmin">{{ user.name }}</h1>
  <ul>
    <li
      *ngFor="let item of items; trackBy: trackById"
      [class.active]="item.active"
    >
      {{ item.name }}
    </li>
  </ul>
  <button (click)="handleClick()" [disabled]="isLoading">Submit</button>
</div>
```

<details>
<summary>查看答案</summary>

```tsx
// React
{
  user && (
    <div>
      <h1 className={user.isAdmin ? "admin" : ""}>{user.name}</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.active ? "active" : ""}>
            {item.name}
          </li>
        ))}
      </ul>
      <button onClick={handleClick} disabled={isLoading}>
        Submit
      </button>
    </div>
  );
}
```

</details>

### 练习 2: 组件 Props

创建一个 `ProductCard` 组件：

```tsx
// 要求：
// - 接收 name, price, image, onAddToCart props
// - price 是可选的，默认显示 0
// - onAddToCart 是回调函数
// - 显示产品信息和一个添加按钮

interface ProductCardProps {
  // TODO: 定义类型
}

function ProductCard(props: ProductCardProps) {
  // TODO: 实现组件
}
```

---

# Day 2: useState 与 useEffect 深度（8小时）⭐⭐⭐⭐⭐ IKM必考日

> **今天重点**：Day 2 覆盖了 IKM 考试 **40% 以上**的考点，务必深度理解。

## IKM 必考5大陷阱预告

1. **useEffect 依赖数组陷阱**（⭐⭐⭐⭐⭐）
2. **useState 函数式更新陷阱**（⭐⭐⭐⭐⭐）
3. **闭包陷阱**（⭐⭐⭐⭐⭐）
4. **异步状态更新陷阱**（⭐⭐⭐⭐）
5. **Hooks 规则陷阱**（⭐⭐⭐⭐⭐）

---

## 上午：useState 完全掌握（4小时）

### 2.1 useState 基础（1小时）

#### useState 是什么？

- useState 是 React Hook，用于在函数组件中添加状态
- 返回一个数组：[当前状态, 更新函数]

#### useState 基本用法

```tsx
// 语法
const [state, setState] = useState(initialState);

// 示例 1: 数字状态
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// 示例 2: 字符串状态
function TextInput() {
  const [text, setText] = useState("");

  return (
    <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
  );
}

// 示例 3: 对象状态
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
    </form>
  );
}

// 示例 4: 数组状态
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, text]);
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}
```

### 2.2 useState 函数式更新（IKM必考⭐⭐⭐⭐⭐）（1小时）

> **考试必考点**：IKM 几乎每次都会考连续更新状态的问题

#### 为什么需要函数式更新？（必考原理）

```tsx
// ❌ 问题：连续更新可能丢失状态
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // 读取当前 render 的 count
    setCount(count + 1); // 还是读取同一个 count
    // 结果：count 只增加了 1
  };

  return <button onClick={handleClick}>{count}</button>;
}

// ✅ 解决方案：函数式更新
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1); // c 是最新的 state
    setCount((c) => c + 1); // 每次都基于最新的值
    // 结果：count 增加了 2
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

#### 函数式更新的适用场景

1. **连续更新状态**

```tsx
const incrementThreeTimes = () => {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
};
```

2. **基于旧状态计算新状态**

```tsx
const [filters, setFilters] = useState({ keyword: "", type: "all" });

const addFilter = (key: string, value: string) => {
  setFilters((f) => ({ ...f, [key]: value })); // 使用函数式更新
};
```

3. **在异步操作中更新状态**

```tsx
const fetchDataAndUpdate = async () => {
  const data = await api.getData();
  setData((d) => [...d, ...data]); // 确保 d 是最新值
};
```

### 2.3 状态更新是异步的（1小时）

#### 理解批处理（Batching）

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const handleClick = () => {
    setCount(1);
    setName("Alice");
    console.log(count, name); // 仍然是 0, ''
  };

  // React 会批处理这些更新：
  // 1. 所有 setState 调用完成后
  // 2. 才会触发重新渲染
}
```

#### React 18 自动批处理

```tsx
// React 18 之前：只在事件处理器中批处理
function handleClick() {
  setCount(1); // 批处理
  setName("Alice"); // 批处理
}

fetchData().then(() => {
  setCount(2); // 不批处理（React 17）
  setName("Bob"); // 不批处理
});

// React 18+: 自动批处理所有更新
fetchData().then(() => {
  setCount(2); // 批处理
  setName("Bob"); // 批处理
});
```

### 2.4 状态不可变性（Immutability）（1小时）

#### 为什么需要保持不可变性？

- React 使用 `Object.is()` 比较状态
- 如果状态引用没变，React 不会重新渲染
- 直接修改对象/数组，React 检测不到变化

#### 数组的不可变操作

```tsx
// ❌ 错误：直接修改数组
const addItem = (item: string) => {
  todos.push(item); // 直接修改
  setTodos(todos); // 引用没变，React 不会重新渲染
};

// ✅ 正确：创建新数组
const addItem = (item: string) => {
  setTodos([...todos, item]); // 展开运算符
};

// 常见数组操作

// 添加
setTodos([...todos, newItem]);

// 在开头添加
setTodos([newItem, ...todos]);

// 删除
setTodos(todos.filter((t) => t.id !== id));

// 更新
setTodos(todos.map((t) => (t.id === id ? { ...t, name: newName } : t)));

// 排序（创建新数组）
setTodos([...todos].sort((a, b) => a.name.localeCompare(b.name)));
```

#### 对象的不可变操作

```tsx
// ❌ 错误：直接修改对象
const updateName = (name: string) => {
  user.name = name; // 直接修改
  setUser(user); // 引用没变
};

// ✅ 正确：创建新对象
const updateName = (name: string) => {
  setUser({ ...user, name }); // 对象展开
};

// 嵌套对象
const [user, setUser] = useState({
  name: "Alice",
  address: {
    city: "Beijing",
    street: "Main St",
  },
});

// ❌ 错误
setUser({
  ...user,
  address: { city: "Shanghai" }, // 丢失了 street
});

// ✅ 正确
setUser({
  ...user,
  address: {
    ...user.address,
    city: "Shanghai",
  },
});
```

#### 使用 Immer 简化不可变更新

```tsx
import { useImmer } from "use-immer"; // 或 Zustand 的 immer 中间件

function UserForm() {
  const [user, setUser] = useImmer({
    name: "Alice",
    address: {
      city: "Beijing",
      street: "Main St",
    },
  });

  const updateCity = (city: string) => {
    setUser((draft) => {
      draft.address.city = city; // 可以直接修改！
    });
  };

  return <div>{user.address.city}</div>;
}
```

## 下午：useEffect 完全掌握（4小时）⭐⭐⭐⭐⭐

> **useEffect 是 IKM 考试的重灾区**，务必深度理解每一个细节

### 2.5 useEffect 基础（1小时）

#### useEffect 是什么？

- useEffect 用于处理副作用（Side Effects）
- 副作用包括：数据获取、订阅、DOM 操作、日志等
- 替代类组件的 componentDidMount, componentDidUpdate, componentWillUnmount

#### useEffect 基本语法（IKM必考）

```tsx
// 语法
useEffect(setup, dependencies?)

// 示例 1: 每次渲染后执行
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component rendered');
  });  // 没有依赖数组 = 每次渲染后执行

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// 示例 2: 只在挂载时执行一次（相当于 componentDidMount）
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);  // 空依赖数组 = 只执行一次

  return user ? <div>{user.name}</div> : <Loading />;
}

// 示例 3: 监听特定状态变化
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      search(query).then(setResults);
    }
  }, [query]);  // query 变化时执行

  return <div>{results.map(r => <div key={r.id}>{r.title}</div>)}</div>;
}

// 示例 4: 清理副作用（相当于 componentWillUnmount）
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // 返回清理函数
    return () => clearInterval(interval);
  }, []);  // 空依赖数组

  return <div>{seconds}</div>;
}
```

### 2.6 useEffect 依赖数组深度理解（2小时）

#### 依赖数组的比较机制

```tsx
// React 使用 Object.is() 比较依赖

useEffect(() => {
  console.log("Effect runs");
}, [value]); // value 变化时运行

// Object.is() 示例
Object.is(1, 1); // true
Object.is("a", "a"); // true
Object.is({}, {}); // false（不同引用）
Object.is([], []); // false（不同引用）
Object.is(NaN, NaN); // true
```

#### 依赖数组常见陷阱

**陷阱 1: 依赖对象/数组**

```tsx
// ❌ 错误：对象字面量每次都是新引用
useEffect(() => {
  search({ keyword: "test" });
}, [{ keyword: "test" }]); // 每次渲染都是新对象，无限循环

// ✅ 方案 1: 移到组件外
const SEARCH_PARAMS = { keyword: "test" };

useEffect(() => {
  search(SEARCH_PARAMS);
}, [SEARCH_PARAMS]);

// ✅ 方案 2: 使用 useMemo
const params = useMemo(() => ({ keyword: "test" }), []);

useEffect(() => {
  search(params);
}, [params]);

// ✅ 方案 3: 如果值是固定的，移除依赖
useEffect(() => {
  search({ keyword: "test" });
}, []); // 值不会变化，不需要依赖
```

**陷阱 2: 依赖函数**

```tsx
// ❌ 错误：函数每次都是新引用
function Component({ id }) {
  const fetchData = () => {
    api.get(`/items/${id}`).then(setData);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData 每次都是新的，无限循环
}

// ✅ 方案 1: 把函数移到 effect 内
useEffect(() => {
  const fetchData = () => {
    api.get(`/items/${id}`).then(setData);
  };
  fetchData();
}, [id]);

// ✅ 方案 2: 使用 useCallback
const fetchData = useCallback(() => {
  api.get(`/items/${id}`).then(setData);
}, [id]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

**陷阱 3: 闭包陷阱**

```tsx
// ❌ 错误：闭包陷阱
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 永远是 0
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 依赖数组为空，count 永远是初始值

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ 方案 1: 添加依赖
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(timer);
}, [count]); // 添加 count 依赖

// ✅ 方案 2: 使用 useRef（适用于不想因为值变化重新创建 effect）
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 保持 ref 同步
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current); // 总是最新的值
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2.8 IKM 必考：useEffect 陷阱专题（⭐⭐⭐⭐⭐）

#### 陷阱 1: useEffect 不能直接使用 async 函数（必考）

```tsx
// ❌ 错误：useEffect 不能直接使用 async
useEffect(async () => {
  const data = await fetchData();
  setState(data);
}, []);

// 错误原因：
// useEffect 的回调函数应该返回清理函数或 undefined
// async 函数返回 Promise，不是清理函数

// ✅ 方案 1: 在 effect 内部定义 async 函数
useEffect(() => {
  async function fetchData() {
    const data = await fetch("/api/data");
    setState(data);
  }
  fetchData();
}, []);

// ✅ 方案 2: 使用 IIFE（立即执行函数）
useEffect(() => {
  (async () => {
    const data = await fetch("/api/data");
    setState(data);
  })();
}, []);

// ✅ 方案 3: 提取为独立函数（推荐）
useEffect(() => {
  fetchData().then(setState);
}, []);
```

#### 陷阱 2: 无限循环（必考）

```tsx
// ❌ 陷阱 2.1: 依赖对象/数组
useEffect(() => {
  search({ keyword: "test" });
}, [{ keyword: "test" }]); // 每次都是新对象，无限循环

// ❌ 陷阱 2.2: 依赖函数
function Component({ id }) {
  const fetchData = () => {
    /*...*/
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData 每次都是新函数，无限循环
}

// ❌ 陷阱 2.3: 在 effect 中更新依赖的状态
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // 更新 count
  }, [count]); // 依赖 count，导致无限循环
}
```

#### 陷阱 3: 依赖数组为空 vs 省略依赖数组（必考）

```tsx
// 场景 1: 省略依赖数组
useEffect(() => {
  console.log("每次渲染后都执行");
});
// 等价于 componentDidMount + componentDidUpdate

// 场景 2: 空依赖数组
useEffect(() => {
  console.log("只在挂载时执行一次");
}, []);
// 等价于 componentDidMount

// ⚠️ IKM 考题示例：
// 问题：以下代码会执行几次 console.log？
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect");
  }); // 没有依赖数组

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// 答案：每次点击按钮，组件重新渲染，effect 都会执行
// 初始渲染：1次
// 点击1次：1次
// 点击10次：10次
```

#### IKM 模拟题：useEffect

**题目 1：以下 useEffect 的使用哪个是正确的？**

```tsx
// A.
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, [id]);

// B.
useEffect(() => {
  fetchData().then((data) => setData(data));
}, [id]);

// C.
useEffect(async () => {
  const data = await fetchData(id);
}, [id]);

// D.
useEffect(fetchData(), [id]);
```

<details>
<summary>查看答案</summary>

**答案：B**

解析：

- A：❌ useEffect 不能直接使用 async 函数
- B：✅ 正确，使用 Promise.then()
- C：❌ async 函数返回 Promise，且没有处理数据
- D：❌ 立即执行函数语法错误，应该是 `() => fetchData()`

</details>

**题目 2：以下代码的输出是什么？**

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect");
    setCount(count + 1);
  }, []);

  return <div>{count}</div>;
}
```

- A. 无限循环
- B. 输出一次 "effect"，count 为 1
- C. 输出两次 "effect"，count 为 2
- D. 输出 "effect"，count 为 0

<details>
<summary>查看答案</summary>

**答案：B**

解析：

1. 组件首次渲染，count = 0
2. useEffect 执行（因为依赖数组为空，只执行一次）
3. 输出 "effect"
4. setCount(0 + 1)，触发重新渲染
5. 组件第二次渲染，count = 1
6. useEffect 不再执行（依赖数组为空）
7. 最终：count = 1，effect 执行 1 次

</details>

### 2.9 Hooks 规则（IKM必考⭐⭐⭐⭐⭐）

#### Hooks 的两条黄金规则

```tsx
// 规则 1: 只在 React 函数的顶层调用 Hooks
// ❌ 错误：在条件语句中调用
function Component() {
  const [data, setData] = useState(null);
  if (data) {
    const [count, setCount] = useState(0); // ❌ 违反规则
  }
}

// ❌ 错误：在循环中调用
function Component() {
  const items = [1, 2, 3];
  items.forEach((item) => {
    const [value, setValue] = useState(item); // ❌ 违反规则
  });
}

// ❌ 错误：在嵌套函数中调用
function Component() {
  const handleClick = () => {
    const [count, setCount] = useState(0); // ❌ 违反规则
  };
}

// ✅ 正确：始终在顶层调用
function Component() {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);

  if (data) {
    // 条件逻辑放在 Hook 调用之后
  }
}

// 规则 2: 只在 React 函数中调用 Hooks
// ❌ 错误：在普通 JavaScript 函数中调用
function getData() {
  const [data, setData] = useState(null); // ❌ 违反规则
}

// ✅ 正确：在 React 组件或自定义 Hook 中调用
function useCustomHook() {
  const [data, setData] = useState(null); // ✅ 正确
  return data;
}

// ✅ 正确：在 React 组件中调用
function Component() {
  const [data, setData] = useState(null); // ✅ 正确
}
```

#### 为什么要遵循 Hooks 规则？

```tsx
// React 靠 Hook 调用的顺序来识别状态
// 示例：违反规则导致的问题

function Form() {
  // 1. useState
  const [name, setName] = useState("Alice");

  // 2. 条件语句
  if (name !== "") {
    // ❌ 违反规则：在条件中调用 Hook
    const [email, setEmail] = useState("");
  }

  // 3. useEffect
  useEffect(() => {
    console.log("effect");
  }, []);
}

// 第一次渲染（name = 'Alice'）：
// Hook 顺序：useState(name) → useState(email) → useEffect
// Hook 索引：0 → 1 → 2

// 第二次渲染（name = ''）：
// Hook 顺序：useState(name) → useEffect
// Hook 索引：0 → 1（❌ 错位！useState(email) 被跳过）

// React 认为：
// - Hook 0: useState(name) ✓
// - Hook 1: useState(email) → 实际是 useEffect ❌
// - Hook 2: useEffect → 不存在 ❌

// 结果：状态混乱，报错
```

#### IKM 考题示例

**题目：以下哪些 Hooks 的使用是正确的？（多选）**

```tsx
// A.
function Component() {
  const [count, setCount] = useState(0);
  if (count > 0) {
    useEffect(() => {
      console.log(count);
    }, []);
  }
}

// B.
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count > 0) {
      console.log(count);
    }
  }, [count]);
}

// C.
function Component() {
  useEffect(() => {
    const [count, setCount] = useState(0);
  }, []);
}

// D.
function Component() {
  const [count, setCount] = useState(0);
  const items = [1, 2, 3];
  items.forEach(() => {
    console.log(count);
  });
}
```

<details>
<summary>查看答案</summary>

**答案：B、D**

解析：

- A：❌ useEffect 在条件语句中调用
- B：✅ useEffect 在顶层，条件逻辑在 effect 内部
- C：❌ useState 在 useEffect 中调用（嵌套函数）
- D：✅ Hooks 在顶层，forEach 在 Hooks 之后调用

</details>

### 2.10 useEffect 最佳实践（1小时）

#### 实践 1: 不要过度使用 useEffect

```tsx
// ❌ 错误：不必要的 useEffect
function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 不必要的 useEffect
  useEffect(() => {
    setFullName(`${name} ${email}`);
  }, [name, email]);

  return <div>{fullName}</div>;
}

// ✅ 正确：直接计算派生状态
function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fullName = `${name} ${email}`; // 直接计算

  return <div>{fullName}</div>;
}
```

#### 实践 2: 分离不同的副作用

```tsx
// ❌ 错误：一个 effect 做多件事
useEffect(() => {
  const timer = setInterval(() => setCount((c) => c + 1), 1000);
  document.title = `Count: ${count}`;
  fetchUser(userId).then(setUser);

  return () => clearInterval(timer);
}, [count, userId]);

// ✅ 正确：每个 effect 做一件事
useEffect(() => {
  const timer = setInterval(() => setCount((c) => c + 1), 1000);
  return () => clearInterval(timer);
}, []);

useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);
```

#### 实践 3: 使用 ESLint 检查依赖

```json
// .eslintrc.json
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 今日练习（Day 2）

### 练习 1: useState 函数式更新

```tsx
// 问题：这个组件有什么问题？如何修复？
function Counter() {
  const [count, setCount] = useState(0);

  const incrementThreeTimes = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={incrementThreeTimes}>Count: {count}</button>;
}
```

<details>
<summary>查看答案</summary>

```tsx
// 问题：三次都读取同一个 count 值
// 解决方案：使用函数式更新

function Counter() {
  const [count, setCount] = useState(0);

  const incrementThreeTimes = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return <button onClick={incrementThreeTimes}>Count: {count}</button>;
}
```

</details>

### 练习 2: useEffect 依赖数组

```tsx
// 问题：这个 useEffect 会产生什么问题？
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return user ? <div>{user.name}</div> : <Loading />;
}
```

<details>
<summary>查看答案</summary>

```tsx
// 问题：loadUser 每次渲染都是新函数，导致无限循环

// 方案 1: 把函数移到 effect 内
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then(setUser);
    };
    loadUser();
  }, [userId]); // 只依赖 userId

  return user ? <div>{user.name}</div> : <Loading />;
}

// 方案 2: 使用 useCallback
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  const loadUser = useCallback(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return user ? <div>{user.name}</div> : <Loading />;
}
```

</details>

---

# Day 3: 自定义 Hooks 与性能优化（8小时）⭐⭐⭐⭐

> **今日重点**：性能优化是 IKM 考试的高频考点，特别是 React.memo、useMemo 和 useCallback 的陷阱

## IKM 必考：性能优化三大工具

| 工具            | 用途             | IKM 频率   | 陷阱等级            |
| --------------- | ---------------- | ---------- | ------------------- |
| **React.memo**  | 跳过组件重新渲染 | ⭐⭐⭐⭐   | 🔥🔥🔥 引用比较陷阱 |
| **useMemo**     | 缓存计算结果     | ⭐⭐⭐⭐   | 🔥🔥 过度使用       |
| **useCallback** | 缓存函数引用     | ⭐⭐⭐⭐⭐ | 🔥🔥🔥🔥 依赖陷阱   |

---

## 上午：自定义 Hooks（4小时）

### 3.1 自定义 Hooks 基础（1小时）

#### 什么是自定义 Hooks？

- 自定义 Hook 是一个函数，名称以 "use" 开头
- 可以调用其他 Hooks
- 用于复用状态逻辑

#### 自定义 Hook 示例

```tsx
// 示例 1: useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// 使用
function App() {
  const [name, setName] = useLocalStorage("name", "");

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// 示例 2: useToggle
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}

// 使用
function Modal() {
  const { value: isOpen, toggle, setTrue: open, setFalse: close } = useToggle();

  return (
    <>
      <button onClick={open}>Open</button>
      {isOpen && (
        <div>
          <p>Modal content</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  );
}
```

### 3.2 常用自定义 Hooks 模式（2小时）

#### 模式 1: 数据获取 Hook

```tsx
// useFetch
interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.statusText);
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, error, loading, refetch: fetch };
}

// 使用
function UserList() {
  const { data: users, error, loading } = useFetch<User[]>("/api/users");

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return (
    <ul>
      {users?.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

#### 模式 2: 表单输入 Hook

```tsx
// useFormInput
function useFormInput<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as T);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, onChange, reset, setValue };
}

// 使用
function LoginForm() {
  const username = useFormInput("");
  const password = useFormInput("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username.value, password.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" {...username} placeholder="Username" />
      <input type="password" {...password} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

#### 模式 3: 响应式检测 Hook

```tsx
// useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 现代浏览器
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// 使用
function ResponsiveLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div className={isMobile ? "mobile" : "desktop"}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  );
}
```

#### 模式 4: 防抖/节流 Hook

```tsx
// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 使用
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 3.3 自定义 Hooks 最佳实践（1小时）

#### 原则 1: 单一职责

```tsx
// ❌ 不好：一个 Hook 做太多事情
function useUserAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ... 很多逻辑
}

// ✅ 好的：拆分成多个 Hook
function useUser() {
  /* ... */
}
function useAuth() {
  /* ... */
}
function useToken() {
  /* ... */
}
```

#### 原则 2: 参数化配置

```tsx
// ❌ 不好：硬编码配置
function useFetch() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/users").then(setData); // 硬编码 URL
  }, []);
}

// ✅ 好的：参数化
function useFetch(url: string, options?: RequestInit) {
  // ...
}
```

#### 原则 3: 返回稳定引用

```tsx
// ❌ 不好：每次返回新对象
function useToggle() {
  const [value, setValue] = useState(false);
  return { value, toggle: () => setValue((v) => !v) }; // toggle 每次都是新的
}

// ✅ 好的：使用 useCallback
function useToggle() {
  const [value, setValue] = useState(false);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return { value, toggle };
}
```

## 下午：性能优化（4小时）⭐⭐⭐⭐ IKM高频

> **警告**：性能优化是 IKM 考试中**陷阱最多**的部分，请仔细阅读每个示例

### 3.4 React.memo（IKM必考⭐⭐⭐⭐）（1.5小时）

#### React.memo 基础

```tsx
// React.memo 是一个高阶组件
// 它会对 props 进行浅比较，如果 props 没变，就不重新渲染

const MemoComponent = React.memo(function Component({
  name,
}: {
  name: string;
}) {
  console.log("Component rendered");
  return <div>{name}</div>;
});

// 使用
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <MemoComponent name="Alice" /> {/* count 变化时不会重新渲染 */}
    </>
  );
}
```

#### React.memo 的比较函数

```tsx
const Component = React.memo(
  function User({ user, onUpdate }: { user: User; onUpdate: () => void }) {
    return (
      <div>
        <h2>{user.name}</h2>
        <button onClick={onUpdate}>Update</button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 返回 true = props 相等，不需要重新渲染
    // 返回 false = props 不同，需要重新渲染

    // 只比较 user.id，不比较整个 user 对象
    return prevProps.user.id === nextProps.user.id;
  }
);
```

#### React.memo 的陷阱

```tsx
// ❌ 陷阱 1: props 是对象/数组，总是返回 false
const Parent = () => {
  const user = { name: "Alice" }; // 每次都是新对象
  return <Child user={user} />;
};

const Child = React.memo(({ user }: { user: { name: string } }) => {
  return <div>{user.name}</div>;
});
// 每次都会重新渲染，因为 user 是新对象

// ✅ 方案 1: 对象定义在组件外
const USER = { name: "Alice" };
const Parent = () => {
  return <Child user={USER} />;
};

// ✅ 方案 2: 使用 useMemo
const Parent = () => {
  const user = useMemo(() => ({ name: "Alice" }), []);
  return <Child user={user} />;
};

// ❌ 陷阱 2: props 是函数，总是返回 false
const Parent = () => {
  const handleClick = () => console.log("clicked"); // 每次都是新函数
  return <Child onClick={handleClick} />;
};

// ✅ 方案: 使用 useCallback
const Parent = () => {
  const handleClick = useCallback(() => console.log("clicked"), []);
  return <Child onClick={handleClick} />;
};
```

#### IKM 必考：React.memo 的陷阱

**陷阱 1: 引用比较问题（超高频）**

```tsx
// ❌ 陷阱：React.memo 对对象/数组进行浅比较
const Parent = () => {
  const user = { name: "Alice" }; // 每次渲染都是新对象
  return <Child user={user} />;
};

const Child = React.memo(({ user }: { user: { name: string } }) => {
  console.log("Child rendered");
  return <div>{user.name}</div>;
});

// 问题：每次 Parent 渲染，user 都是新对象
// React.memo 比较的是引用，不是内容
// { name: 'Alice' } !== { name: 'Alice' }  // true（引用不同）
// 结果：Child 每次都会重新渲染，React.memo 无效

// ✅ 解决方案 1: 对象移到组件外
const USER = { name: "Alice" };

const Parent = () => {
  return <Child user={USER} />; // 始终是同一个对象
};

// ✅ 解决方案 2: 使用 useMemo
const Parent = () => {
  const user = useMemo(() => ({ name: "Alice" }), []);
  return <Child user={user} />;
};

// ✅ 解决方案 3: 使用 useState
const Parent = () => {
  const [user] = useState(() => ({ name: "Alice" }));
  return <Child user={user} />;
};
```

**陷阱 2: 函数 props 问题（超高频）**

```tsx
// ❌ 陷阱：函数每次都是新的
const Parent = () => {
  const handleClick = () => console.log("clicked"); // 每次渲染都是新函数
  return <Child onClick={handleClick} />;
};

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});

// 问题：handleClick 每次都是新函数
// () => console.log('clicked') !== () => console.log('clicked')
// 结果：Child 每次都会重新渲染

// ✅ 解决方案：useCallback
const Parent = () => {
  const handleClick = useCallback(() => console.log("clicked"), []);
  return <Child onClick={handleClick} />;
};
```

#### IKM 模拟题：React.memo

**题目 1：以下哪个组件在使用 React.memo 后会跳过重新渲染？**

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);
  const user = { name: "Alice" };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child user={user} />
    </>
  );
};

const Child = React.memo(({ user }: { user: { name: string } }) => {
  return <div>{user.name}</div>;
});
```

- A. Child 会跳过重新渲染
- B. Child 不会跳过重新渲染
- C. 取决于 count 的值
- D. 取决于 user.name 的值

<details>
<summary>查看答案</summary>

**答案：B**

解析：

- 每次 Parent 渲染，`user = { name: 'Alice' }` 都会创建一个新对象
- React.memo 进行浅比较，发现 user 的引用变化了
- 即使 user.name 的值相同，Child 也会重新渲染
- 修复方法：使用 `useMemo(() => ({ name: 'Alice' }), [])`

</details>

**题目 2：以下代码会输出几次 "Child rendered"？**

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </>
  );
};

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});
```

- A. 0 次
- B. 1 次（初始渲染）
- C. 每次点击 Count 按钮
- D. 无限次

<details>
<summary>查看答案</summary>

**答案：B**

解析：

- handleClick 使用 useCallback 缓存，依赖数组为空
- 每次 Parent 渲染，handleClick 的引用都不变
- React.memo 检测到 onClick 没变，跳过 Child 的重新渲染
- 只在初始渲染时输出 1 次 "Child rendered"

</details>

### 3.5 useMemo（IKM必考⭐⭐⭐⭐）（1.5小时）

#### useMemo 基础

```tsx
// useMemo 缓存计算结果
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 示例 1: 缓存过滤结果
function UserList({ users, filter }: { users: User[]; filter: string }) {
  const filteredUsers = useMemo(() => {
    console.log("Filtering users...");
    return users.filter((u) => u.name.includes(filter));
  }, [users, filter]); // users 或 filter 变化时重新计算

  return (
    <ul>
      {filteredUsers.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

// 示例 2: 缓存排序结果
function SortedList({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

#### useMemo 使用场景

**场景 1: 昂贵的计算**

```tsx
// ✅ 合理使用：计算量大
function Chart({ data }: { data: DataPoint[] }) {
  const processedData = useMemo(() => {
    // 复杂的数据转换
    return data
      .filter((d) => d.value > 0)
      .map((d) => ({
        ...d,
        normalized: d.value / max(data.map((d) => d.value)),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  return <LineChart data={processedData} />;
}
```

**场景 2: 保持引用稳定（避免子组件重新渲染）**

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次都是新对象
  const style = { color: "red", fontSize: "20px" };
  return <Child style={style} />;

  // ✅ 引用稳定
  const style = useMemo(() => ({ color: "red", fontSize: "20px" }), []);
  return <Child style={style} />;
}
```

**场景 3: 作为其他 Hook 的依赖**

```tsx
function Component() {
  const options = useMemo(
    () => ({
      root: document.getElementById("scroll-container"),
      threshold: 0.5,
    }),
    []
  );

  const observer = useMemo(
    () => new IntersectionObserver(callback, options),
    [options]
  );

  return <div ref={observer} />;
}
```

#### 何时不需要 useMemo

```tsx
// ❌ 过度使用 1: 简单计算
const doubled = useMemo(() => count * 2, [count]);
// 直接 const doubled = count * 2 更快，因为 useMemo 本身有开销

// ❌ 过度使用 2: 原始值
const isActive = useMemo(() => status === "active", [status]);
// 直接 const isActive = status === 'active'

// ❌ 过度使用 3: 对象总是被重新创建
function Parent() {
  const [count, setCount] = useState(0);

  // user 每次都是新对象，useMemo 没意义
  const user = useMemo(
    () => ({
      id: 1,
      name: "Alice",
      count, // 依赖 count
    }),
    [count]
  );

  return <Child user={user} />;
}
```

### 3.6 useCallback（IKM必考⭐⭐⭐⭐⭐）（1.5小时）

> **useCallback 是 IKM 性能优化题中最常考的**，务必掌握它与 React.memo 的配合使用

#### useCallback 基础

```tsx
// useCallback 缓存函数引用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useCallback(fn, deps) 等价于
// useMemo(() => fn, deps)
```

#### useCallback 使用场景

**场景 1: 传递给被 React.memo 包裹的子组件**

```tsx
const Child = React.memo(function Child({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  console.log("Child rendered");
  return <button onClick={onClick}>{name}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次 Parent 渲染，Child 都会重新渲染
  const handleClick = () => console.log("clicked");
  return <Child name="Button" onClick={handleClick} />;

  // ✅ 只有 count 变化时，handleClick 才会变化
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []); // 空依赖数组

  return <Child name="Button" onClick={handleClick} />;
}
```

**场景 2: 作为其他 Hook 的依赖（正确示例）**

```tsx
function Chat({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");

  // ✅ 使用 useCallback 稳定函数引用
  // 通过参数传递 message，避免依赖 message
  const sendMessage = useCallback(
    (msg: string) => {
      if (msg.trim()) {
        postMessage(roomId, msg);
        setMessage("");
      }
    },
    [roomId]
  ); // 只依赖 roomId

  // useEffect 只在 roomId 变化时重新创建连接
  useEffect(() => {
    const connection = createConnection(roomId, sendMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, sendMessage]);

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => sendMessage(message)}>Send</button>
    </div>
  );
}

// ✅ 优势：
// - message 变化不会导致 sendMessage 重新创建
// - 不会触发不必要的 useEffect
// - 连接只在 roomId 变化时重新创建
```

#### useCallback 陷阱

```tsx
// ❌ 陷阱 1: 依赖太多，频繁创建新函数
const handleClick = useCallback(() => {
  doSomething(a, b, c, d, e, f);
}, [a, b, c, d, e, f]); // 任何一个变化都会创建新函数

// ✅ 方案 1: 减少依赖
const state = useMemo(() => ({ a, b, c, d, e, f }), [a, b, c, d, e, f]);
const handleClick = useCallback(() => {
  doSomething(state.a, state.b, state.c, state.d, state.e, state.f);
}, [state]);

// ✅ 方案 2: 使用 ref（不推荐但有时必要）
const paramsRef = useRef({ a, b, c, d, e, f });
paramsRef.current = { a, b, c, d, e, f };

const handleClick = useCallback(() => {
  const { a, b, c, d, e, f } = paramsRef.current;
  doSomething(a, b, c, d, e, f);
}, []); // 空依赖数组
```

#### IKM 必考：useCallback 的陷阱

**陷阱 1: useCallback + React.memo 的配合（超高频）**

```tsx
// ❌ 错误：React.memo 子组件接收的函数没有用 useCallback
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 每次都是新函数
    console.log("clicked");
  };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child onClick={handleClick} /> {/* 每次都重新渲染 */}
    </>
  );
};

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click me</button>;
});

// 结果：每次 count 变化，Child 都会重新渲染
// 原因：handleClick 每次都是新函数，React.memo 比较失败

// ✅ 正确：useCallback + React.memo
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    // 函数引用稳定
    console.log("clicked");
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child onClick={handleClick} /> {/* 不会重新渲染 */}
    </>
  );
};
```

**陷阱 2: 依赖数组导致频繁创建新函数**

```tsx
// ❌ 陷阱：依赖太多，useCallback 几乎没用
const Parent = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);
  const [e, setE] = useState(0);
  const [f, setF] = useState(0);

  // 任何一个依赖变化，都会创建新函数
  const handleClick = useCallback(() => {
    doSomething(a, b, c, d, e, f);
  }, [a, b, c, d, e, f]);

  // 实际上，这个 useCallback 几乎没用
  // 因为每次任何一个状态变化，函数都会重新创建

  // ✅ 方案 1: 使用 useRef（不推荐但有时必要）
  const paramsRef = useRef({ a, b, c, d, e, f });
  paramsRef.current = { a, b, c, d, e, f };

  const handleClick = useCallback(() => {
    const { a, b, c, d, e, f } = paramsRef.current;
    doSomething(a, b, c, d, e, f);
  }, []); // 空依赖数组

  // ✅ 方案 2: 使用 useMemo 缓存参数对象
  const params = useMemo(() => ({ a, b, c, d, e, f }), [a, b, c, d, e, f]);

  const handleClick = useCallback(() => {
    doSomething(params.a, params.b, params.c, params.d, params.e, params.f);
  }, [params]);
};
```

**陷阱 3: useCallback 闭包陷阱（高频）**

```tsx
// ❌ 陷阱：useCallback 的闭包
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count); // 永远是初始值 0
  }, []); // 空依赖数组

  // 问题：
  // 1. useCallback 创建时，count = 0
  // 2. 依赖数组为空，函数永远不会重新创建
  // 3. count 永远是创建时的值（0）

  return (
    <>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log Count</button>
    </>
  );
}

// ✅ 方案 1: 添加依赖
const handleClick = useCallback(() => {
  console.log(count);
}, [count]); // count 变化时重新创建函数

// ✅ 方案 2: 使用函数式更新（如果只是更新状态）
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []); // 不依赖 count

// ✅ 方案 3: 使用 useRef
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 保持 ref 同步
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleClick = useCallback(() => {
    console.log(countRef.current); // 总是最新的值
  }, []);

  return (
    <>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log Count</button>
    </>
  );
}
```

**陷阱 4: useCallback 依赖链式反应（超高频）**

```tsx
// ❌ 陷阱：useCallback 作为 useEffect 依赖，导致连锁反应
function Chat({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");

  const sendMessage = useCallback(() => {
    if (message.trim()) {
      postMessage(roomId, message);
      setMessage("");
    }
  }, [roomId, message]); // ❌ message 变化导致函数重新创建

  useEffect(() => {
    const connection = createConnection(roomId, sendMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, sendMessage]); // ❌ sendMessage 变化触发 useEffect

  return <input value={message} onChange={(e) => setMessage(e.target.value)} />;
}

// 问题链：
// 1. 用户输入 → message 变化
// 2. message 变化 → sendMessage 重新创建
// 3. sendMessage 变化 → useEffect 触发
// 4. 连接被频繁重新创建 ❌

// ✅ 方案 1: 通过参数传递值（推荐）
const sendMessage = useCallback(
  (msg: string) => {
    if (msg.trim()) {
      postMessage(roomId, msg);
      setMessage("");
    }
  },
  [roomId]
); // 只依赖 roomId

// 点击发送时传递 message
<button onClick={() => sendMessage(message)}>Send</button>;

// ✅ 方案 2: 使用 ref 读取最新值
const messageRef = useRef(message);

useEffect(() => {
  messageRef.current = message;
}, [message]);

const sendMessage = useCallback(() => {
  const msg = messageRef.current;
  if (msg.trim()) {
    postMessage(roomId, msg);
    setMessage("");
  }
}, [roomId]); // 只依赖 roomId
```

#### IKM 模拟题：useCallback

**题目 1：以下代码会输出几次 "Child rendered"？**

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count);
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child onClick={handleClick} />
    </>
  );
};

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});
```

- A. 1 次
- B. 每次点击 Increment 按钮
- C. 无限次
- D. 0 次

<details>
<summary>查看答案</summary>

**答案：A**

解析：

- handleClick 的依赖数组为空，只在组件首次渲染时创建一次
- 之后每次 Parent 渲染，handleClick 的引用都不变
- React.memo 检测到 onClick 没变，跳过 Child 的重新渲染
- 只在初始渲染时输出 1 次 "Child rendered"

⚠️ 注意：handleClick 内部的 count 永远是 0（闭包陷阱），但这不影响重新渲染次数

</details>

**题目 2：如何修复以下代码的性能问题？**

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Alice");

  const handleClick = () => {
    console.log(name);
  };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </>
  );
};

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});
```

- A. `const handleClick = useCallback(() => { console.log(name); }, []);`
- B. `const handleClick = useCallback(() => { console.log(name); }, [name]);`
- C. `const Child = ({ onClick }: { onClick: () => void }) => { ... };`（去掉 React.memo）
- D. `const handleClick = () => { console.log(name); };`（保持不变）

<details>
<summary>查看答案</summary>

**答案：B**

解析：

- A：❌ 闭包陷阱，name 永远是初始值 'Alice'
- B：✅ 正确，name 变化时重新创建函数，其他时候复用
- C：❌ 去掉 React.memo 会让 Child 每次都重新渲染
- D：❌ 每次 Parent 渲染，handleClick 都是新函数，Child 每次都重新渲染

性能分析：

- 当前代码：每次 count 变化，handleClick 都是新函数 → Child 重新渲染
- 方案 B：只有 name 变化时，handleClick 才是新函数 → count 变化时不重新渲染 Child

</details>

## 今日练习（Day 3）

### 练习 1: 自定义 Hook

实现一个 `usePrevious` Hook，返回状态的上一个值：

```tsx
function usePrevious<T>(value: T): T | undefined {
  // TODO: 实现
}

// 使用
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      Current: {count}, Previous: {prevCount}
    </div>
  );
}
```

<details>
<summary>查看答案</summary>

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// 原理：
// 1. useEffect 在渲染后执行
// 2. 所以 ref.current 保存的是上一次的值
// 3. 返回的 ref.current 是上一次渲染时保存的值
```

</details>

### 练习 2: 性能优化

```tsx
// 问题：这个组件有什么性能问题？如何优化？
function UserList({ users }: { users: User[] }) {
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);

  const filteredUsers = users.filter((u) => u.name.includes(filter));

  const sortedUsers = filteredUsers.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      {sortedUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

const UserCard = ({ user }: { user: User }) => {
  console.log("UserCard rendered:", user.id);
  return <div>{user.name}</div>;
};
```

<details>
<summary>查看答案</summary>

```tsx
// 问题：
// 1. filteredUsers 每次都重新计算
// 2. sort 直接修改数组
// 3. UserCard 没有用 React.memo，count 变化导致所有卡片重新渲染

// 优化方案：
function UserList({ users }: { users: User[] }) {
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);

  // 1. 使用 useMemo 缓存过滤结果
  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.name.includes(filter));
  }, [users, filter]);

  // 2. 使用 useMemo + 创建新数组来排序
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredUsers]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      {sortedUsers.map((user) => (
        <MemoUserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// 3. 使用 React.memo 包裹组件
const MemoUserCard = React.memo(({ user }: { user: User }) => {
  console.log("UserCard rendered:", user.id);
  return <div>{user.name}</div>;
});
```

</details>

---

# Day 4: Context API + Redux + Zustand 状态管理完全掌握（10小时）

> **今日重点**：掌握三种状态管理方案，理解各自的优势和使用场景

## 上午：Context API 完全掌握（2小时）

### 4.1 Context API 基础（1小时）

#### 为什么需要 Context？

```tsx
// ❌ Props Drilling 问题：层层传递 props
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <Layout theme={theme}>
      <Header theme={theme} />
      <Content theme={theme}>
        <Button theme={theme} />
      </Content>
    </Layout>
  );
}

// 即使中间组件不使用 theme，也必须传递
function Layout({ theme, children }) {
  return <div className={theme}>{children}</div>;
}

function Header({ theme }) {
  return <h1 className={theme}>Header</h1>;
}

function Content({ theme, children }) {
  return <main className={theme}>{children}</main>;
}

function Button({ theme }) {
  return <button className={theme}>Click</button>;
}
```

#### Context API 解决 Props Drilling

```tsx
// ✅ 使用 Context API
import { createContext, useContext } from 'react';

// 1. 创建 Context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

// 2. 创建 Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 在组件中使用 Context
function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

// 任何层级的组件都可以访问 theme
function Layout() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}

function Header() {
  const { theme } = useContext(ThemeContext);
  return <h1 className={theme}>Header</h1>;
}

function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button className={theme} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

#### Context 的三个步骤

```tsx
// 步骤 1: 创建 Context
const MyContext = createContext(defaultValue);

// 步骤 2: 提供 Context
<MyContext.Provider value={value}>
  <Child />
</MyContext.Provider>

// 步骤 3: 消费 Context
const value = useContext(MyContext);
```

### 4.2 Context API 最佳实践（1小时）

#### 实践 1: 分离 Context 避免不必要的渲染

```tsx
// ❌ 错误：所有状态在一个 Context 中
const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],
  // ... 很多状态
});

// 问题：任何状态变化都会导致所有消费者重新渲染

// ✅ 正确：拆分多个 Context
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const NotificationContext = createContext([]);

// 优势：只有使用特定 Context 的组件才会在该状态变化时重新渲染
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <NotificationContext.Provider value={notifications}>
          <Header />       {/* 只在 user 变化时重新渲染 */}
          <Sidebar />      {/* 只在 theme 变化时重新渲染 */}
          <Notifications /> {/* 只在 notifications 变化时重新渲染 */}
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

#### 实践 2: 自定义 Hook 封装 Context

```tsx
// ✅ 创建自定义 Hook
function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

// 使用
function Button() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}

// 优势：
// 1. 无需每次都 import useContext 和 Context
// 2. 可以添加错误检查
// 3. 更好的类型推导
```

#### 实践 3: Context 值的稳定性

```tsx
// ❌ 错误：每次都创建新对象
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 问题：每次 ThemeProvider 重新渲染，value 都是新对象
// 导致所有消费者重新渲染

// ✅ 方案 1: 使用 useMemo
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ 方案 2: 拆分状态和函数（推荐）
// 创建两个独立的 Context
const ThemeContext = createContext(null);
const ThemeUpdateContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // 拆分发送：theme 只读，setTheme 独立
  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={setTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
}

// 使用自定义 Hook 简化访问
function useTheme() {
  return useContext(ThemeContext);
}

function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

// 组件中只订阅需要的状态
function ThemeButton() {
  const theme = useTheme();  // 只订阅 theme
  const setTheme = useThemeUpdate();  // 只订阅 setTheme（引用不变）
  // ...
}
```

### 4.3 Context API 的陷阱（IKM中频）

#### 陷阱 1: Context 值变化导致所有消费者重新渲染

```tsx
// ❌ 陷阱：频繁变化的状态
function TimerProvider({ children }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider value={seconds}>
      {children}
    </TimerContext.Provider>
  );
}

// 问题：每秒所有消费者都重新渲染

// ✅ 方案：只读取当前值，不作为 Context
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{seconds}</div>;
}
```

#### 陷阱 2: 默认值的误导

```tsx
const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  // ⚠️ 如果没有 Provider，theme 会是 'light'
  // 但这可能不是你想要的行为
  return <button className={theme}>Click</button>;
}

// ✅ 最佳实践：使用 undefined 作为默认值，强制使用 Provider
const ThemeContext = createContext(undefined);

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
```

### 4.4 何时使用 Context？

#### ✅ 适合使用 Context 的场景

1. **主题、语言、用户信息等全局状态**
   ```tsx
   <ThemeProvider><App /></ThemeProvider>
   <I18nProvider><App /></I18nProvider>
   <UserProvider><App /></UserProvider>
   ```

2. **避免 props drilling**
   ```tsx
   // 深层嵌套组件需要访问祖先的状态
   function App() {
     return (
       <Level1>
         <Level2>
           <Level3>
             <NeedsData /> {/* 需要访问 App 的数据 */}
           </Level3>
         </Level2>
       </Level1>
     );
   }
   ```

#### ❌ 不适合使用 Context 的场景

1. **频繁变化的状态**
   - 秒数、鼠标位置、输入框值
   - 会导致所有消费者频繁重新渲染

2. **复杂的异步逻辑**
   - 没有中间件支持
   - 难以追踪状态变化

3. **需要时间旅行调试**
   - Context 无法记录状态变化历史

### 4.5 Context vs Redux 对比

| 维度           | Context API                     | Redux                         |
| -------------- | ------------------------------- | ----------------------------- |
| **复杂度**     | 简单                            | 较复杂                        |
| **学习曲线**   | 平缓                            | 陡峭                          |
| **Bundle**     | 内置，0 KB                      | ~10KB+                        |
| **调试工具**   | 无                              | Redux DevTools                |
| **中间件**     | 无                              | Thunk, Saga, Observable       |
| **时间旅行**   | 不支持                          | 支持                          |
| **适用场景**   | 简单全局状态                    | 复杂状态管理、团队协作        |
| **性能优化**   | 手动拆分 Context                | 自动 memoization（reselect）  |
| **状态追踪**   | 难以追踪变化来源                | 纯函数 reducer，易于追踪      |

---

## 下午：Redux 核心概念（4小时）

### 4.6 为什么需要 Redux？（30分钟）

#### Context 的局限性

```tsx
// ❌ Context 的问题
const AppContext = createContext({
  user: null,
  theme: "light",
  notifications: [],
  // ... 很多状态
});

function App() {
  const [state, setState] = useState({});

  // 问题：任何状态变化都会导致所有消费者重新渲染
  return (
    <AppContext.Provider value={{ state, setState }}>
      <Header /> {/* 通知变化时重新渲染 */}
      <Sidebar /> {/* 通知变化时重新渲染 */}
      <MainContent /> {/* 通知变化时重新渲染 */}
    </AppContext.Provider>
  );
}
```

#### Redux 的优势

- **单一数据源**：所有状态在一个 store 中
- **状态可预测**：纯函数 reducer，状态变化可追踪
- **可调试性**：Redux DevTools 时间旅行调试
- **中间件生态**：Redux Thunk, Redux Saga, Redux Observable
- **结构化**：强制组织代码结构

### 4.7 Redux 三大核心概念（2小时）

#### 概念 1: Action

```typescript
// Action 是一个普通对象，描述"发生了什么"
interface Action {
  type: string; // 必需：动作类型
  payload?: any; // 可选：负载数据
}

// 示例
const addTodoAction = {
  type: "todos/add",
  payload: {
    id: 1,
    text: "Learn Redux",
    completed: false,
  },
};

// Action Creator
function addTodo(text: string) {
  return {
    type: "todos/add",
    payload: {
      id: Date.now(),
      text,
      completed: false,
    },
  };
}
```

#### 概念 2: Reducer

```typescript
// Reducer 是纯函数：(state, action) => newState
type Reducer<S, A extends Action> = (state: S, action: A) => S;

// 示例：Todo Reducer
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type TodoState = Todo[];

interface TodoAction {
  type: string;
  payload?: any;
}

const initialState: TodoState = [];

function todosReducer(
  state: TodoState = initialState,
  action: TodoAction
): TodoState {
  switch (action.type) {
    case "todos/add":
      return [...state, action.payload];

    case "todos/toggle":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case "todos/delete":
      return state.filter((todo) => todo.id !== action.payload.id);

    default:
      return state;
  }
}

// Reducer 的规则：
// 1. 必须是纯函数（没有副作用）
// 2. 不能直接修改 state（保持不可变性）
// 3. 必须返回新的 state
// 4. 遇到未知的 action，必须返回原 state
```

#### 概念 3: Store

```typescript
// Store 持有应用的状态
import { createStore } from "redux";

// 创建 store
const store = createStore(todosReducer);

// Store 的方法
store.getState(); // 获取当前状态
store.dispatch(addTodo("...")); // 发送 action
store.subscribe(() => {
  // 订阅状态变化
  console.log(store.getState());
});
```

### 4.8 Redux 数据流（1小时）

#### Redux 单向数据流

```
┌─────────────────────────────────────┐
│           View (React)              │
└──────────────┬──────────────────────┘
               │ user clicks button
               ↓
┌─────────────────────────────────────┐
│       Store.dispatch(action)        │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│          Reducer(state, action)     │
│    calculates new state             │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     Store saves new state           │
└──────────────┬──────────────────────┘
               │ state changed
               ↓
┌─────────────────────────────────────┐
│           View re-renders           │
└─────────────────────────────────────┘
```

## 晚上：Redux Toolkit + Zustand 实战（4小时）

### 4.9 Redux Toolkit 简介（1小时）

#### 为什么使用 Redux Toolkit？

- Redux Toolkit 是 Redux 的官方推荐工具集
- 简化了 Redux 的配置和使用
- 包含了最佳实践和常用工具
- 自动安装 Redux DevTools Extension

#### Redux Toolkit 的核心 API

```typescript
import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

// configureStore: 创建 store（自动配置）
// createSlice: 简化 reducer 和 action 的创建
// createAsyncThunk: 处理异步操作
// createEntityAdapter: 管理规范化数据
```

### 4.10 createSlice 深度（1.5小时）

#### createSlice 基础

```typescript
import { createSlice } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  status: "idle" | "loading" | "error";
}

const initialState: TodoState = {
  items: [],
  status: "idle",
};

// createSlice 自动生成：
// 1. action creators (addTodo, toggleTodo, deleteTodo)
// 2. action types (todos/addTodo, todos/toggleTodo, todos/deleteTodo)
// 3. reducer 函数
const todosSlice = createSlice({
  name: "todos", // slice 名称，会作为 action type 的前缀
  initialState,
  reducers: {
    // 定义 reducer 函数
    // RTK 自动生成对应的 action creator
    addTodo: (state, action: PayloadAction<{ text: string }>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload.text,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed; // Immer 允许直接修改！
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      // 使用 Immer 的数组过滤
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

// 导出 action creators
export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;

// 导出 reducer
export default todosSlice.reducer;
```

#### createSlice 与 Zustand 对比

```typescript
// Redux Toolkit (createSlice)
const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    }
  }
});

// 使用
function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.items);

  return <button onClick={() => dispatch(addTodo({ text: 'New' }))}>Add</button>;
}

// Zustand
const useTodosStore = create((set) => ({
  items: [],
  addTodo: (text) => set((state) => ({
    items: [...state.items, { id: Date.now(), text, completed: false }]
  }))
}));

// 使用
function TodoList() {
  const { items, addTodo } = useTodosStore();

  return <button onClick={() => addTodo('New')}>Add</button>;
}
```

### 4.11 createAsyncThunk 异步处理（1.5小时）

#### createAsyncThunk 基础

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";

// createAsyncThunk 自动生成三个 action:
// - fetchTodos.pending
// - fetchTodos.fulfilled
// - fetchTodos.rejected

export const fetchTodos = createAsyncThunk(
  "todos/fetch", // action type 前缀
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}/todos`);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      return data; // 这个值会作为 action.payload
    } catch (error) {
      return rejectWithValue(error.message); // 这个值会作为 action.payload (rejected)
    }
  }
);

// 在 createSlice 中处理异步 actions
const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null as string | null,
  },
  reducers: {
    // ... 同步 reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});
```

#### 完整的异步流程

```typescript
// 1. 定义 async thunk
export const createTodo = createAsyncThunk(
  'todos/create',
  async (text: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('Failed to create todo');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. 在组件中使用
function TodoForm() {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { status, error } = useSelector(state => state.todos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createTodo(text));
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={status === 'loading'}
      />
      {status === 'loading' && <span>Creating...</span>}
      {error && <span>Error: {error}</span>}
    </form>
  );
}
```

### 4.12 configureStore 配置（30分钟）

```typescript
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";
import userReducer from "./userSlice";

// configureStore 自动配置：
// - Redux DevTools Extension
// - Redux Thunk 中间件
// - Immer 中间件
// - 序列化检查

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customMiddleware), // 添加自定义中间件
  devTools: process.env.NODE_ENV !== "production", // 开发环境启用 DevTools
});

// 类型推导
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4.13 React-Redux Hooks（30分钟）

```typescript
import { useSelector, useDispatch, useStore } from 'react-redux';

// useSelector: 读取状态
function TodoList() {
  // 简单选择器
  const todos = useSelector((state: RootState) => state.todos.items);

  // 记忆化选择器（使用 reselect）
  const activeTodos = useSelector(selectActiveTodos);

  return <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>;
}

// useDispatch: 发送 action
function AddTodoButton() {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(addTodo({ text: 'New Todo' }));
  };

  return <button onClick={handleClick}>Add Todo</button>;
}

// useStore: 访问 store（不常用）
function DebugInfo() {
  const store = useStore();
  return <div>State: {JSON.stringify(store.getState())}</div>;
}
```

## Redux vs Zustand 对比

| 维度        | Redux Toolkit      | Zustand            |
| ----------- | ------------------ | ------------------ |
| Bundle Size | ~10KB+             | ~1KB               |
| 样板代码    | 相对较多           | 很少               |
| 学习曲线    | 陡峭               | 平缓               |
| DevTools    | 专用 DevTools      | 简单的 DevTools    |
| 中间件      | Thunk, Saga 等     | 内置               |
| TypeScript  | 需要手动配置       | 自动推导           |
| 适用场景    | 大型应用、团队协作 | 个人项目、小型应用 |

---

## 晚上：Zustand 状态管理（2小时）⭐⭐⭐⭐

> **为什么学习 Zustand？** 它是最简单、最轻量、TypeScript 友好的状态管理方案

### 4.14 Zustand 基础（30分钟）

#### 什么是 Zustand？

```bash
# 安装
npm install zustand
```

- **超轻量**：只有 ~1KB（Redux Toolkit ~10KB+）
- **零样板代码**：不需要 actions、reducers、providers
- **TypeScript 友好**：自动类型推导
- **简单 API**：3 行代码就能创建 store

#### Zustand 基础用法

```typescript
import { create } from 'zustand';

// 1. 创建 store（只需 3 行！）
const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

// 2. 在组件中使用
function BearCounter() {
  // 直接解构需要的状态
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  // 直接解构需要的 actions
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

#### 与 Redux 对比

```typescript
// ❌ Redux Toolkit（需要很多代码）
// 1. 创建 slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

// 2. 创建 store
const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

// 3. 在组件中使用
function Counter() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);
  return (
    <>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </>
  );
}

// ✅ Zustand（简单很多）
const useCounter = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment, decrement } = useCounter();
  return (
    <>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
}
```

### 4.15 Zustand 高级用法（1小时）

#### 功能 1: 异步 Actions

```typescript
const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // 异步获取用户
  fetchUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

function UserProfile({ userId }) {
  const { user, loading, error, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}
```

#### 功能 2: 中间件

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// devtools：支持 Redux DevTools
// persist：持久化到 localStorage

const useStore = create(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: () => set((state) => ({ bears: state.bears + 1 })),
      }),
      {
        name: 'bear-storage', // localStorage key
      }
    )
  )
);
```

#### 功能 3: Slice Pattern（拆分 store）

```typescript
// ❌ 不要把所有状态放在一个 store
const useAppStore = create((set) => ({
  // 用户相关
  user: null,
  login: async (credentials) => { /*...*/ },
  logout: () => { /*...*/ },

  // 主题相关
  theme: 'light',
  toggleTheme: () => { /*...*/ },

  // 通知相关
  notifications: [],
  addNotification: () => { /*...*/ },

  // ... 很多状态
}));

// ✅ 拆分成多个 store
// stores/user.ts
const useUser = create((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await api.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));

// stores/theme.ts
const useTheme = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

// stores/notifications.ts
const useNotifications = create((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),
}));

// 在组件中使用
function Header() {
  const { user, logout } = useUser();      // 只订阅 user
  const { theme, toggleTheme } = useTheme(); // 只订阅 theme

  return (
    <>
      <span>Welcome {user?.name}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={logout}>Logout</button>
    </>
  );
}
```

#### 功能 4: 选择器优化

```typescript
// Zustand 自动优化渲染
const useStore = create((set) => ({
  users: [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    // ... 很多用户
  ],
  updateUser: (id, data) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
  })),
}));

// ❌ 每次任何用户变化都会重新渲染
function UserList() {
  const users = useStore((state) => state.users);
  return users.map(u => <User key={u.id} user={u} />);
}

// ✅ 只订阅特定用户
function UserCard({ userId }) {
  const user = useStore((state) =>
    state.users.find(u => u.id === userId)
  );

  if (!user) return null;

  return <div>{user.name} - {user.age}</div>;
}

// 只有这个 userId 的用户变化时才重新渲染
```

### 4.16 三种方案如何选择？（30分钟）

#### 决策树

```
是否需要跨组件共享状态？
  │
  ├─ 否 → 使用 useState
  │
  └─ 是 → 状态复杂吗？
          │
          ├─ 不复杂（主题、语言等）
          │   └─ 使用 Context API ✅
          │
          └─ 复杂（多个状态、异步逻辑）
              │
              ├─ 团队规模？
              │   │
              │   ├─ 大型团队（>10人）
              │   │   └─ 使用 Redux Toolkit ✅
              │   │
              │   └─ 小型团队/个人项目
              │       │
              │       └─ 需要严格规范？
              │           │
              │           ├─ 是 → Redux Toolkit
              │           └─ 否 → Zustand ✅✅✅ 推荐
```

#### 使用场景对比表

| 场景 | 推荐方案 | 理由 |
|------|----------|------|
| **主题切换** | Context API | 简单、全局、不频繁变化 |
| **国际化** | Context API | 只读数据、无需复杂逻辑 |
| **用户认证** | Context API / Zustand | Context 简单，Zustand 更灵活 |
| **表单状态** | useState / Zustand | 本地用 useState，跨组件用 Zustand |
| **购物车** | Zustand | 需要频繁更新、多个操作 |
| **大型企业应用** | Redux Toolkit | 强制规范、团队协作、调试工具 |
| **中小型应用** | Zustand | 简单、轻量、灵活 |
| **需要时间旅行调试** | Redux Toolkit | Context/Zustand 不支持 |

#### 三者可以共用吗？

**✅ 可以！根据场景混用**

```typescript
// 实际项目中的常见组合

// 1. Context API：应用级配置
const ThemeContext = createContext('light');
const I18nContext = createContext('zh-CN');

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}

// 2. Zustand：业务逻辑
const useCart = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),
}));

const useUser = create((set) => ({
  user: null,
  login: async (credentials) => { /*...*/ },
}));

// 3. Redux：如果项目已经在使用，继续用
// 或者团队强制要求使用 Redux

// 在组件中组合使用
function ProductCard({ product }) {
  // Context：主题
  const { theme } = useContext(ThemeContext);

  // Zustand：购物车
  const { addItem } = useCart();

  return (
    <div className={theme}>
      <h2>{product.name}</h2>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}
```

#### 推荐的组合策略

**方案 1: Context + Zustand（推荐）**
```typescript
// Context: 应用级配置
const ThemeProvider = () => { /*...*/ };

// Zustand: 业务状态
const useUserStore = create(() => ({ /*...*/ }));
const useCartStore = create(() => ({ /*...*/ }));
const useProductStore = create(() => ({ /*...*/ }));

// 优势：简单 + 灵活
```

**方案 2: 单独使用 Redux Toolkit**
```typescript
// 适合：大型团队、需要严格规范
// 一个 store 包含所有状态
// 或者使用 Redux Toolkit 的 slice 拆分
```

**方案 3: Context + Redux**
```typescript
// Context: 简单配置（主题、语言）
// Redux: 复杂业务逻辑

// 优势：减少 Redux 的复杂度
// 但通常没必要，Zustand 比 Redux 更简单
```

**方案 4: 单独使用 Zustand（最简单）**
```typescript
// 所有状态都用 Zustand
const useTheme = create(() => ({ /*...*/ }));
const useUser = create(() => ({ /*...*/ }));
const useCart = create(() => ({ /*...*/ }));

// 优势：统一 API、简单、轻量
// 推荐中小型项目使用
```

### 4.17 迁移建议

#### 从 Context 迁移到 Zustand

```typescript
// ❌ Context API
const ThemeContext = createContext(null);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('...');
  return context;
}

// ✅ Zustand（更简单）
const useTheme = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));

// 无需 Provider，直接使用！
```

#### 从 Redux 迁移到 Zustand

```typescript
// ❌ Redux Toolkit
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});
// ... 配置 store、provider ...

// ✅ Zustand
const useCounter = create((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
}));

// 只需 3 行代码！
```

---

## 今日练习（Day 4）

### 练习 1: 实现一个 Counter Slice

使用 Redux Toolkit 实现：

```typescript
// TODO: 实现 CounterSlice
// 1. 定义 state interface
// 2. 使用 createSlice
// 3. 导出 actions 和 reducer
// 4. 在 configureStore 中配置

interface CounterState {
  value: number;
}

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    // TODO: 实现 increment, decrement, incrementByAmount
  },
});
```

<details>
<summary>查看答案</summary>

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

// 在组件中使用
function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

</details>

### 练习 2: 使用 Zustand 实现购物车（推荐）

使用 Zustand 实现：

```typescript
// 要求：
// 1. 创建购物车 store
// 2. 实现添加商品、删除商品、更新数量、清空购物车
// 3. 实现总价计算
// 4. 持久化到 localStorage

// TODO: 实现
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // TODO: 添加 actions
}

const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      // TODO: 实现 addItem, removeItem, updateQuantity, clearCart, getTotalPrice
    }),
    { name: 'cart-storage' }
  )
);
```

<details>
<summary>查看答案</summary>

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // 添加商品
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          // 已存在，增加数量
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        // 不存在，添加新商品
        return {
          items: [...state.items, { ...item, quantity: 1 }],
        };
      }),

      // 删除商品
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
      })),

      // 更新数量
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
        ),
      })),

      // 清空购物车
      clearCart: () => set({ items: [] }),

      // 计算总价
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      // 计算总商品数
      getTotalItems: () => {
        return get().items.reduce((total, item) => {
          return total + item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);

// 在组件中使用
function ProductCard({ product }) {
  const addItem = useCart((state) => state.addItem);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

function Cart() {
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const getTotalPrice = useCart((state) => state.getTotalPrice);
  const clearCart = useCart((state) => state.clearCart);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>${item.price}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <div>
        <strong>Total: ${getTotalPrice()}</strong>
      </div>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

**对比 Redux 实现：**

- Redux 需要约 80 行代码（slice + store + selectors + hooks）
- Zustand 只需约 50 行代码
- Zustand 无需 Provider，无需配置

</details>

---

# Day 5: React Router + 完整应用 + IKM 模拟（8小时）

## 上午：React Router（3小时）

### 5.1 React Router 基础（1小时）

#### 安装与配置

```bash
# React Router v7
npm install react-router-dom
```

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 定义路由
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'users/:id', element: <UserDetail /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### 5.2 路由 Hooks（1小时）

```typescript
import {
  useParams,      // 获取路径参数
  useSearchParams, // 获取查询参数
  useNavigate,    // 编程式导航
  useLocation     // 获取当前位置
} from 'react-router-dom';

// useParams: 获取路径参数 /users/:id
function UserDetail() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  return <div>User: {id}</div>;
}

// useSearchParams: 获取查询参数 /search?q=keyword
function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return <div>Searching: {query}</div>;
}

// useNavigate: 编程式导航
function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');  // 导航到 /dashboard
      navigate(-1);            // 返回上一页
    }
  };
}

// useLocation: 获取当前位置
function DebugInfo() {
  const location = useLocation();
  return <div>Current path: {location.pathname}</div>;
}
```

### 5.3 嵌套路由与布局（1小时）

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'settings', element: <AdminSettings /> }
        ]
      }
    ]
  }
]);

// Layout 组件使用 <Outlet /> 渲染子路由
function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />  {/* 子路由会在这里渲染 */}
      <footer>Footer</footer>
    </div>
  );
}
```

## 下午：完整应用构建（5小时）

### 实战项目：Todo App（完整功能）

**功能需求：**

1. 添加/删除/切换 Todo
2. 按状态筛选（All/Active/Completed）
3. 本地存储持久化
4. Redux 状态管理
5. React Router 导航

**实现步骤：**

#### 步骤 1: 创建 Redux Slice

```typescript
// features/todos/todosSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  filter: "all" | "active" | "completed";
}

const initialState: TodosState = {
  items: JSON.parse(localStorage.getItem("todos") || "[]"),
  filter: "all",
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
      localStorage.setItem("todos", JSON.stringify(state.items));
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem("todos", JSON.stringify(state.items));
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(state.items));
    },
    setFilter: (
      state,
      action: PayloadAction<"all" | "active" | "completed">
    ) => {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, setFilter } =
  todosSlice.actions;
export default todosSlice.reducer;
```

#### 步骤 2: 创建组件

```tsx
// features/todos/TodoList.tsx
function TodoList() {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state: RootState) => state.todos);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return items.filter((t) => !t.completed);
      case "completed":
        return items.filter((t) => t.completed);
      default:
        return items;
    }
  }, [items, filter]);

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

## IKM 考试模拟题（⭐⭐⭐⭐⭐ 必练）

> **说明**：以下题目覆盖了 IKM React 考试 80% 的高频考点

### 第一部分：useEffect 专题（⭐⭐⭐⭐⭐）

**题目 1：以下代码会输出什么？**

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect");
    setCount(count + 1);
  }, []);

  return <div>{count}</div>;
}
```

- A. 输出一次 "effect"，显示 1
- B. 输出无限次 "effect"
- C. 不输出 "effect"，显示 0
- D. 输出两次 "effect"，显示 2

<details>
<summary>答案与解析</summary>

**答案：A**

解析：

1. 组件首次渲染，count = 0
2. useEffect 执行（空依赖数组，只执行一次）
3. 输出 "effect"
4. setCount(1) 触发重新渲染
5. 组件第二次渲染，count = 1
6. useEffect 不再执行（依赖数组为空）
7. 最终：count = 1，effect 执行 1 次

**IKM 考点**：useEffect 的执行时机和依赖数组的作用

</details>

**题目 2：以下 useEffect 的使用哪个是正确的？**

- A. `useEffect(async () => { await fetchData(); }, [id])`
- B. `useEffect(() => { fetchData().then(setData); }, [id])`
- C. `useEffect(() => { const data = await fetchData(); }, [id])`
- D. `useEffect(fetchData, [id])`

<details>
<summary>答案与解析</summary>

**答案：B**

解析：

- A：❌ useEffect 不能直接使用 async 函数
- B：✅ 正确，使用 Promise.then()
- C：❌ async/await 不能直接在 useEffect 回调中使用
- D：❌ fetchData 会被立即执行，应该传递函数引用

**IKM 考点**：useEffect 中异步操作的正确写法

</details>

**题目 3：以下代码会执行几次 console.log？**

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect");
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

初始渲染后点击按钮 3 次。

- A. 1 次
- B. 3 次
- C. 4 次
- D. 无限次

<details>
<summary>答案与解析</summary>

**答案：C**

解析：

- 没有依赖数组 = 每次渲染后都执行
- 初始渲染：1 次
- 点击 1 次：重新渲染，1 次
- 点击 2 次：重新渲染，1 次
- 点击 3 次：重新渲染，1 次
- 总计：1 + 3 = 4 次

**IKM 考点**：省略依赖数组 vs 空依赖数组的区别

</details>

---

### 第二部分：useState 专题（⭐⭐⭐⭐⭐）

**题目 4：以下代码的输出是什么？**

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

点击按钮后，count 的值是多少？

- A. 0
- B. 1
- C. 3
- D. 不确定

<details>
<summary>答案与解析</summary>

**答案：B**

解析：

- 三次 setCount 都读取同一个 count 值（当前渲染的值）
- setCount(0 + 1) 三次
- React 批处理，最终 count = 1
- 修复方法：`setCount(c => c + 1)` 三次

**IKM 考点**：useState 函数式更新的必要性

</details>

**题目 5：如何修复以下代码，使 count 增加 3？**

```tsx
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```

- A. `setCount(count + 3)`
- B. `setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1)`
- C. `setCount(prev => prev + 3)`
- D. 以上都正确

<details>
<summary>答案与解析</summary>

**答案：D**

解析：

- A：✅ 直接加 3
- B：✅ 函数式更新，每次基于最新值
- C：✅ 函数式更新，一次性加 3
- D：✅ 三种方法都正确

**IKM 考点**：useState 的多种更新方式

</details>

---

### 第三部分：Hooks 规则专题（⭐⭐⭐⭐⭐）

**题目 6：以下哪些 Hooks 的使用是正确的？（多选）**

```tsx
// A.
function Component() {
  if (condition) {
    const [count, setCount] = useState(0);
  }
}

// B.
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count > 0) {
      console.log(count);
    }
  }, [count]);
}

// C.
function Component() {
  useEffect(() => {
    const [data, setData] = useState(null);
  }, []);
}

// D.
function Component() {
  const items = [1, 2, 3];
  items.forEach(() => {
    console.log("test");
  });
  const [count, setCount] = useState(0);
}
```

<details>
<summary>答案与解析</summary>

**答案：B、D**

解析：

- A：❌ useState 在条件语句中调用
- B：✅ Hooks 在顶层，条件逻辑在 effect 内部
- C：❌ useState 在 useEffect 中调用
- D：✅ Hooks 在顶层调用（forEach 在 useState 之后）

**IKM 考点**：Hooks 的两条黄金规则

</details>

---

### 第四部分：性能优化专题（⭐⭐⭐⭐⭐）

**题目 7：以下代码会输出几次 "Child rendered"？**

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);
  const user = { name: "Alice" };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child user={user} />
    </>
  );
};

const Child = React.memo(({ user }: { user: { name: string } }) => {
  console.log("Child rendered");
  return <div>{user.name}</div>;
});
```

点击按钮 3 次。

- A. 1 次
- B. 3 次
- C. 4 次
- D. 0 次

<details>
<summary>答案与解析</summary>

**答案：C**

解析：

- 初始渲染：1 次
- 每次 Parent 渲染，`user = { name: 'Alice' }` 都创建新对象
- React.memo 浅比较，发现 user 引用变化
- 每次 count 变化都导致 Child 重新渲染
- 总计：1 + 3 = 4 次

修复方法：`const user = useMemo(() => ({ name: 'Alice' }), [])`

**IKM 考点**：React.memo 的浅比较机制

</details>

**题目 8：以下代码的输出是什么？**

```tsx
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count);
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log</button>
    </>
  );
};
```

点击 Increment 2 次，然后点击 Log，会输出什么？

- A. 0
- B. 2
- C. undefined
- D. 报错

<details>
<summary>答案与解析</summary>

**答案：A**

解析：

- useCallback 的依赖数组为空
- handleClick 只在组件首次渲染时创建一次
- 当时 count = 0
- 之后 count 变化，handleClick 不会重新创建
- handleClick 内部的 count 永远是 0（闭包陷阱）

**IKM 考点**：useCallback 的闭包陷阱

</details>

**题目 9：如何修复题目 8 的代码？**

- A. `const handleClick = useCallback(() => { console.log(count); }, [count])`
- B. `const handleClick = useCallback(() => { console.log(count); }, [])`
- C. `const handleClick = () => { console.log(count); }`
- D. `useCallback` 不适用于这个场景

<details>
<summary>答案与解析</summary>

**答案：A**

解析：

- A：✅ 添加 count 依赖，count 变化时重新创建函数
- B：❌ 闭包陷阱
- C：❌ 每次都是新函数，无法享受 useCallback 的优化
- D：❌ useCallback 完全适用

**IKM 考点**：useCallback 的正确使用

</details>

---

### 第五部分：React 原理专题（⭐⭐⭐⭐）

**题目 10：以下关于 key 的说法哪个是正确的？**

- A. key 必须是全局唯一的
- B. 使用 index 作为 key 总是安全的
- C. key 应该是稳定、唯一、不变的
- D. key 只在列表中使用

<details>
<summary>答案与解析</summary>

**答案：C**

解析：

- A：❌ key 只需要在兄弟元素中唯一
- B：❌ 动态列表使用 index 作为 key 会导致状态错乱
- C：✅ 正确
- D：❌ key 也可以用在其他场景（如强制重新渲染）

**IKM 考点**：key 的作用和正确使用

</details>

---

### 第六部分：React 18 特性（⭐⭐⭐）

**题目 11：React 18 的自动批处理是指什么？**

- A. 所有状态更新都会被批处理
- B. 只有事件处理器中的更新会被批处理
- C. Promise、setTimeout 等异步操作中的更新也会被批处理
- D. 只有 useState 的更新会被批处理

<details>
<summary>答案与解析</summary>

**答案：C**

解析：

- React 17：只在事件处理器中批处理
- React 18：所有更新都会被批处理（包括异步操作）
- 使用 `flushSync` 可以退出批处理

**IKM 考点**：React 18 的新特性

</details>

---

### IKM 考试策略建议

1. **时间分配**
   - useEffect/useState 题：30-40%
   - 性能优化题：25-30%
   - Hooks 规则题：15-20%
   - React 原理题：15-20%
   - 其他：10-15%

2. **答题技巧**
   - 仔细阅读代码，注意依赖数组
   - 判断是否涉及闭包陷阱
   - 注意对象的引用比较
   - 区分 React 17 和 React 18 的行为

3. **复习重点**
   - ⭐⭐⭐⭐⭐ 考点：useEffect 依赖数组、useState 函数式更新、Hooks 规则、useCallback + React.memo
   - ⭐⭐⭐⭐ 考点：React.memo 引用比较、useMemo、闭包陷阱、key 的作用

4. **常见陷阱**
   - useEffect 直接使用 async 函数
   - useState 连续更新
   - useCallback 闭包陷阱
   - React.memo + 对象/数组 props
   - Hooks 在条件语句中调用

---

## IKM 考试模拟题

### 选择题

1. **以下哪个是 useEffect 的正确使用方式？**
   - A. `useEffect(async () => { await fetchData(); }, [])`
   - B. `useEffect(() => { fetchData(); }, [])`
   - C. `useEffect(() => { fetchData(); })`
   - D. `useEffect(() => fetchData(), [])`

   <details>
   <summary>答案</summary>

   **答案: B**

   解析：
   - A: useEffect 不能直接使用 async 函数
   - B: 正确
   - C: 缺少依赖数组，每次渲染都会执行
   - D: 立即执行函数语法错误

   ```tsx
   // A 的正确写法
   useEffect(() => {
     async function fetchData() {
       await api.getData();
     }
     fetchData();
   }, []);
   ```

   </details>

2. **以下代码的输出是什么？**

   ```tsx
   function Counter() {
     const [count, setCount] = useState(0);
     setCount(count + 1);
     setCount(count + 1);
     console.log(count);
   }
   ```

   - A. 0
   - B. 1
   - C. 2
   - D. 不确定

   <details>
   <summary>答案</summary>

   **答案: A**

   解析：状态更新是异步的，console.log 读取的是当前渲染的 count 值（0）。两次 setCount 都读取同一个 count 值。

   修复方法：

   ```tsx
   setCount((c) => c + 1);
   setCount((c) => c + 1);
   ```

   </details>

3. **以下哪个 React Hooks 使用是正确的？**
   - A. `if (condition) { useState(0); }`
   - B. `useState(0); useEffect(() => {}, []);`
   - C. `useEffect(() => { useState(0); }, []);`
   - D. `const [count, setCount] = useState();`

   <details>
   <summary>答案</summary>

   **答案: B**

   解析：
   - A: Hooks 不能在条件语句中调用
   - B: 正确
   - C: useEffect 不能调用 useState
   - D: useState 需要初始值

   </details>

### 编程题

**题目：实现一个 useDebounce Hook**

```tsx
// 要求：实现一个防抖 Hook，延迟更新值
function useDebounce<T>(value: T, delay: number): T {
  // TODO: 实现
}

// 使用示例
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

<details>
<summary>查看答案</summary>

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：取消之前的定时器
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 工作原理：
// 1. value 变化时，设置一个延迟定时器
// 2. 如果在 delay 时间内 value 再次变化，取消之前的定时器
// 3. 只有在 delay 时间内没有新的 value 变化时，才更新 debouncedValue
```

</details>

---

# 附录：React Hooks 速查表

## 核心Hooks

| Hook               | 用途                  | 语法                                                                 |
| ------------------ | --------------------- | -------------------------------------------------------------------- |
| `useState`         | 管理组件状态          | `const [state, setState] = useState(initialState)`                   |
| `useEffect`        | 处理副作用            | `useEffect(setup, dependencies?)`                                    |
| `useContext`       | 读取 Context          | `const value = useContext(MyContext)`                                |
| `useReducer`       | 复杂状态管理          | `const [state, dispatch] = useReducer(reducer, initialState)`        |
| `useRef`           | 访问 DOM 或存储可变值 | `const ref = useRef(initialValue)`                                   |
| `useMemo`          | 缓存计算结果          | `const memoizedValue = useMemo(() => computeExpensiveValue(), deps)` |
| `useCallback`      | 缓存函数引用          | `const memoizedFn = useCallback(() => {...}, deps)`                  |
| `useLayoutEffect`  | 同步执行副作用        | `useLayoutEffect(setup, dependencies?)`                              |
| `useTransition`    | 标记非紧急更新        | `const [isPending, startTransition] = useTransition()`               |
| `useDeferredValue` | 延迟更新值            | `const deferredValue = useDeferredValue(value)`                      |
| `useId`            | 生成唯一 ID           | `const id = useId()`                                                 |

## 自定义 Hooks 模式

| 模式              | 用途         | 示例                                                             |
| ----------------- | ------------ | ---------------------------------------------------------------- |
| `useLocalStorage` | 本地存储     | `const [value, setValue] = useLocalStorage('key', initialValue)` |
| `useFetch`        | 数据获取     | `const { data, error, loading } = useFetch(url)`                 |
| `useToggle`       | 切换布尔值   | `const [value, toggle] = useToggle(false)`                       |
| `usePrevious`     | 获取上一个值 | `const prevValue = usePrevious(value)`                           |
| `useMediaQuery`   | 响应式检测   | `const isMobile = useMediaQuery('(max-width: 768px)')`           |
| `useDebounce`     | 防抖         | `const debouncedValue = useDebounce(value, 300)`                 |
| `useForm`         | 表单管理     | `const { values, errors, handleSubmit } = useForm()`             |

---

# 总结与建议

## 学习检查清单

### Day 1: React 基础

- [ ] 理解 JSX 语法和规则
- [ ] 掌握组件定义和 Props 传递
- [ ] 理解事件处理和事件对象
- [ ] 能进行 Angular 到 React 的代码转换

### Day 2: useState 和 useEffect

- [ ] 掌握 useState 的各种用法
- [ ] 理解函数式更新的场景
- [ ] 深入理解 useEffect 的依赖数组
- [ ] 能识别和解决闭包陷阱

### Day 3: 自定义 Hooks 和性能优化

- [ ] 能编写常用的自定义 Hooks
- [ ] 理解 React.memo 的使用场景
- [ ] 掌握 useMemo 和 useCallback
- [ ] 能识别性能问题并优化

### Day 4: Redux

- [ ] 理解 Redux 的三大核心概念
- [ ] 掌握 Redux Toolkit 的使用
- [ ] 能使用 createSlice 创建 reducer
- [ ] 能使用 createAsyncThunk 处理异步

### Day 5: 完整应用

- [ ] 能使用 React Router
- [ ] 能构建完整的 React 应用
- [ ] 能通过 IKM 考试模拟题

## 考试前准备

1. **复习重点**
   - useEffect 的依赖数组（必考）
   - useState 的函数式更新（必考）
   - Hooks 的规则（必考）
   - React.memo 的使用（高频）
   - Redux 的单向数据流（高频）

2. **刷题资源**
   - React 官方文档：https://react.dev
   - Redux Toolkit 官方文档：https://redux-toolkit.js.org
   - IKM React.js 模拟题

3. **心态调整**
   - 不要死记硬背，理解原理
   - 多写代码，实践是最好的学习
   - 放松心态，自信应对

---

# 🚀 进阶内容：冲击 Top 20%

> **恭喜你完成 5 天基础学习！** 如果你想在 IKM ReactJS 考试中获得 **top 20%** 的成绩，请继续学习进阶内容：

## [点击这里查看：React Top 20% 进阶冲刺（第 6-10 天）](./REACT_TOP20_ADVANCED.md)

### 进阶内容包含：

- **Day 6**: React 18+ 并发特性（useTransition、useDeferredValue、Automatic Batching）
- **Day 7**: React 内部原理（Fiber 架构、Virtual DOM、Diff 算法）
- **Day 8**: React TypeScript 高级模式（泛型组件、Polymorphic Components）
- **Day 9-10**: IKM 考试终极冲刺（高级考题、模拟考试）

这些知识点是 **区分 top 20% 与其他考生的关键内容**！

祝你学习顺利，考试成功！

---

# Day 6: React 18+ 并发特性与进阶性能优化（8小时）

> **目标**：掌握 React 18+ 的新特性和并发渲染机制，这是进入 top 20% 的关键知识点

## 上午：React 18 并发特性（4小时）

### 6.1 并发渲染基础（1小时）

#### 什么是并发渲染？

```tsx
// React 17（非并发）
// 一旦开始渲染，就不能被打断
function App() {
  return (
    <>
      <SlowComponent />
      <FastComponent />
    </>
  );
}

// React 18（并发）
// React 可以暂停、中断、恢复渲染
function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
      <FastComponent />
    </>
  );
}
```

#### 并发渲染的三大特性

| 特性 | Hook/API | 用途 | IKM重要性 |
|------|----------|------|-----------|
| 自动批处理 | Automatic Batching | 减少不必要的重新渲染 | ⭐⭐⭐⭐ |
| 过渡 | useTransition | 标记非紧急更新 | ⭐⭐⭐⭐⭐ |
| 延迟值 | useDeferredValue | 延迟更新非关键部分 | ⭐⭐⭐⭐⭐ |

### 6.2 Automatic Batching（IKM高频⭐⭐⭐⭐）（45分钟）

#### 什么是批处理？

```tsx
// React 17: 只在事件处理函数中批处理
function handleClick() {
  setCount(c => c + 1);     // 不会立即重新渲染
  setName('John');          // 不会立即重新渲染
  // 最后只重新渲染一次
}

// React 17: 在 Promise、setTimeout、原生事件中不批处理
setTimeout(() => {
  setCount(c => c + 1);     // 立即重新渲染
  setName('John');          // 立即重新渲染
  // 重新渲染两次 ❌
});

// React 18: 自动批处理所有更新
setTimeout(() => {
  setCount(c => c + 1);     // 不会立即重新渲染
  setName('John');          // 不会立即重新渲染
  // 只重新渲染一次 ✅
});
```

#### IKM 考题示例

**题目：以下代码会重新渲染几次？**

```tsx
function Component() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setCount(1);
      setName('John');
    }, 1000);
  }, []);

  return <div>{count} {name}</div>;
}
```

<details>
<summary>答案</summary>

**答案: 1次**

解析：React 18+ 会自动批处理 Promise、setTimeout、原生事件中的状态更新。

</details>

### 6.3 useTransition（IKM超高频⭐⭐⭐⭐⭐）（1.5小时）

#### 基本用法

```tsx
import { useTransition } from 'react';

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;

    // 紧急更新：立即更新输入框
    setInput(value);

    // 非紧急更新：可以延迟的搜索
    startTransition(() => {
      setList(filterList(value)); // 如果很慢，可以被中断
    });
  };

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <ul>{list.map(item => <li key={item.id}>{item.name}</li>)}</ul>
    </div>
  );
}
```

#### useTransition 工作原理

```
┌─────────────────────────────────────────────────────────┐
│  紧急更新（High Priority）                                │
│  - 用户输入                                               │
│  - 点击事件                                               │
│  - 立即响应的交互                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
                 立即执行，不可中断
                          ↓
┌─────────────────────────────────────────────────────────┐
│  过渡更新（Low Priority）                                 │
│  - 搜索过滤                                               │
│  - 列表排序                                               │
│  - 复杂计算                                               │
└─────────────────────────────────────────────────────────┘
                          ↓
              可以被打断，在空闲时执行
```

#### IKM 考题：识别紧急/非紧急更新

**题目：以下哪些应该使用 useTransition？**

- A. 更新输入框的值
- B. 根据输入过滤大型列表
- C. 更新按钮点击状态
- D. 处理表单提交

<details>
<summary>答案</summary>

**答案: B**

解析：
- A: 紧急 - 用户需要立即看到输入反馈
- B: 非紧急 - 可以延迟，使用 useTransition
- C: 紧急 - 点击反馈需要立即
- D: 紧急 - 表单提交需要立即处理

</details>

#### useTransition vs 手动防抖

```tsx
// ❌ 旧方法：手动防抖
function Search() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    performSearch(debouncedInput);
  }, [debouncedInput]);

  return <input value={input} onChange={e => setInput(e.target.value)} />;
}

// ✅ 新方法：useTransition（更好的用户体验）
function Search() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  return (
    <input
      value={input}
      onChange={e => {
        setInput(e.target.value); // 紧急：立即更新输入
        startTransition(() => {   // 非紧急：延迟搜索
          setResults(performSearch(e.target.value));
        });
      }}
    />
  );
}
```

### 6.4 useDeferredValue（IKM超高频⭐⭐⭐⭐⭐）（1小时）

#### 基本用法

```tsx
import { useDeferredValue } from 'react';

function ProductList({ products }) {
  // 延迟更新查询，减少重新渲染
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = products.filter(p =>
    p.name.includes(deferredQuery)
  );

  return (
    <div>
      {filteredProducts.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### useTransition vs useDeferredValue

| 特性 | useTransition | useDeferredValue |
|------|---------------|------------------|
| 用途 | 标记非紧急更新 | 延迟值的更新 |
| 使用位置 | 在状态更新时 | 在读取状态时 |
| 返回值 | `[isPending, startTransition]` | 延迟的值 |
| 适用场景 | 有明确的更新操作 | 派生状态的优化 |

```tsx
// useTransition: 主动控制更新
function Example1() {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');

  const handleChange = (e) => {
    setFilter(e.target.value); // 紧急更新
    startTransition(() => {
      // 延迟的更新操作
    });
  };
}

// useDeferredValue: 被动延迟值
function Example2({ query }) {
  const deferredQuery = useDeferredValue(query); // 自动延迟

  // 使用 deferredQuery 进行计算
}
```

#### IKM 考题：选择正确的优化方案

**题目：有一个大型列表需要根据输入框实时过滤，应该使用哪个？**

```tsx
function Search({ items }) {
  const [query, setQuery] = useState('');
  // 使用 ? 来优化列表渲染
}
```

<details>
<summary>答案</summary>

**答案: useDeferredValue**

```tsx
function Search({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filtered = items.filter(item =>
    item.name.includes(deferredQuery)
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <List items={filtered} />
    </>
  );
}
```

</details>

### 6.5 Suspense（IKM高频⭐⭐⭐⭐）（45分钟）

#### 基本用法

```tsx
import { Suspense } from 'react';

// 数据获取组件
function Comments() {
  const comments = use(fetchComments()); // 如果还未完成，会抛出 Promise
  return comments.map(c => <Comment key={c.id} {...c} />);
}

// 使用 Suspense
function App() {
  return (
    <Suspense fallback={<CommentsSkeleton />}>
      <Comments />
    </Suspense>
  );
}
```

#### Suspense 列表

```tsx
function UserList() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="users">
        <Suspense fallback={<ProfileSkeleton />}>
          <UserProfile />
        </Suspense>
        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts />
        </Suspense>
      </div>
    </Suspense>
  );
}
```

#### IKM 考题：Suspense 边界

**题目：以下组件的加载状态显示什么？**

```tsx
function App() {
  return (
    <Suspense fallback={<div>Loading A...</div>}>
      <ComponentA />
      <Suspense fallback={<div>Loading B...</div>}>
        <ComponentB />
      </Suspense>
    </Suspense>
  );
}

// ComponentA 加载中，ComponentB 已就绪
```

<details>
<summary>答案</summary>

**答案: "Loading A..."**

解析：ComponentA 处于外部 Suspense 边界，外部的 fallback 会显示。

</details>

## 下午：高级性能优化（4小时）

### 6.6 React.memo 深度理解（IKM高频⭐⭐⭐⭐）（1.5小时）

#### 什么时候使用 React.memo？

```tsx
// ❌ 不要用于：经常变化的 props
function ListItem({ item, onItemClick }) {
  return <div onClick={() => onItemClick(item.id)}>{item.name}</div>;
}

const MemoizedListItem = React.memo(ListItem); // 无效，onItemClick 每次都是新函数

// ✅ 正确使用：稳定的 props
function ExpensiveComponent({ data, config }) {
  // 复杂计算...
}

const MemoizedExpensive = React.memo(ExpensiveComponent);
```

#### React.memo 的比较函数

```tsx
// 默认：浅比较 props
React.memo(Component);

// 自定义比较函数
React.memo(Component, (prevProps, nextProps) => {
  // 返回 true = props 相等，不重新渲染
  // 返回 false = props 不同，重新渲染

  if (prevProps.user.id !== nextProps.user.id) {
    return false; // user 改变，重新渲染
  }
  return true; // 其他改变忽略
});
```

#### IKM 考题：React.memo 的行为

**题目：以下代码会重新渲染几次？**

```tsx
const Child = React.memo(({ count }) => {
  console.log('Child rendered');
  return <div>{count}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <input onChange={e => setName(e.target.value)} />
      <Child count={count} />
    </>
  );
}
```

<details>
<summary>答案</summary>

**答案: 只在点击按钮时渲染**

解析：Child 的 props 是 count，只有 count 改变时才重新渲染。name 的改变不会影响 Child。

</details>

### 6.7 useMemo 和 useCallback 最佳实践（IKM超高频⭐⭐⭐⭐⭐）（1.5小时）

#### useMemo 使用场景

```tsx
// ✅ 场景 1: 昂贵的计算
function List({ items, filter }) {
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  return filteredItems.map(item => <Item key={item.id} {...item} />);
}

// ✅ 场景 2: 保持引用稳定
function Table({ data }) {
  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
  ], []); // 空依赖，永远不变

  return <TableComponent data={data} columns={columns} />;
}

// ❌ 不需要 useMemo 的场景
function User({ name, age }) {
  const fullName = useMemo(() => `${name} ${age}`, [name, age]);
  // 拼接字符串很快，不需要 useMemo
}
```

#### useCallback 使用场景

```tsx
// ✅ 场景 1: 传递给 React.memo 子组件
const memoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // 空依赖，函数引用永远不变

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MemoizedChild onClick={handleClick} />
    </>
  );
}

// ✅ 场景 2: 作为 useEffect 的依赖
function Chat({ roomId }) {
  const handleMessage = useCallback((msg) => {
    sendMessage(roomId, msg);
  }, [roomId]);

  useEffect(() => {
    socket.on('message', handleMessage);
    return () => socket.off('message', handleMessage);
  }, [handleMessage]);
}

// ❌ 不需要 useCallback 的场景
function Parent() {
  const [count, setCount] = useState(0);

  // 子组件不是 React.memo，useCallback 无意义
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}
```

#### IKM 考题：依赖数组陷阱

**题目：以下代码有什么问题？**

```tsx
function Component() {
  const [items, setItems] = useState([]);

  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.id - b.id);
  }, [items]);

  const handleClick = useCallback(() => {
    setItems([...items, newItem]);
  }, []);

  return <div>{sortedItems.map(...)}</div>;
}
```

<details>
<summary>答案</summary>

**问题:**

1. `items.sort()` 会修改原数组（违反 React 不可变原则）
2. `handleClick` 依赖 `items` 但没有在依赖数组中声明

**修复:**

```tsx
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.id - b.id);
}, [items]);

const handleClick = useCallback(() => {
  setItems(prev => [...prev, newItem]);
}, []);
```

</details>

### 6.8 虚拟化长列表（1小时）

#### react-window 示例

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

# Day 7: React 服务端组件与流式渲染（6小时）

## 上午：React Server Components（3小时）

### 7.1 Server Components 基础（1小时）

#### 什么是 Server Components？

```tsx
// app/page.tsx (Server Component - 默认)
async function BlogPage() {
  const posts = await db.posts.findAll(); // 直接访问数据库

  return (
    <div>
      <Header />
      {posts.map(post => <PostSummary key={post.id} {...post} />)}
    </div>
  );
}

// components/Header.tsx (Client Component)
'use client';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return <nav>...</nav>;
}
```

#### Server Components vs Client Components

| 特性 | Server Components | Client Components |
|------|-------------------|-------------------|
| 文件后缀 | 无（默认） | `'use client'` |
| 能访问后端资源 | ✅ 数据库、文件系统 | ❌ |
| 能使用 Hooks | ❌ | ✅ |
| 能添加事件处理 | ❌ | ✅ |
| 打包到客户端 | ❌ | ✅ |
| 减少 JS bundle | ✅ | ❌ |

### 7.2 Server Components 最佳实践（2小时）

```tsx
// ✅ 正确：在 Server Component 获取数据
async function UserProfile({ userId }) {
  const user = await db.users.findById(userId);
  const posts = await db.posts.findByUser(userId);

  return <UserCard user={user} posts={posts} />;
}

// ❌ 错误：在 Client Component 获取数据
'use client';
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  // 不必要的客户端请求
}
```

## 下午：流式渲染与渐进式增强（3小时）

### 7.3 Streaming SSR（1.5小时）

```tsx
import { Suspense } from 'react';

function ShopPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />  // 慢速组件
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />      // 另一个慢速组件
      </Suspense>
    </div>
  );
}
```

#### HTML 流式传输

```html
<!-- HTML 流 -->
<div id="root">
  <header>...</header>           <!-- 立即发送 -->
  <div class="skeleton">...</div> <!-- 占位符 -->
</div>
<script>...</script>              <!-- 激活 -->

<!-- 稍后发送 -->
<div class="products">...</div>   <!-- 替换骨架屏 -->
<script>...</script>              <!-- 激活这部分 -->

<!-- 最后发送 -->
<div class="reviews">...</div>
<script>...</script>
```

### 7.4 渐进式水合（1.5小时）

```tsx
// Next.js 13+ 自动优化
export default function Page() {
  return (
    <div>
      <Header />           // 优先水合
      <Suspense fallback={<Spinner />}>
        <SlowComponent />  // 延迟水合
      </Suspense>
    </div>
  );
}
```

---

# Day 8: React 内部原理与调试（8小时）

## 上午：Fiber 架构与渲染机制（4小时）

### 8.1 Virtual DOM 原理（IKM高频⭐⭐⭐⭐）（1.5小时）

#### Diff 算法核心规则

```tsx
// 规则 1: 不同类型元素 = 完全重建
// Before
<div>
  <Counter />
</div>

// After
<span>
  <Counter />
</span>
// React 会销毁旧 Counter，创建新的（状态丢失）

// 规则 2: 相同类型元素 = 更新属性
// Before
<div className="before">
  <Counter />
</div>

// After
<div className="after">
  <Counter />
</div>
// React 只更新 className，保留 Counter 状态
```

#### Key 的作用（深度理解）

```tsx
// ❌ 使用 index 作为 key
function List({ items }) {
  return items.map((item, index) => (
    <li key={index}>
      <input value={item.name} />
      {item.name}
    </li>
  ));
}

// 问题：当删除中间项时，React 会复用错误的 DOM
// items = ['A', 'B', 'C']
// 删除 B 后
// items = ['A', 'C']
// React 认为：
// - index 0: A -> A (保留)
// - index 1: B -> C (更新 B 的值为 C) ❌

// ✅ 使用稳定的 ID
function List({ items }) {
  return items.map(item => (
    <li key={item.id}>
      <input value={item.name} />
      {item.name}
    </li>
  ));
}

// 现在 React 能正确识别：
// - id: 1 (A) -> 保留
// - id: 2 (B) -> 删除
// - id: 3 (C) -> 保留
```

#### IKM 考题：key 的选择

**题目：以下哪个 key 的选择最合适？**

```tsx
function TodoList({ todos, onToggle }) {
  return todos.map(todo => (
    <TodoItem
      key={/* ? */}
      todo={todo}
      onToggle={onToggle}
    />
  ));
}
```

选项：
- A. `key={index}`
- B. `key={todo.name}`
- C. `key={todo.id}`
- D. `key={Math.random()}`

<details>
<summary>答案</summary>

**答案: C**

解析：
- A: index 会导致动态列表的问题
- B: name 可能重复或改变
- C: id 是稳定且唯一的，最佳选择
- D: random 每次渲染都会变，导致不必要的重建

</details>

### 8.2 Fiber 架构（1.5小时）

#### 什么是 Fiber？

```
旧架构（Stack Reconciler）:
┌─────────────────────────┐
│  开始渲染                │
│  └─> 同步执行所有工作    │
│      一旦开始不可中断     │
│  └─> 完成渲染            │
└─────────────────────────┘

新架构（Fiber Reconciler）:
┌─────────────────────────┐
│  开始渲染                │
│  └─> 每个工作单元        │
│      可以被打断          │
│  └─> 恢复渲染            │
│  └─> 完成渲染            │
└─────────────────────────┘
```

#### Fiber 节点结构

```typescript
// 简化的 Fiber 节点
interface Fiber {
  // 节点类型
  type: Function | string;
  key: string | null;

  // 树结构
  return: Fiber | null;  // 父节点
  child: Fiber | null;   // 第一个子节点
  sibling: Fiber | null; // 下一个兄弟节点

  // 状态
  memoizedState: any;
  memoizedProps: any;

  // 副作用
  flags: Flags;
  subtreeFlags: Flags;
}
```

### 8.3 渲染阶段详解（1小时）

#### Render 阶段 vs Commit 阶段

```tsx
// Render 阶段（可中断）
// 1. 计算哪些需要更新
// 2. 构建 Fiber 树
// 3. 创建副作用列表

function App() {
  // 这里执行的代码都在 Render 阶段
  const [count, setCount] = useState(0);

  // ❌ 不要在 Render 阶段执行副作用
  // document.title = count; // 错误！

  useEffect(() => {
    // ✅ 在 Commit 阶段执行
    document.title = `Count: ${count}`;
  }, [count]);

  return <div>{count}</div>;
}

// Commit 阶段（不可中断）
// 1. 执行 DOM 操作
// 2. 执行 useEffect
// 3. 执行 refs 回调
```

## 下午：调试技巧（4小时）

### 8.4 React DevTools（1小时）

#### Profiler 使用

```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id,              // 组件 ID
  phase,           // 'mount' 或 'update'
  actualDuration,  // 实际渲染时间
  baseDuration,    // 无 memo 的时间
  startTime,       // 开始时间
  commitTime,      // 提交时间
  interactions     // 交互集合
) {
  console.log(`${id} rendered in ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Navigation />
      <MainContent />
    </Profiler>
  );
}
```

### 8.5 常见性能问题诊断（3小时）

#### 检查不必要的渲染

```tsx
// 使用 React DevTools Profiler
// 1. 记录操作
// 2. 查看火焰图
// 3. 找出渲染时间长的组件
// 4. 检查为什么渲染

// 使用 why-did-you-render
import whyDidYouRender from '@welldone-software/why-did-you-render';

whyDidYouRender(React, {
  trackAllPureComponents: true,
});

Component.whyDidYouRender = true;
```

---

# Day 9: React TypeScript 高级模式（6小时）

## 上午：泛型组件与类型推断（3小时）

### 9.1 泛型组件（IKM高频⭐⭐⭐⭐）（1.5小时）

```tsx
// 基本泛型组件
function List<T>({
  items,
  renderItem
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return <ul>{items.map(renderItem)}</ul>;
}

// 使用
<List
  items={[1, 2, 3]}
  renderItem={(n) => <li>{n}</li>}
/>

<List
  items={[
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]}
  renderItem={(user) => <li>{user.name}</li>}
/>
```

#### 泛型约束

```tsx
// 约束 T 必须有 id 属性
interface WithId {
  id: string | number;
}

function SelectableList<T extends WithId>({
  items,
  onSelect,
}: {
  items: T[];
  onSelect: (id: T['id']) => void;
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {/* ... */}
        </li>
      ))}
    </ul>
  );
}
```

#### 多个泛型参数

```tsx
function TableColumn<T, K extends keyof T>({
  data,
  accessor,
}: {
  data: T[];
  accessor: K;
}) {
  return (
    <div>
      {data.map(row => (
        <div key={String(row.id)}>{String(row[accessor])}</div>
      ))}
    </div>
  );
}

// 使用
interface User {
  id: number;
  name: string;
  email: string;
}

<TableColumn<User, 'name' | 'email'>
  data={users}
  accessor="name"
/>
```

### 9.2 高级类型推断（1.5小时）

```tsx
// infer 关键字
type ExtractProps<T> = T extends React.ComponentType<infer P>
  ? P
  : never;

// 获取组件的 Props 类型
type ButtonProps = ExtractProps<typeof Button>;

// 条件类型
type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ButtonProps = {
  text: string;
  icon?: string;
  onClick: () => void;
};

// 让 icon 和 text 都是可选的
type OptionalButtonProps = OptionalProps<ButtonProps, 'icon' | 'text'>;
```

#### 函数重载

```tsx
// 重载签名
function useFetch<T>(url: string): { data: T | null; loading: boolean };
function useFetch<T>(url: string, options: { enabled: false }): { data: T | null };
function useFetch<T>(url: string, options: { enabled: true }): { data: T; loading: boolean };

// 实现签名
function useFetch<T>(
  url: string,
  options?: { enabled?: boolean }
) {
  // 实现细节...
}

// 使用时会根据 options 参数有不同的类型推断
const result1 = useFetch<User>('/api/user');
// result1.data: User | null

const result2 = useFetch<User>('/api/user', { enabled: true });
// result2.data: User (非空)
```

## 下午：React TypeScript 最佳实践（3小时）

### 9.3 组件 Props 类型模式（1.5小时）

```tsx
// 模式 1: 显式 Props 接口
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  return <button className={variant} {...rest}>{children}</button>;
}

// 模式 2: Props 泛型 + 扩展
type BaseProps<T> = {
  data: T[];
  keyFn: (item: T) => string | number;
};

function List<T>({ data, keyFn }: BaseProps<T> & {
  renderItem: (item: T) => React.ReactNode
}) {
  return <ul>{data.map(item => <li key={keyFn(item)} />)}</ul>;
}

// 模式 3: Polymorphic Components（多态组件）
type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PropsToAs<T extends React.ElementType, P> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AsProp<T>> &
  P;

type PolymorphicComponentProps<T extends React.ElementType, P> =
  PropsToAs<T, P> & { ref?: React.ComponentRef<T> };

function Button<T extends React.ElementType = 'button'>({
  as,
  ...rest
}: PolymorphicComponentProps<T, { variant?: 'primary' }>) {
  const Component = as || 'button';
  return <Component {...rest} />;
}

// 使用
<Button>Hello</Button>             // <button>
<Button as="a" href="/">Link</Button> // <a>
<Button as={Link} to="/home" />   // React Router Link
```

### 9.4 类型收窄与守卫（1.5小时）

```tsx
// 判别联合
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: Error;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function DataView<T>({ state }: { state: AsyncState<T> }) {
  switch (state.status) {
    case 'loading':
      return <Spinner />; // TypeScript 知道这是 LoadingState
    case 'success':
      return <DataDisplay data={state.data} />; // state.data 可用
    case 'error':
      return <ErrorDisplay error={state.error} />; // state.error 可用
  }
}

// 类型守卫
function isValidElement(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child);
}

function renderChildren(children: React.ReactNode) {
  if (isValidElement(children)) {
    // TypeScript 知道 children 是 React.ReactElement
    return children.type;
  }
  return null;
}
```

---

# Day 10: React 架构模式与面试准备（8小时）

## 上午：React 架构模式（4小时）

### 10.1 容器/展示组件模式（1小时）

```tsx
// Container Component（逻辑）
function UserListContainer() {
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return <UserList users={users} />;
}

// Presentational Component（UI）
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} name={user.name} email={user.email} />
      ))}
    </ul>
  );
}
```

### 10.2 组合模式（1.5小时）

```tsx
// 灵活的布局组件
function Box({ header, footer, children }: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="box">
      {header && <div className="box-header">{header}</div>}
      <div className="box-body">{children}</div>
      {footer && <div className="box-footer">{footer}</div>}
    </div>
  );
}

// 使用组合
function App() {
  return (
    <Box
      header={<h2>Title</h2>}
      footer={<button>Action</button>}
    >
      <p>Content</p>
    </Box>
  );
}

// render props 模式
function Mouse({ render }: {
  render: (state: { x: number; y: number }) => React.ReactNode
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// 使用
<Mouse render={({ x, y }) => (
  <p>Mouse position: {x}, {y}</p>
)} />
```

### 10.3 HOC 模式（1.5小时）

```tsx
// 基础 HOC
function withLoading<P extends object>(
  Component: React.ComponentType<P & { loading: boolean }>
) {
  return (props: P) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // 模拟数据加载
      setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
      return <Spinner />;
    }

    return <Component {...props} loading={loading} />;
  };
}

// 使用
const UserListWithLoading = withLoading(UserList);

// 组合多个 HOC
const enhance = compose(
  withLoading,
  withErrorBoundary,
  withRedux
);

const EnhancedUserList = enhance(UserList);
```

## 下午：IKM 考试终极冲刺（4小时）

### 10.4 Top 20% 必会的知识点（2小时）

#### 1. React 并发特性深度题

**题目：以下代码中，用户点击按钮后，输入框的响应时间是？**

```tsx
function App() {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);

  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    startTransition(() => {
      setList(large.filter(x => x.includes(value))); // 耗时 500ms
    });
  };

  return (
    <>
      <input value={text} onChange={handleChange} />
      {isPending && <Spinner />}
      <List items={list} />
    </>
  );
}
```

<details>
<summary>答案与解析</summary>

**答案: 立即响应**

解析：
- `setText(value)` 是紧急更新，输入框立即更新
- `startTransition` 内的 `setList` 是低优先级更新，可以被中断
- 即使过滤耗时 500ms，用户输入也不会卡顿

</details>

#### 2. 依赖数组高级题

**题目：以下代码的输出是什么？**

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count);
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setStep(s => s + 1)}>Change Step</button>
    </>
  );
}
```

<details>
<summary>答案与解析</summary>

**答案: 总是打印 0**

解析：
- 闭包陷阱！useEffect 捕获了初始的 count 值（0）
- 每次改变 step 会重新创建 interval，但仍然打印旧的 count 值
- 修复：使用 `useRef` 或将 count 加入依赖数组

```tsx
// 修复 1: useRef
function Counter() {
  const countRef = useRef(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    countRef.current = count; // 在渲染时更新 ref
  });

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);
}

// 修复 2: useEffect + 依赖 count
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => {
      console.log(c + 1);
      return c + 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, [step]);
```

</details>

#### 3. React.memo 进阶题

**题目：以下组件会重新渲染吗？**

```tsx
const Child = React.memo(({ data, onClick }) => {
  console.log('Child rendered');
  return <div onClick={() => onClick(data.id)}>{data.name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({ id: 1, name: 'Item' });

  const handleClick = (id) => {
    console.log('Clicked:', id);
  };

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child data={data} onClick={handleClick} />
    </>
  );
}
```

<details>
<summary>答案与解析</summary>

**答案: 每次父组件渲染都会重新渲染**

原因：
1. `onClick` prop 是一个新函数（每次渲染都创建）
2. React.memo 默认是浅比较，新函数 !== 旧函数
3. 即使 data 没变，也会重新渲染

**修复:**

```tsx
// 方法 1: useCallback
const handleClick = useCallback((id) => {
  console.log('Clicked:', id);
}, []);

// 方法 2: 自定义比较函数
const Child = React.memo(({ data, onClick }) => {
  return <div onClick={() => onClick(data.id)}>{data.name}</div>;
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});

// 方法 3: 改变 props 设计
const Child = React.memo(({ data }) => {
  console.log('Child rendered');
  return <div onClick={() => handleClick(data.id)}>{data.name}</div>;
});
```

</details>

### 10.5 最终模拟考试（2小时）

#### 模拟题 1：并发特性（20分）

```tsx
// 以下代码的输出顺序是什么？
function App() {
  console.log('A');

  useEffect(() => {
    console.log('B');

    return () => console.log('C');
  }, []);

  useLayoutEffect(() => {
    console.log('D');

    return () => console.log('E');
  }, []);

  console.log('F');

  return <div>App</div>;
}
```

<details>
<summary>答案</summary>

**输出: A → F → D → B**

解析：
1. A: 函数组件开始
2. F: 函数组件结束
3. D: useLayoutEffect 同步执行（在 DOM 更新后，浏览器绘制前）
4. B: useEffect 异步执行（在浏览器绘制后）

卸载时输出: E → C (useLayoutEffect 的清理先执行)

</details>

#### 模拟题 2：状态更新队列（25分）

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('Start:', count);

    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);

    console.log('End:', count);

    setTimeout(() => {
      console.log('Timeout:', count);
    }, 0);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

<details>
<summary>答案</summary>

**输出:**
- Start: 0
- End: 0
- 组件渲染显示: 1
- Timeout: 1

解析：
1. 所有 `setCount(count + 1)` 都读取同一个 count (0)
2. React 批处理它们，最终结果 = 0 + 1 = 1（不是 3！）
3. setTimeout 中读取的是闭包捕获的值（1）

**修复为 +3:**

```tsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

</details>

#### 模拟题 3：组件生命周期（30分）

```tsx
function Parent() {
  const [showChild, setShowChild] = useState(true);

  return (
    <>
      {showChild && <Child />}
      <button onClick={() => setShowChild(false)}>Unmount</button>
    </>
  );
}

function Child() {
  const ref = useRef(null);

  useEffect(() => {
    console.log('Mount');
    return () => console.log('Unmount');
  });

  return <div ref={ref}>Child</div>;
}
```

<details>
<summary>问题</summary>

1. 组件挂载时输出什么？
2. 点击按钮后输出什么？
3. ref.current 在 useEffect 中是什么？

<details>
<summary>答案</summary>

**答案:**

1. 挂载输出: `Mount`
2. 点击输出: `Unmount`
3. `ref.current` 是 `<div>` DOM 元素

</details>

</details>

#### 模拟题 4：性能优化（25分）

**优化以下代码，避免不必要的渲染：**

```tsx
function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', selected: false },
    { id: 2, name: 'Item 2', selected: false },
  ]);

  const [filter, setFilter] = useState('');

  const toggleItem = (id) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, selected: !item.selected }
        : item
    ));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filteredItems.map(item => (
        <Item
          key={item.id}
          name={item.name}
          selected={item.selected}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </>
  );
}

function Item({ name, selected, onToggle }) {
  console.log('Item rendered:', name);
  return (
    <div onClick={onToggle} style={{ opacity: selected ? 1 : 0.5 }}>
      {name} {selected ? '✓' : ''}
    </div>
  );
}
```

<details>
<summary>优化方案</summary>

```tsx
// 1. 优化 Item 组件
const Item = React.memo(function Item({ name, selected, onToggle }) {
  return (
    <div onClick={onToggle} style={{ opacity: selected ? 1 : 0.5 }}>
      {name} {selected ? '✓' : ''}
    </div>
  );
});

// 2. 优化 toggleItem 回调
const toggleItem = useCallback((id) => {
  setItems(prevItems => prevItems.map(item =>
    item.id === id
      ? { ...item, selected: !item.selected }
      : item
  ));
}, []);

// 3. 优化过滤
const filteredItems = useMemo(() =>
  items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  ),
  [items, filter]
);

// 4. 完整优化版本
function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', selected: false },
    { id: 2, name: 'Item 2', selected: false },
  ]);

  const [filter, setFilter] = useState('');

  const toggleItem = useCallback((id) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, selected: !item.selected }
        : item
    ));
  }, []);

  const filteredItems = useMemo(() =>
    items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    ),
    [items, filter]
  );

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filteredItems.map(item => (
        <MemoizedItem
          key={item.id}
          item={item}
          onToggle={toggleItem}
        />
      ))}
    </>
  );
}

// 更好的 Item 组件设计
const MemoizedItem = React.memo(function MemoizedItem({
  item,
  onToggle
}: {
  item: { id: number; name: string; selected: boolean };
  onToggle: (id: number) => void;
}) {
  return (
    <div onClick={() => onToggle(item.id)} style={{ opacity: item.selected ? 1 : 0.5 }}>
      {item.name} {item.selected ? '✓' : ''}
    </div>
  );
});
```

</details>

---

# 附录：Top 20% 进阶知识清单

## React 18+ 新特性（必考）

- [x] Automatic Batching（自动批处理）
- [x] useTransition（过渡）
- [x] useDeferredValue（延迟值）
- [x] Suspense（Suspense 边界和嵌套）
- [x] 并发渲染机制

## 性能优化（高频）

- [x] React.memo 的正确使用
- [x] useMemo 的适用场景
- [x] useCallback 的适用场景
- [x] 虚拟化长列表
- [x] 代码分割和懒加载

## 内部原理（区分度）

- [x] Fiber 架构
- [x] Virtual DOM 和 Diff 算法
- [x] Render 阶段 vs Commit 阶段
- [x] key 的深度理解
- [x] 合成事件系统

## TypeScript 高级（加分项）

- [x] 泛型组件
- [x] 类型推断和类型收窄
- [x] Polymorphic Components
- [x] 高阶类型（infer、映射类型）

## 架构模式（加分项）

- [x] 容器/展示组件
- [x] 组合模式
- [x] HOC 模式
- [x] Render Props

## 考试策略

1. **快速得分题**（确保不丢分）：
   - Hooks 规则
   - 依赖数组基础
   - JSX 语法规则
   - Props 单向数据流

2. **区分度题**（拉开差距）：
   - 并发特性
   - 闭包陷阱
   - 性能优化场景判断
   - 内部原理

3. **时间分配**：
   - 简单题：30秒内完成
   - 中等题：1-2分钟
   - 难题：3-5分钟
   - 标记不确定的，最后回看

---

**祝你考试成功！记住：理解原理比死记硬背更重要。**
