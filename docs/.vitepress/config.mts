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
        text: 'C语言',
        items: [
          { text: '领域驱动设计(核心)', link: '/c/ddd.md' },
          { text: '环境搭建', link: '/c/README.md' },
          { text: '交叉编译', link: '/c/cross.md' },
          { text: 'QEMU', link: '/c/qemu.md' },
          { text: '基础', link: '/c/basic.md' },
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
        text: 'go语言',
        items: [
          { text: '环境搭建', link: '/golang/install.md' },
          { text: '交叉编译', link: '/golang/build.md' },
          { text: '项目搭建', link: '/golang/project.md' },
          { text: '上下文操作', link: '/golang/context.md' },
          { text: '日志', link: '/golang/log.md' },
          { text: '科学计算', link: '/golang/decimal.md' },
          { text: '串口操作', link: '/golang/uart.md' },
          { text: 'websocket', link: '/golang/websocket.md' },
        ]
      },
      {
        text: 'docker',
        items: [
          { text: '基础指令', link: '/docker/README.md' },
          { text: '网络', link: '/docker/network.md' },
          { text: '代理', link: '/docker/science.md' },
          { text: '常用服务配置', link: '/docker/ser.md' },
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
        text: '物联网',
        items: [
          { text: '数据推送流程设计', link: '/iot/datapush.md' },
        ]
      },
      {
        text: '黑工厂',
        items: [
          { text: '公共', link: '/nd/public.md' },
          { text: '主页功能调试', link: '/nd/index.md' },
          { text: '实时功能调试', link: '/nd/realtime.md' },
          { text: '历史数据调试', link: '/nd/history.md' },
          { text: '开发部署过程', link: '/nd/update.md' },
          { text: '告警', link: '/nd/alarm.md' },
          { text: 'https', link: '/nd/ssl.md' },
          { text: '写入程序', link: '/nd/dbwriter.md' },
          { text: '运行分析', link: '/nd/run.md' },
          { text: '系统控制', link: '/nd/sysctl.md' },
        ]
      },
      {
        text: '草稿',
        items: [
          { text: '2025年11月', link: '/todo/todo.md' },
        ]
      },
      {
        text: '临时(git忽略)',
        items: [
          { text: '说明', link: '/temp/readme.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
