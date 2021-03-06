<template>
  <div class="forum-content-wrapper">
    <div v-if="forumExists" class="forum">
      <h1 v-if="forum !== null">{{ isAllForums ? 'Alle fora' : forum.name }}</h1>
      <p v-if="isAllForums" class="desc">
        Dette er en liste af opslag fra alle de fora, du har adgang til.
      </p>
      <p v-else-if="forum !== null && forum.description.length > 0" class="desc">
        {{ forum.description }}
      </p>
      <router-link v-if="
        (isAllForums && canPostInAForum) ||
        (!isAllForums && forum !== null && forum.permissions.canAddPosts)
      " :to="{
        name: 'create-post',
        query: {
          forum: isAllForums ? undefined : forum.pathName,
        },
      }" class="create-post-link">
        <button type="button">
          <span class="fas fa-plus"></span>
          Opret opslag
        </button>
      </router-link>
      <h2>Opslag</h2>
      <PostsList
        ref="postsList"
        :page="currentPage"
        @scroll-to-top="scrollToTop"
      />
      <div class="page-controls">
        <button
          v-if="currentPage > 1"
          @click="prevPage"
          class="pg-item"
          title="Forrige side"
        >
          <img src="/assets/icons/less-than.svg" alt="Forrige side">
        </button>
        <div class="pg-item cur-page" :title="`Side ${currentPage}`">{{ currentPage }}</div>
        <button
          v-if="hasMorePosts"
          @click="nextPage"
          class="pg-item"
          title="Næste side"
        >
          <img src="/assets/icons/less-than.svg" alt="Næste side" class="next-page-icon">
        </button>
      </div>
    </div>
    <div v-else class="forum-not-found">
      <h1>Dette forum findes ikke!</h1>
      <p>I så fald det findes, har du ikke adgang til det.</p>
      <p>Se sidebjælken for de fora, du har adgang til.</p>
      <p class="attempted-forum">{{ $route.params.forum }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PostsList from '@/components/PostsList.vue';

export default {
  name: 'Forum',
  components: {
    PostsList,
  },

  data() {
    return {
      forumExists: true,
      forum: null,
      isAllForums: null,
    };
  },

  computed: {
    ...mapState('forum', [
      'hasMorePosts',
      'currentPage',
    ]),
    ...mapGetters('forum', {
      forums: 'getAllForums',
    }),

    canPostInAForum() {
      if (this.forums.length === 0) {
        return false;
      }

      return this.forums.filter(f => f.permissions.canAddPosts).length > 0;
    },
  },

  beforeMount() {
    const { forum } = this.$route.params;

    if (forum !== this.$store.state.forum.currentForumView) {
      this.$store.dispatch('forum/resetPage');
    }

    this.$store.dispatch('forum/updateCurrentForumView', forum);
  },

  mounted() {
    this.handleForumExistence();

    if (!this.forumExists) {
      return;
    }

    this.$store.dispatch('forum/clearPosts');
    this.$refs.postsList.fetchPosts();
  },

  watch: {
    $route(to) {
      this.handleForumExistence();

      if (!this.forumExists || this.forums.length === 0) {
        return;
      }

      const newForumView = to.params.forum;

      if (newForumView !== this.$store.state.forum.currentForumView) {
        this.$store.dispatch('forum/resetPage');
      }

      this.$store.dispatch('forum/updateCurrentForumView', newForumView);

      this.$store.dispatch('forum/clearPosts');

      // The watcher is fired before the DOM update has been applied, so the ref
      // will not always be defined when this is called.
      if (!this.$refs.postsList) {
        return;
      }

      this.$refs.postsList.fetchPosts();
    },

    forums() {
      this.handleForumExistence();
    },
  },

  methods: {
    prevPage() {
      this.$store.dispatch('forum/prevPage');
    },

    nextPage() {
      this.$store.dispatch('forum/nextPage');
    },

    scrollToTop() {
      if (this.$el) {
        this.$el.scrollTop = 0;
      }
    },

    handleForumExistence() {
      if (this.forums.length === 0) {
        return;
      }

      const forumPathName = this.$route.params.forum;

      this.isAllForums = forumPathName === undefined;
      const foundForum = this.forums.find(forum => forum.pathName === forumPathName);
      const exists = foundForum !== undefined;

      this.forumExists = this.isAllForums || exists;
      this.forum = foundForum;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

h1 {
  font-size: 1.6rem;
  margin-bottom: 0.7rem;
}

.desc {
  margin-bottom: 0.7rem;
  font-size: 0.9rem;
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.create-post-link {
  margin-bottom: 0.7rem;
  display: block;
  width: 7.5rem;
  text-decoration: none;

  span {
    font-size: 0.7rem;
    margin-right: 0.25rem;
  }

  button {
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: $fonts;
    font-size: 0.9rem;
    width: 100%;
    padding: 0.4rem 0.5rem;
    border-radius: 0.2rem;
    border: none;
    background-color: $primary-accent;
    color: #fff;
  }
}

.page-controls {
  display: flex;
  justify-content: center;
  align-items: center;

  .pg-item {
    border-radius: 100%;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  button.pg-item {
    background-color: 0.15rem solid rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    font-family: $fonts;

    img {
      height: 1.5rem;

      &.next-page-icon {
        transform: rotate(180deg);
      }
    }
  }

  .cur-page {
    background-color: $primary-accent;
    color: #fff;
  }
}

.forum-not-found {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  p {
    color: rgba(0, 0, 0, 0.75);
    margin-bottom: 1rem;

    &.attempted-forum {
      font-family: $fonts-monospace;
      font-size: 0.8rem;
    }
  }
}
</style>
