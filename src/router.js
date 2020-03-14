import Vue from 'vue';
import Router from 'vue-router';
import Calendar from '@/views/Calendar.vue';
import CalendarEventViewer from '@/views/CalendarEventViewer.vue';
import Forum from '@/views/Forum.vue';
import ForumPostViewer from '@/views/ForumPostViewer.vue';
import MarkdownGuideView from '@/views/MarkdownGuideView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Calendar,
    // },
    {
      path: '/kalender',
      name: 'calendar',
      component: Calendar,
    },
    {
      path: '/kalender/begivenhed',
      component: CalendarEventViewer,
    },
    {
      path: '/forum/:forum?',
      name: 'forum',
      component: Forum,
    },
    {
      path: '/forum/:forum/opslag/:postId',
      name: 'post',
      component: ForumPostViewer,
    },
    {
      path: '/markdown-guide',
      name: 'markdown-guide',
      component: MarkdownGuideView,
    },
  ],
});
