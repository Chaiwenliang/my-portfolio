// ============================================
// 数据管理层 - Data Manager
// 使用 localStorage 持久化，支持 JSON 导入/导出
// ============================================

const DataManager = {
  STORAGE_KEY: 'portfolio_data',
  DATA_VERSION: 5, // 每次修改默认数据时递增此版本号

  // 默认数据结构
  defaults: {
    profile: {
      name: 'Chaiwenliang',
      title: '全栈开发者 / 创意设计师',
      avatar: '',
      bio: '热爱技术与设计，致力于创造优雅的数字体验。专注于前端开发、UI设计和用户体验优化。',
      location: '📍 中国',
      email: 'cwl5294519@gmail.com',
      github: 'https://github.com/Chaiwenliang',
      twitter: '',
      linkedin: '',
      website: ''
    },
    skills: [
      { name: 'HTML/CSS', level: 95, icon: '🎨' },
      { name: 'JavaScript', level: 90, icon: '⚡' },
      { name: 'React/Vue', level: 85, icon: '⚛️' },
      { name: 'Node.js', level: 80, icon: '🟢' },
      { name: 'Python', level: 75, icon: '🐍' },
      { name: 'UI/UX 设计', level: 85, icon: '✏️' }
    ],
    projects: [
      {
        id: 1,
        title: '个人博客系统',
        description: '基于现代前端技术栈构建的博客系统，支持 Markdown 编辑、标签分类和全文搜索。',
        image: 'https://picsum.photos/seed/blog2026/600/400',
        tags: ['Vue.js', 'Node.js', 'MongoDB'],
        link: '#',
        github: '#',
        featured: true
      },
      {
        id: 2,
        title: 'AI 图像识别应用',
        description: '利用深度学习模型实现的图像分类与目标检测 Web 应用。',
        image: 'https://picsum.photos/seed/ai-vision/600/400',
        tags: ['Python', 'TensorFlow', 'Flask'],
        link: '#',
        github: '#',
        featured: true
      },
      {
        id: 3,
        title: '在线协作白板',
        description: '支持多人实时协作的在线白板工具，可绘制、添加便签和导出图片。',
        image: 'https://picsum.photos/seed/whiteboard/600/400',
        tags: ['React', 'WebSocket', 'Canvas'],
        link: '#',
        github: '#',
        featured: true
      },
      {
        id: 4,
        title: '天气数据可视化',
        description: '将气象数据转化为直观的交互式图表和地图展示。',
        image: 'https://picsum.photos/seed/weather-dash/600/400',
        tags: ['D3.js', 'API', 'CSS'],
        link: '#',
        github: '#',
        featured: false
      }
    ],
    posts: [
      {
        id: 1,
        title: '从零搭建现代前端开发环境',
        excerpt: '详细讲解如何使用 Vite、ESLint、Prettier 等工具搭建高效的前端开发工作流...',
        content: '详细讲解如何使用 Vite、ESLint、Prettier 等工具搭建高效的前端开发工作流。涵盖项目初始化、代码规范配置、热更新设置等关键步骤。',
        image: 'https://picsum.photos/seed/frontend-dev/400/300',
        date: '2026-04-15',
        tags: ['前端', '工具链', '教程'],
        published: true
      },
      {
        id: 2,
        title: 'CSS 容器查询完全指南',
        excerpt: '容器查询是 CSS 最令人期待的新特性之一，本文将带你从概念到实战全面掌握...',
        content: '容器查询是 CSS 最令人期待的新特性之一，本文将带你从概念到实战全面掌握这一革命性的响应式设计工具。',
        image: 'https://picsum.photos/seed/css-container/400/300',
        date: '2026-04-10',
        tags: ['CSS', '响应式设计', '前端'],
        published: true
      },
      {
        id: 3,
        title: '我的 2026 年技术学习路线',
        excerpt: '分享我今年的技术学习计划和资源推荐，包括 AI、Web3 和跨平台开发...',
        content: '分享我今年的技术学习计划和资源推荐，包括 AI、Web3 和跨平台开发方向的学习路径和实践心得。',
        image: 'https://picsum.photos/seed/tech-roadmap/400/300',
        date: '2026-04-01',
        tags: ['学习', '规划', '分享'],
        published: true
      }
    ],
    site: {
      title: '我的个人网站',
      description: '一个展示作品、分享技术的个人空间',
      footer: '© 2026 All Rights Reserved. Built with ❤️'
    }
  },

  // 获取所有数据
  getAll() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('数据读取失败:', e);
    }
    return JSON.parse(JSON.stringify(this.defaults));
  },

  // 保存所有数据
  saveAll(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('数据保存失败:', e);
      return false;
    }
  },

  // 获取特定部分
  get(section) {
    const data = this.getAll();
    return data[section] || null;
  },

  // 更新特定部分
  update(section, value) {
    const data = this.getAll();
    data[section] = value;
    return this.saveAll(data);
  },

  // 导出数据为 JSON 文件
  exportData() {
    const data = this.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // 从 JSON 文件导入数据
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (this.saveAll(data)) {
            resolve(data);
          } else {
            reject(new Error('保存失败'));
          }
        } catch (err) {
          reject(new Error('JSON 格式无效'));
        }
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  },

  // 重置为默认数据
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.getAll();
  },

  // 初始化（如果无数据则写入默认值，版本升级时自动合并 profile 字段）
  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const verKey = this.STORAGE_KEY + '_v';
    const curVer = parseInt(localStorage.getItem(verKey) || '0');

    if (!stored) {
      this.saveAll(this.defaults);
      localStorage.setItem(verKey, String(this.DATA_VERSION));
      return this.getAll();
    }

    // 版本升级：自动合并 profile 中的新默认值（保留用户已修改的其他数据）
    if (curVer < this.DATA_VERSION) {
      try {
        const old = JSON.parse(stored);
        // 直接用默认 profile 覆盖，确保 name/email/github 等一定是最新值
        old.profile = JSON.parse(JSON.stringify(this.defaults.profile));
        this.saveAll(old);
        localStorage.setItem(verKey, String(this.DATA_VERSION));
        console.log(`数据已升级到 v${this.DATA_VERSION}`);
      } catch (e) {
        console.error('数据升级失败:', e);
      }
    }
    return this.getAll();
  }
};

// 自动初始化
DataManager.init();
