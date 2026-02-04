# 如何切换到文件管理模式并找到 public 目录

## 方法一：使用文件浏览器（推荐）

### 在 VS Code 或类似 IDE 中：

1. **打开文件资源管理器**
   - 点击左侧边栏顶部的"文件夹"图标
   - 或使用快捷键：
     - Windows/Linux: `Ctrl + Shift + E`
     - Mac: `Cmd + Shift + E`

2. **定位 public 目录**
   - 在项目根目录下找到 `public` 文件夹
   - 展开后可以看到 `image` 子文件夹
   - 项目结构如下：
     ```
     app-9ejz1lg8hfcx/
     ├── docs/
     ├── public/
     │   ├── image/          ← 图片存放位置
     │   │   ├── README.md
     │   │   ├── roadshow-pain-point.png
     │   │   ├── roadshow-plugin-install.png
     │   │   └── ...
     │   └── favicon.png
     ├── src/
     └── ...
     ```

3. **上传或替换图片**
   - 右键点击 `public/image/` 文件夹
   - 选择"在文件资源管理器中显示"（Windows）或"在访达中显示"（Mac）
   - 将您的图片文件拖入该文件夹
   - 确保文件名与 `src/constants/images.ts` 中的配置一致

## 方法二：使用命令行

### 查看 public 目录内容：

```bash
# 列出 public 目录
ls -la public/

# 列出 image 子目录
ls -la public/image/
```

### 上传图片到 public/image：

```bash
# 复制图片到 image 文件夹
cp /path/to/your/image.png public/image/roadshow-pain-point.png

# 或使用 curl 下载
curl -o public/image/your-image.png https://example.com/image.png
```

## 方法三：使用在线编辑器（如 GitHub Codespaces）

1. **打开文件树**
   - 点击左上角的"☰"菜单图标
   - 选择"文件" → "打开文件夹"
   - 导航到项目根目录

2. **找到 public 目录**
   - 在文件树中展开项目根目录
   - 找到并展开 `public` 文件夹
   - 进入 `image` 子文件夹

3. **上传文件**
   - 右键点击 `image` 文件夹
   - 选择"上传文件"
   - 选择您的图片文件

## 图片文件命名规范

请确保您的图片文件名与以下配置一致（参考 `src/constants/images.ts`）：

### 项目路演模块
- `roadshow-pain-point.png` - 痛点场景图
- `roadshow-plugin-install.png` - 插件安装展示
- `roadshow-ai-advice.png` - AI 建议展示
- `roadshow-download-docx.jpg` - 纪要下载展示

### 其他作品模块
- `work-greeting-card.jpg` - 新春贺词生成器
- `work-line-art.jpg` - 图片拼接线稿生成器
- `work-prd-extractor.jpg` - 需求提取 Skills
- `work-personal-home.jpg` - 个人主页

## 验证图片是否正确加载

### 方法 1：启动开发服务器

```bash
npm run dev
```

然后在浏览器中访问应用，检查图片是否正常显示。

### 方法 2：检查文件路径

```bash
# 确认图片文件存在
ls -lh public/image/

# 应该看到类似输出：
# -rw-r--r-- 1 user user 487K roadshow-pain-point.png
# -rw-r--r-- 1 user user 961K roadshow-plugin-install.png
# ...
```

## 常见问题

### Q: 为什么我看不到 public 目录？
A: 可能的原因：
1. 您当前不在项目根目录
2. 文件浏览器被折叠或隐藏
3. 项目尚未完全加载

解决方法：
- 确保打开的是项目根目录（`app-9ejz1lg8hfcx`）
- 刷新文件浏览器
- 使用命令行验证：`ls -la | grep public`

### Q: 图片上传后不显示怎么办？
A: 检查以下几点：
1. 文件名是否与配置文件一致（区分大小写）
2. 文件格式是否正确（.png, .jpg, .jpeg）
3. 文件是否在正确的路径（`public/image/`）
4. 清除浏览器缓存后重新加载

### Q: 如何修改图片路径配置？
A: 编辑 `src/constants/images.ts` 文件：

```typescript
export const ASSETS_IMAGES = {
  roadshow: {
    painPoint: "/image/your-new-filename.png",  // 修改这里
    // ...
  }
};
```

## 推荐的图片规格

- **格式**：PNG（透明背景）或 JPG（照片）
- **尺寸**：
  - 项目路演图片：1200x800 或 16:9 比例
  - 作品截图：1200x900 或 4:3 比例
- **文件大小**：建议压缩到 500KB 以内
- **优化工具**：TinyPNG、ImageOptim 等

## 部署后的图片访问

部署到 Vercel 后，图片将通过以下 URL 访问：
```
https://your-domain.vercel.app/image/roadshow-pain-point.png
```

确保图片文件在部署前已正确放置在 `public/image/` 目录中。
