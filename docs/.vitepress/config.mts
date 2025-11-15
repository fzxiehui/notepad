import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "葵花宝典",
  description: "路漫漫其修远兮",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    logo: "krabs.png", 
    search: { 
			provider: 'local' 

		},

    sidebar: [
      {
        text: '计算机视觉',
        items: [
          { text: 'pillow与格式转换', link: '/cv/pillow.md' },
          { text: 'opencv基础', link: '/cv/opencv_base.md' },
          { text: '兴趣区域', link: '/cv/opencv_roi.md' },
          { text: '阈值操作', link: '/cv/opencv_threshold.md' },
          { text: '滤波操作', link: '/cv/opencv_filter.md' },
          { text: '形态学', link: '/cv/opencv_morphology.md' },
          { text: '轮廓查找', link: '/cv/opencv_contour.md' },
        ]
      },
      {
        text: 'Python',
        items: [
          { text: 'python环境', link: '/python/python.md' },
          { text: '创建最小项目', link: '/python/project.md' },
        ]
      },
      {
        text: '网络与安全',
        items: [
          { text: '常用设置', link: '/network/network.md' },
          { text: 'IP与端口', link: '/network/ipport.md' },
          { text: '常用代理', link: '/network/proxy.md' },
          { text: '数据包', link: '/network/pack.md' },
          { text: 'ARP', link: '/network/arp.md' },
          { text: 'iptables', link: '/network/iptables.md' },
          { text: '路由器搭建', link: '/network/exp_router.md' },
        ]
      },
      {
        text: '草稿',
        items: [
          { text: '2025年11月', link: '/todo/todo.md' },
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
