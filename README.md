# react-canvas-editor
# React Canvas Editor

可视化拖拽画布编辑器

## 技术栈

React + TypeScript + Zustand + React Router

## 项目概述

基于 React + TypeScript 开发的可视化画布编辑器,支持画布元素的拖拽、选中、移动及属性编辑,为用户提供可视化的页面编辑体验。

## 核心特性

- **拖拽交互**:使用 Pointer Events 实现拖拽交互,通过 `setPointerCapture` 保证拖拽过程中的事件连续性,并结合 `hasPointerCapture` 区分有效拖拽状态。
- **拖拽性能优化**:自定义 DragStart、DragEnd 及 DragPreview 逻辑,使用 `requestAnimationFrame` 优化拖拽预览计算,避免高频 Pointer 事件触发不必要的计算。
- **高频事件处理**:使用 `useRef` 保存高频 Pointer 事件产生的坐标数据,避免鼠标移动导致组件状态频繁更新及重复渲染。
- **渲染性能优化**:针对画布元素更新导致无关元素重复渲染的问题,引入 `React.memo`,并结合 `useCallback` 稳定组件依赖,减少不必要的组件渲染。
- **首屏加载优化**:首屏加载包含大量图片,为避免图片加载造成的延迟,将图片改为懒加载,将首屏加载时间从 1.2s 降到 0.7s。

## 安装

```bash
pnpm install
```

## 开发

```bash
pnpm run dev
```

## 构建

```bash
pnpm run build
```

## License

MIT
