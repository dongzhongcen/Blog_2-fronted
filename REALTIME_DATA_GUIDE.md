# 数据实时性与加载动画指南

## 🎬 进场加载动画

### 动画流程
进入博客时会播放一个炫酷的加载动画：

1. **阶段 1** (0-0.5s): 单个正方形出现并放大
2. **阶段 2** (0.5-0.8s): 正方形分裂成两个
3. **阶段 3** (0.8-1.2s): 右侧正方形变形为六芒星
4. **阶段 4** (1.2s+): 两个图形开始旋转，模拟加载
5. **完成**: 资源加载完成后淡出消失

### 配置
在 `App.tsx` 中可调整最小加载时间：
```tsx
<LoadingScreen 
  onLoadingComplete={() => setIsLoading(false)}
  minimumLoadTime={3000}  // 最小加载时间（毫秒）
/>
```

## 📊 数据实时性机制

### 自动刷新策略

| 触发条件 | 刷新间隔 | 说明 |
|---------|---------|------|
| 页面加载 | 立即 | 首次加载数据 |
| 定时刷新 | 30秒 | 后台自动更新数据 |
| 窗口聚焦 | 立即 | 切换回页面时刷新 |
| 手动刷新 | 用户触发 | 点击状态指示器 |

### 数据状态指示器

页面右下角会显示一个状态按钮：

- 🟢 **绿色**: 数据已同步，显示最后更新时间
- 🟡 **黄色**: 数据可能已过期，点击可刷新

点击指示器可以**强制刷新**数据。

### Hook 使用示例

```tsx
import { useRealtimePosts } from '@/hooks/useRealtime';

function MyComponent() {
  const { 
    posts,           // 文章数据
    loading,         // 加载状态
    error,           // 错误信息
    refresh,         // 普通刷新
    forceRefresh,    // 强制刷新（清除缓存）
    lastUpdated,     // 最后更新时间
    isStale,         // 数据是否过期
  } = useRealtimePosts(30000);  // 30秒刷新间隔

  return (
    <div>
      {posts.map(post => ...)}
    </div>
  );
}
```

## 🔄 实时性对比

### 改进前 (useBlogPosts)
- ❌ 只在页面加载时获取一次数据
- ❌ 切换回页面不会刷新
- ❌ 不知道数据是否过期

### 改进后 (useRealtimePosts)
- ✅ 定时自动刷新（30秒）
- ✅ 窗口聚焦时自动刷新
- ✅ 显示数据同步状态
- ✅ 手动强制刷新
- ✅ 防缓存机制

## 🌐 网络状态检测

系统会自动检测网络状态：

```tsx
import { useNetworkStatus } from '@/hooks/useRealtime';

function MyComponent() {
  const { isOnline, connectionType } = useNetworkStatus();
  
  // isOnline: 是否在线
  // connectionType: 连接类型 (4g, wifi, unknown)
  
  return (
    <div>
      {!isOnline && <div>您已离线</div>}
    </div>
  );
}
```

## 🖼️ 资源预加载

对于图片资源，可以使用预加载 hook：

```tsx
import { useResourcePreloader } from '@/hooks/useRealtime';

function MyComponent() {
  const imageUrls = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
  ];
  
  const { progress, isComplete } = useResourcePreloader(imageUrls);
  
  return (
    <div>
      加载进度: {progress}%
      {isComplete && '所有图片加载完成'}
    </div>
  );
}
```

## ⚡ 性能优化

### 缓存策略
1. **内存缓存**: React state 中保留数据
2. **防重复请求**: 同时只有一个请求在进行
3. **智能刷新**: 窗口不可见时暂停定时刷新

### 请求优化
1. **时间戳参数**: 防止浏览器缓存
2. **最小加载时间**: 避免闪烁
3. **防抖刷新**: 避免频繁触发

## 🎨 自定义加载动画

### 修改动画参数
在 `LoadingScreen.tsx` 中：

```tsx
// 调整动画时间
const phases = [
  { phase: 0, delay: 0 },        // 开始
  { phase: 1, delay: 500 },      // 出现
  { phase: 2, delay: 800 },      // 分裂
  { phase: 3, delay: 1200 },     // 变形
  { phase: 4, delay: 1600 },     // 旋转
];
```

### 使用简单加载动画
```tsx
import { SimpleLoadingAnimation } from '@/components/LoadingScreen';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  return loading ? <SimpleLoadingAnimation /> : <Content />;
}
```

## 🔧 故障排查

### 加载动画不消失
检查浏览器控制台是否有 JavaScript 错误。

### 数据不自动刷新
1. 检查 `useRealtimePosts` 参数是否正确
2. 查看浏览器 Network 标签是否有请求
3. 检查后端 API 是否正常响应

### 状态指示器不显示
确保在页面组件中正确引入：
```tsx
<DataStatusIndicator
  lastUpdated={lastUpdated}
  isStale={isStale}
  onRefresh={forceRefresh}
/>
```

## 📱 移动端适配

加载动画和状态指示器都已适配移动端：
- 动画尺寸自适应
- 触摸友好的刷新按钮
- 省电模式（页面不可见时暂停刷新）
