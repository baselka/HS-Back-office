import React from 'react'
import * as Icon from 'react-feather'

const navigation = [
  {
    title: '',
    items: [
      {
        url: '/dashboards',
        icon: <Icon.Home size={20} />,
        title: 'الرئيسية',
        items: []
      },
      {
        url: '/users',
        icon: <Icon.Users size={20} />,
        title: 'إدارة المستخدمين',
        items: []
      },
      {
        url: '/app/cities',
        icon: <Icon.Smartphone size={20} />,
        title: 'إدارة التطبيق',
        items: [
          {
            url: '/app/cities',
            icon: <Icon.CornerDownLeft size={20} />,
            title: 'إدارة المدن',
            items: []
          },
          {
            url: '/app/categories',
            icon: <Icon.CornerDownLeft size={20} />,
            title: 'إدارة الأقسام الرئيسية',
            items: []
          },
          // {
          //   url: '/app/sub-categories',
          //   icon: <Icon.CornerDownLeft size={20} />,
          //   title: 'إدارة الأقسام الفرعية',
          //   items: []
          // },
          {
            url: '/app/cards',
            icon: <Icon.CornerDownLeft size={20} />,
            title: 'كروت الدعوة',
            items: []
          },
        ]
      },
      {
        url: '/providers/branches',
        icon: <Icon.Briefcase size={20} />,
        title: 'إدارة الفروع والخدمات',
        items: []
      },
      {
        url: '/providers',
        icon: <Icon.Settings size={20} />,
        title: 'مقدمي الخدمات',
        items: []
      },
      {
        url: '/advertisements',
        icon: <Icon.Monitor size={20} />,
        title: 'إدارة الإعلانات والعروض',
        items: [
          {
            url: '/advertisements',
            icon: <Icon.CornerDownLeft size={20} />,
            title: 'الإعلانات',
            items: []
          },
          {
            url: '/offers',
            icon: <Icon.CornerDownLeft size={20} />,
            title: 'العروض',
            items: []
          },
        ]
      },
      {
        url: '/suggestions',
        icon: <Icon.MessageCircle size={20} />,
        title: 'إقتراحات وشكاوى',
        items: []
      },
    ]
  },
]
export default navigation
