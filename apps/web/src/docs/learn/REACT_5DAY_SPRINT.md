# React 五天冲刺计划（Angular 开发者版）

> **目标**：从 Angular 背景出发，在 5 天内掌握 React 核心概念，重点攻克 Hooks 和 Redux，为 IKM 考试做好准备。

---

## 学习路径概览

```
Day 1: React 基础 + JSX → 组件与 Props
Day 2: useState + useEffect → Hooks 深度理解
Day 3: 自定义 Hooks + 性能优化 → useMemo/useCallback
Day 4: Redux 原理与实战 → 状态管理架构
Day 5: React Router + 表单 → 完整应用构建 + IKM 考试模拟
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

| Angular | React | 思维转换 |
|---------|-------|----------|
| `*ngIf` | `{condition && <div/>}` | 条件是 JS 表达式 |
| `*ngFor` | `{items.map(item => <li key={item.id}>{item.name}</li>)}` | 用 JS 数组方法 |
| `[class.active]="isActive"` | `className={isActive ? 'active' : ''}` | 字符串拼接 |
| `(click)="handleClick()"` | `onClick={handleClick}` | 函数引用，不调用 |
| `{{ value }}` | `{value}` | JS 表达式插值 |
| `@Input() userId` | `function User({ userId })` | 函数参数 |
| `@Output() emit = new EventEmitter()` | `props.onEmit()` | 回调函数 |
| `ngOnInit()` | `useEffect(() => {}, [])` | Hooks 依赖数组 |
| `ngOnDestroy()` | `useEffect(() => { return cleanup }, [])` | 返回清理函数 |
| `BehaviorSubject` | `useState` + 选择器 | 状态快照 |

### 1.2 JSX 深度解析（1小时）

#### 什么是 JSX？

```tsx
// JSX 只是 React.createElement 的语法糖
const element = <h1>Hello, world!</h1>;

// 编译后
const element = React.createElement('h1', null, 'Hello, world!');
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

| HTML 属性 | JSX 属性 | 说明 |
|----------|----------|------|
| `class` | `className` | class 是 JS 保留字 |
| `for` | `htmlFor` | for 是 JS 保留字 |
| `tabindex` | `tabIndex` | camelCase |
| `readonly` | `readOnly` | camelCase |
| ` colspan` | `colSpan` | camelCase |

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
  age?: number;  // 可选
  onUpdate?: (newName: string) => void;  // 回调函数
  children?: React.ReactNode;  // 子元素
}

// 使用 Props
function UserCard({ name, age, onUpdate, children }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      {children}
      <button onClick={() => onUpdate?.('New Name')}>
        Update
      </button>
    </div>
  );
}

// 父组件使用
function App() {
  const handleUpdate = (newName: string) => {
    console.log('Updated:', newName);
  };

  return (
    <UserCard
      name="Alice"
      age={30}
      onUpdate={handleUpdate}
    >
      <p>This is children content</p>
    </UserCard>
  );
}
```

#### Props 解构与默认值

```tsx
// 解构赋值
function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
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
</Container>

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
  name = 'New Name';  // ❌ 不能修改 props
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

| 事件类型 | Angular 事件 | React 事件 |
|----------|-------------|------------|
| 点击 | `(click)` | `onClick` |
| 输入 | `(input)` / `(ngModelChange)` | `onChange` / `onInput` |
| 提交 | `(ngSubmit)` | `onSubmit` |
| 焦点 | `(focus)` / `(blur)` | `onFocus` / `onBlur` |
| 悬停 | `(mouseenter)` / `(mouseleave)` | `onMouseEnter` / `onMouseLeave` |
| 键盘 | `(keydown)` / `(keyup)` | `onKeyDown` / `onKeyUp` |

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
    console.log(e.target.value);  // 输入的值
    console.log(e.target.name);   // 元素的 name 属性
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // 阻止默认行为（表单提交）
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        type="text"
        onChange={handleChange}
      />
    </form>
  );
}
```

#### 事件对象类型速查

```typescript
// Clipboard Events
React.ClipboardEvent<T>

// Composition Events
React.CompositionEvent<T>

// Drag Events
React.DragEvent<T>

// Focus Events
React.FocusEvent<T>

// Form Events
React.FormEvent<T>

// Keyboard Events
React.KeyboardEvent<T>

// Mouse Events
React.MouseEvent<T>

// Pointer Events
React.PointerEvent<T>

// Touch Events
React.TouchEvent<T>

// UI Events
React.UIEvent<T>

// Wheel Events
React.WheelEvent<T>

// Animation Events
React.AnimationEvent<T>

// Transition Events
React.TransitionEvent<T>
```

## 今日练习（Day 1）

### 练习 1: JSX 转换

将以下 Angular 模板转换为 React JSX：

```html
<!-- Angular -->
<div *ngIf="user">
  <h1 [class.admin]="user.isAdmin">{{ user.name }}</h1>
  <ul>
    <li *ngFor="let item of items; trackBy: trackById" [class.active]="item.active">
      {{ item.name }}
    </li>
  </ul>
  <button (click)="handleClick()" [disabled]="isLoading">
    Submit
  </button>
</div>
```

<details>
<summary>查看答案</summary>

```tsx
// React
{user && (
  <div>
    <h1 className={user.isAdmin ? 'admin' : ''}>{user.name}</h1>
    <ul>
      {items.map(item => (
        <li
          key={item.id}
          className={item.active ? 'active' : ''}
        >
          {item.name}
        </li>
      ))}
    </ul>
    <button onClick={handleClick} disabled={isLoading}>
      Submit
    </button>
  </div>
)}
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

# Day 2: useState 与 useEffect 深度（8小时）

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
  const [text, setText] = useState('');

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

// 示例 3: 对象状态
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
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
      {todos.map((todo, index) => <li key={index}>{todo}</li>)}
    </ul>
  );
}
```

### 2.2 useState 函数式更新（重点）（1小时）

#### 为什么需要函数式更新？

```tsx
// ❌ 问题：连续更新可能丢失状态
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);  // 读取当前 render 的 count
    setCount(count + 1);  // 还是读取同一个 count
    // 结果：count 只增加了 1
  };

  return <button onClick={handleClick}>{count}</button>;
}

// ✅ 解决方案：函数式更新
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 1);  // c 是最新的 state
    setCount(c => c + 1);  // 每次都基于最新的值
    // 结果：count 增加了 2
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

#### 函数式更新的适用场景

1. **连续更新状态**
```tsx
const incrementThreeTimes = () => {
  setCount(c => c + 1);
  setCount(c => c + 1);
  setCount(c => c + 1);
};
```

2. **基于旧状态计算新状态**
```tsx
const [filters, setFilters] = useState({ keyword: '', type: 'all' });

const addFilter = (key: string, value: string) => {
  setFilters(f => ({ ...f, [key]: value }));  // 使用函数式更新
};
```

3. **在异步操作中更新状态**
```tsx
const fetchDataAndUpdate = async () => {
  const data = await api.getData();
  setData(d => [...d, ...data]);  // 确保 d 是最新值
};
```

### 2.3 状态更新是异步的（1小时）

#### 理解批处理（Batching）

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const handleClick = () => {
    setCount(1);
    setName('Alice');
    console.log(count, name);  // 仍然是 0, ''
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
  setCount(1);  // 批处理
  setName('Alice');  // 批处理
}

fetchData().then(() => {
  setCount(2);  // 不批处理（React 17）
  setName('Bob');  // 不批处理
});

// React 18+: 自动批处理所有更新
fetchData().then(() => {
  setCount(2);  // 批处理
  setName('Bob');  // 批处理
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
  todos.push(item);  // 直接修改
  setTodos(todos);   // 引用没变，React 不会重新渲染
};

// ✅ 正确：创建新数组
const addItem = (item: string) => {
  setTodos([...todos, item]);  // 展开运算符
};

// 常见数组操作

// 添加
setTodos([...todos, newItem]);

// 在开头添加
setTodos([newItem, ...todos]);

// 删除
setTodos(todos.filter(t => t.id !== id));

// 更新
setTodos(todos.map(t =>
  t.id === id ? { ...t, name: newName } : t
));

// 排序（创建新数组）
setTodos([...todos].sort((a, b) => a.name.localeCompare(b.name)));
```

#### 对象的不可变操作

```tsx
// ❌ 错误：直接修改对象
const updateName = (name: string) => {
  user.name = name;  // 直接修改
  setUser(user);     // 引用没变
};

// ✅ 正确：创建新对象
const updateName = (name: string) => {
  setUser({ ...user, name });  // 对象展开
};

// 嵌套对象
const [user, setUser] = useState({
  name: 'Alice',
  address: {
    city: 'Beijing',
    street: 'Main St'
  }
});

// ❌ 错误
setUser({
  ...user,
  address: { city: 'Shanghai' }  // 丢失了 street
});

// ✅ 正确
setUser({
  ...user,
  address: {
    ...user.address,
    city: 'Shanghai'
  }
});
```

#### 使用 Immer 简化不可变更新

```tsx
import { useImmer } from 'use-immer';  // 或 Zustand 的 immer 中间件

function UserForm() {
  const [user, setUser] = useImmer({
    name: 'Alice',
    address: {
      city: 'Beijing',
      street: 'Main St'
    }
  });

  const updateCity = (city: string) => {
    setUser(draft => {
      draft.address.city = city;  // 可以直接修改！
    });
  };

  return <div>{user.address.city}</div>;
}
```

## 下午：useEffect 完全掌握（4小时）

### 2.5 useEffect 基础（1小时）

#### useEffect 是什么？

- useEffect 用于处理副作用（Side Effects）
- 副作用包括：数据获取、订阅、DOM 操作、日志等
- 替代类组件的 componentDidMount, componentDidUpdate, componentWillUnmount

#### useEffect 基本语法

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
  console.log('Effect runs');
}, [value]);  // value 变化时运行

// Object.is() 示例
Object.is(1, 1);        // true
Object.is('a', 'a');    // true
Object.is({}, {});      // false（不同引用）
Object.is([], []);      // false（不同引用）
Object.is(NaN, NaN);    // true
```

#### 依赖数组常见陷阱

**陷阱 1: 依赖对象/数组**

```tsx
// ❌ 错误：对象字面量每次都是新引用
useEffect(() => {
  search({ keyword: 'test' });
}, [{ keyword: 'test' }]);  // 每次渲染都是新对象，无限循环

// ✅ 方案 1: 移到组件外
const SEARCH_PARAMS = { keyword: 'test' };

useEffect(() => {
  search(SEARCH_PARAMS);
}, [SEARCH_PARAMS]);

// ✅ 方案 2: 使用 useMemo
const params = useMemo(() => ({ keyword: 'test' }), []);

useEffect(() => {
  search(params);
}, [params]);

// ✅ 方案 3: 如果值是固定的，移除依赖
useEffect(() => {
  search({ keyword: 'test' });
}, []);  // 值不会变化，不需要依赖
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
  }, [fetchData]);  // fetchData 每次都是新的，无限循环
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
      console.log(count);  // 永远是 0
    }, 1000);

    return () => clearInterval(timer);
  }, []);  // 依赖数组为空，count 永远是初始值

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ 方案 1: 添加依赖
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(timer);
}, [count]);  // 添加 count 依赖

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
      console.log(countRef.current);  // 总是最新的值
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2.7 useEffect 最佳实践（1小时）

#### 实践 1: 不要过度使用 useEffect

```tsx
// ❌ 错误：不必要的 useEffect
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 不必要的 useEffect
  useEffect(() => {
    setFullName(`${name} ${email}`);
  }, [name, email]);

  return <div>{fullName}</div>;
}

// ✅ 正确：直接计算派生状态
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fullName = `${name} ${email}`;  // 直接计算

  return <div>{fullName}</div>;
}
```

#### 实践 2: 分离不同的副作用

```tsx
// ❌ 错误：一个 effect 做多件事
useEffect(() => {
  const timer = setInterval(() => setCount(c => c + 1), 1000);
  document.title = `Count: ${count}`;
  fetchUser(userId).then(setUser);

  return () => clearInterval(timer);
}, [count, userId]);

// ✅ 正确：每个 effect 做一件事
useEffect(() => {
  const timer = setInterval(() => setCount(c => c + 1), 1000);
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

  return (
    <button onClick={incrementThreeTimes}>
      Count: {count}
    </button>
  );
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
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  };

  return (
    <button onClick={incrementThreeTimes}>
      Count: {count}
    </button>
  );
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
      .then(res => res.json())
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
        .then(res => res.json())
        .then(setUser);
    };
    loadUser();
  }, [userId]);  // 只依赖 userId

  return user ? <div>{user.name}</div> : <Loading />;
}

// 方案 2: 使用 useCallback
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  const loadUser = useCallback(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
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

# Day 3: 自定义 Hooks 与性能优化（8小时）

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
      const valueToStore = value instanceof Function ? value(storedValue) : value;
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
  const [name, setName] = useLocalStorage('name', '');

  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// 示例 2: useToggle
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
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
  const { data: users, error, loading } = useFetch<User[]>('/api/users');

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
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
  const username = useFormInput('');
  const password = useFormInput('');

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
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 现代浏览器
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// 使用
function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div className={isMobile ? 'mobile' : 'desktop'}>
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
  const [query, setQuery] = useState('');
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
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ... 很多逻辑
}

// ✅ 好的：拆分成多个 Hook
function useUser() { /* ... */ }
function useAuth() { /* ... */ }
function useToken() { /* ... */ }
```

#### 原则 2: 参数化配置

```tsx
// ❌ 不好：硬编码配置
function useFetch() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/users').then(setData);  // 硬编码 URL
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
  return { value, toggle: () => setValue(v => !v) };  // toggle 每次都是新的
}

// ✅ 好的：使用 useCallback
function useToggle() {
  const [value, setValue] = useState(false);
  const toggle = useCallback(() => setValue(v => !v), []);
  return { value, toggle };
}
```

## 下午：性能优化（4小时）

### 3.4 React.memo（1小时）

#### React.memo 基础

```tsx
// React.memo 是一个高阶组件
// 它会对 props 进行浅比较，如果 props 没变，就不重新渲染

const MemoComponent = React.memo(function Component({ name }: { name: string }) {
  console.log('Component rendered');
  return <div>{name}</div>;
});

// 使用
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoComponent name="Alice" />  {/* count 变化时不会重新渲染 */}
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
  const user = { name: 'Alice' };  // 每次都是新对象
  return <Child user={user} />;
};

const Child = React.memo(({ user }: { user: { name: string } }) => {
  return <div>{user.name}</div>;
});
// 每次都会重新渲染，因为 user 是新对象

// ✅ 方案 1: 对象定义在组件外
const USER = { name: 'Alice' };
const Parent = () => {
  return <Child user={USER} />;
};

// ✅ 方案 2: 使用 useMemo
const Parent = () => {
  const user = useMemo(() => ({ name: 'Alice' }), []);
  return <Child user={user} />;
};

// ❌ 陷阱 2: props 是函数，总是返回 false
const Parent = () => {
  const handleClick = () => console.log('clicked');  // 每次都是新函数
  return <Child onClick={handleClick} />;
};

// ✅ 方案: 使用 useCallback
const Parent = () => {
  const handleClick = useCallback(() => console.log('clicked'), []);
  return <Child onClick={handleClick} />;
};
```

### 3.5 useMemo（1.5小时）

#### useMemo 基础

```tsx
// useMemo 缓存计算结果
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 示例 1: 缓存过滤结果
function UserList({ users, filter }: { users: User[]; filter: string }) {
  const filteredUsers = useMemo(() => {
    console.log('Filtering users...');
    return users.filter(u => u.name.includes(filter));
  }, [users, filter]);  // users 或 filter 变化时重新计算

  return <ul>{filteredUsers.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// 示例 2: 缓存排序结果
function SortedList({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return <ul>{sortedItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
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
      .filter(d => d.value > 0)
      .map(d => ({ ...d, normalized: d.value / max(data.map(d => d.value)) }))
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
  const style = { color: 'red', fontSize: '20px' };
  return <Child style={style} />;

  // ✅ 引用稳定
  const style = useMemo(() => ({ color: 'red', fontSize: '20px' }), []);
  return <Child style={style} />;
}
```

**场景 3: 作为其他 Hook 的依赖**

```tsx
function Component() {
  const options = useMemo(() => ({
    root: document.getElementById('scroll-container'),
    threshold: 0.5
  }), []);

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
const isActive = useMemo(() => status === 'active', [status]);
// 直接 const isActive = status === 'active'

// ❌ 过度使用 3: 对象总是被重新创建
function Parent() {
  const [count, setCount] = useState(0);

  // user 每次都是新对象，useMemo 没意义
  const user = useMemo(() => ({
    id: 1,
    name: 'Alice',
    count  // 依赖 count
  }), [count]);

  return <Child user={user} />;
}
```

### 3.6 useCallback（1.5小时）

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
  onClick
}: {
  name: string;
  onClick: () => void;
}) {
  console.log('Child rendered');
  return <button onClick={onClick}>{name}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次 Parent 渲染，Child 都会重新渲染
  const handleClick = () => console.log('clicked');
  return <Child name="Button" onClick={handleClick} />;

  // ✅ 只有 count 变化时，handleClick 才会变化
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // 空依赖数组

  return <Child name="Button" onClick={handleClick} />;
}
```

**场景 2: 作为其他 Hook 的依赖**

```tsx
function Chat({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');

  // ✅ 使用 useCallback 稳定函数引用
  const sendMessage = useCallback(() => {
    if (message.trim()) {
      postMessage(roomId, message);
      setMessage('');
    }
  }, [roomId, message]);  // 依赖 roomId 和 message

  useEffect(() => {
    const connection = createConnection(roomId, sendMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, sendMessage]);  // sendMessage 变化时重新创建连接

  return <input value={message} onChange={e => setMessage(e.target.value)} />;
}
```

#### useCallback 陷阱

```tsx
// ❌ 陷阱 1: 依赖太多，频繁创建新函数
const handleClick = useCallback(() => {
  doSomething(a, b, c, d, e, f);
}, [a, b, c, d, e, f]);  // 任何一个变化都会创建新函数

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
}, []);  // 空依赖数组
```

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
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);

  const filteredUsers = users.filter(u => u.name.includes(filter));

  const sortedUsers = filteredUsers.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {sortedUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

const UserCard = ({ user }: { user: User }) => {
  console.log('UserCard rendered:', user.id);
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
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);

  // 1. 使用 useMemo 缓存过滤结果
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.includes(filter));
  }, [users, filter]);

  // 2. 使用 useMemo + 创建新数组来排序
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [filteredUsers]);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {sortedUsers.map(user => (
        <MemoUserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// 3. 使用 React.memo 包裹组件
const MemoUserCard = React.memo(({ user }: { user: User }) => {
  console.log('UserCard rendered:', user.id);
  return <div>{user.name}</div>;
});
```

</details>

---

# Day 4: Redux 深度理解（8小时）

## 上午：Redux 核心概念（4小时）

### 4.1 为什么需要 Redux？（1小时）

#### Context 的局限性

```tsx
// ❌ Context 的问题
const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],
  // ... 很多状态
});

function App() {
  const [state, setState] = useState({});

  // 问题：任何状态变化都会导致所有消费者重新渲染
  return (
    <AppContext.Provider value={{ state, setState }}>
      <Header />        {/* 通知变化时重新渲染 */}
      <Sidebar />       {/* 通知变化时重新渲染 */}
      <MainContent />   {/* 通知变化时重新渲染 */}
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

### 4.2 Redux 三大核心概念（2小时）

#### 概念 1: Action

```typescript
// Action 是一个普通对象，描述"发生了什么"
interface Action {
  type: string;        // 必需：动作类型
  payload?: any;       // 可选：负载数据
}

// 示例
const addTodoAction = {
  type: 'todos/add',
  payload: {
    id: 1,
    text: 'Learn Redux',
    completed: false
  }
};

// Action Creator
function addTodo(text: string) {
  return {
    type: 'todos/add',
    payload: {
      id: Date.now(),
      text,
      completed: false
    }
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

function todosReducer(state: TodoState = initialState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'todos/add':
      return [...state, action.payload];

    case 'todos/toggle':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case 'todos/delete':
      return state.filter(todo => todo.id !== action.payload.id);

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
import { createStore } from 'redux';

// 创建 store
const store = createStore(todosReducer);

// Store 的方法
store.getState();              // 获取当前状态
store.dispatch(addTodo('...')); // 发送 action
store.subscribe(() => {        // 订阅状态变化
  console.log(store.getState());
});
```

### 4.3 Redux 数据流（1小时）

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

## 下午：Redux Toolkit（RTK）实战（4小时）

### 4.4 Redux Toolkit 简介（1小时）

#### 为什么使用 Redux Toolkit？

- Redux Toolkit 是 Redux 的官方推荐工具集
- 简化了 Redux 的配置和使用
- 包含了最佳实践和常用工具
- 自动安装 Redux DevTools Extension

#### Redux Toolkit 的核心 API

```typescript
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// configureStore: 创建 store（自动配置）
// createSlice: 简化 reducer 和 action 的创建
// createAsyncThunk: 处理异步操作
// createEntityAdapter: 管理规范化数据
```

### 4.5 createSlice 深度（1.5小时）

#### createSlice 基础

```typescript
import { createSlice } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  status: 'idle' | 'loading' | 'error';
}

const initialState: TodoState = {
  items: [],
  status: 'idle'
};

// createSlice 自动生成：
// 1. action creators (addTodo, toggleTodo, deleteTodo)
// 2. action types (todos/addTodo, todos/toggleTodo, todos/deleteTodo)
// 3. reducer 函数
const todosSlice = createSlice({
  name: 'todos',  // slice 名称，会作为 action type 的前缀
  initialState,
  reducers: {
    // 定义 reducer 函数
    // RTK 自动生成对应的 action creator
    addTodo: (state, action: PayloadAction<{ text: string }>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload.text,
        completed: false
      });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;  // Immer 允许直接修改！
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      // 使用 Immer 的数组过滤
      state.items = state.items.filter(t => t.id !== action.payload);
    }
  }
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

### 4.6 createAsyncThunk 异步处理（1.5小时）

#### createAsyncThunk 基础

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

// createAsyncThunk 自动生成三个 action:
// - fetchTodos.pending
// - fetchTodos.fulfilled
// - fetchTodos.rejected

export const fetchTodos = createAsyncThunk(
  'todos/fetch',  // action type 前缀
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      return data;  // 这个值会作为 action.payload
    } catch (error) {
      return rejectWithValue(error.message);  // 这个值会作为 action.payload (rejected)
    }
  }
);

// 在 createSlice 中处理异步 actions
const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null as string | null
  },
  reducers: {
    // ... 同步 reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
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

### 4.7 configureStore 配置（30分钟）

```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import userReducer from './userSlice';

// configureStore 自动配置：
// - Redux DevTools Extension
// - Redux Thunk 中间件
// - Immer 中间件
// - 序列化检查

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(customMiddleware),  // 添加自定义中间件
  devTools: process.env.NODE_ENV !== 'production'  // 开发环境启用 DevTools
});

// 类型推导
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4.8 React-Redux Hooks（30分钟）

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

| 维度 | Redux Toolkit | Zustand |
|------|--------------|---------|
| Bundle Size | ~10KB+ | ~1KB |
| 样板代码 | 相对较多 | 很少 |
| 学习曲线 | 陡峭 | 平缓 |
| DevTools | 专用 DevTools | 简单的 DevTools |
| 中间件 | Thunk, Saga 等 | 内置 |
| TypeScript | 需要手动配置 | 自动推导 |
| 适用场景 | 大型应用、团队协作 | 个人项目、小型应用 |

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
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    // TODO: 实现 increment, decrement, incrementByAmount
  }
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
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodosState = {
  items: JSON.parse(localStorage.getItem('todos') || '[]'),
  filter: 'all'
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
      localStorage.setItem('todos', JSON.stringify(state.items));
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(state.items));
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(state.items));
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo, setFilter } = todosSlice.actions;
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
      case 'active': return items.filter(t => !t.completed);
      case 'completed': return items.filter(t => t.completed);
      default: return items;
    }
  }, [items, filter]);

  return (
    <ul>
      {filteredTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

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
   setCount(c => c + 1);
   setCount(c => c + 1);
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
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
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

| Hook | 用途 | 语法 |
|------|------|------|
| `useState` | 管理组件状态 | `const [state, setState] = useState(initialState)` |
| `useEffect` | 处理副作用 | `useEffect(setup, dependencies?)` |
| `useContext` | 读取 Context | `const value = useContext(MyContext)` |
| `useReducer` | 复杂状态管理 | `const [state, dispatch] = useReducer(reducer, initialState)` |
| `useRef` | 访问 DOM 或存储可变值 | `const ref = useRef(initialValue)` |
| `useMemo` | 缓存计算结果 | `const memoizedValue = useMemo(() => computeExpensiveValue(), deps)` |
| `useCallback` | 缓存函数引用 | `const memoizedFn = useCallback(() => {...}, deps)` |
| `useLayoutEffect` | 同步执行副作用 | `useLayoutEffect(setup, dependencies?)` |
| `useTransition` | 标记非紧急更新 | `const [isPending, startTransition] = useTransition()` |
| `useDeferredValue` | 延迟更新值 | `const deferredValue = useDeferredValue(value)` |
| `useId` | 生成唯一 ID | `const id = useId()` |

## 自定义 Hooks 模式

| 模式 | 用途 | 示例 |
|------|------|------|
| `useLocalStorage` | 本地存储 | `const [value, setValue] = useLocalStorage('key', initialValue)` |
| `useFetch` | 数据获取 | `const { data, error, loading } = useFetch(url)` |
| `useToggle` | 切换布尔值 | `const [value, toggle] = useToggle(false)` |
| `usePrevious` | 获取上一个值 | `const prevValue = usePrevious(value)` |
| `useMediaQuery` | 响应式检测 | `const isMobile = useMediaQuery('(max-width: 768px)')` |
| `useDebounce` | 防抖 | `const debouncedValue = useDebounce(value, 300)` |
| `useForm` | 表单管理 | `const { values, errors, handleSubmit } = useForm()` |

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

祝你学习顺利，考试成功！
