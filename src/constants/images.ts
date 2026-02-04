/**
 * 图片资源配置文件
 * 集中管理应用中使用的所有图片路径。
 * 
 * 使用说明：
 * 1. 所有图片存放在 public/image/ 文件夹中
 * 2. 替换图片时，只需将新图片放入 public/image/ 并保持文件名一致
 * 3. 或者修改下方路径指向新的图片文件名
 * 
 * 图片命名规范：
 * - roadshow-pain-point.png/jpg - 痛点场景图
 * - roadshow-plugin-install.png/jpg - 插件安装展示
 * - roadshow-ai-advice.png/jpg - AI 建议展示
 * - roadshow-download-docx.png/jpg - 纪要下载展示
 * - work-greeting-card.png/jpg - 新春贺词生成器
 * - work-line-art.png/jpg - 图片拼接线稿生成器
 * - work-prd-extractor.png/jpg - 需求提取 Skills
 * - work-personal-home.png/jpg - 个人主页
 */

export const ASSETS_IMAGES = {
  // 项目路演模块图片
  roadshow: {
    // 痛点场景图
    painPoint: "/image/roadshow-pain-point.png",
    // 插件安装展示
    pluginInstall: "/image/roadshow-plugin-install.png",
    // AI 建议展示
    aiAdvice: "/image/roadshow-ai-advice.png",
    // 纪要下载展示
    downloadDocx: "/image/roadshow-download-docx.jpg",
  },

  // 其他作品模块图片
  works: {
    // 新春贺词生成器
    greetingCard: "/image/work-greeting-card.jpg",
    // 图片拼接线稿生成器
    lineArt: "/image/work-line-art.jpg",
    // 需求提取 Skills
    prdExtractor: "/image/work-prd-extractor.jpg",
    // 个人主页
    personalHome: "/image/work-personal-home.jpg",
  }
};
