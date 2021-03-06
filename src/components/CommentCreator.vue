<template>
  <form @submit="handleSubmit" :class="{ waiting: isWaiting }">
    <MarkdownEditorWrapper ref="markdownEditor" :disabled="isWaiting" :id="parentIdNotNull" />
    <input v-if="!isWaiting" class="form-submit" type="submit" value="Opret kommentar!">
    <span v-else class="waiting-text">Vent venligst..</span>
    <div v-if="isWaiting" class="overlay"></div>
  </form>
</template>

<script>
import MarkdownEditorWrapper from '@/components/MarkdownEditorWrapper.vue';

export default {
  name: 'CommentCreator',
  components: {
    MarkdownEditorWrapper,
  },

  data() {
    // Generate unique file list ID
    const count = this.$store.state.counter;
    this.$store.dispatch('counter');
    const curPost = this.$store.state.forum.currentPost.id;
    const parentIdNotNull = this.parentId === null
      ? `${curPost}-rootComment-${count}`
      : this.parentId;

    return {
      isWaiting: false,
      parentIdNotNull,
    };
  },

  props: {
    parentId: {
      type: String,
      default: null,
    },
  },

  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      const commentContent = this.$refs.markdownEditor.getValue();
      const files = this.$refs.markdownEditor.getFiles();

      if (commentContent.trim().length === 0) {
        this.$dialog.alert('Indholdet må ikke være tomt!');
        return;
      }

      const { forum, postId } = this.$route.params;

      this.isWaiting = true;

      try {
        await this.$store.dispatch('forum/createComment', {
          postId,
          forumPathName: forum,
          body: commentContent,
          parentId: this.parentId,
          files,
        });

        this.$emit('comment-created');
      } catch (error) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }

      this.isWaiting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

form {
  position: relative;
}

.waiting {
  opacity: 0.75;
}

.form-submit {
  width: 9rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.2rem;
  border: none;
  background-color: $primary-accent;
  color: #fff;
  cursor: pointer;
  font-family: $fonts;
  font-size: 0.9rem;
}

.waiting-text {
  display: block;
  margin: 0.5rem auto 0 auto;
  width: 9rem;
  text-align: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
