<template>
  <li class="user">
    <div class="avatar">
      <img src="/assets/icons/person.svg" alt="Avatar icon">
    </div>
    <p class="username">{{ user.username }}</p>
    <p class="date" title="Dato for brugeroprettelse">{{ simpleStringFormat(user.createdAt) }}</p>
    <ul class="roles-list">
      <li
        v-for="role in user.roles"
        :key="role.id"
        :style="{ borderColor: role.color }"
        class="roles-list-item"
      >
        <button
          class="rm-role"
          title="Fjern rolle"
          :style="{ color: role.color }"
          @click="handleRemoveRole(role)"
        >
          <span class="icon-circle fas fa-circle"></span>
          <span class="icon-remove fas fa-times-circle"></span>
        </button>
        {{ role.title }}
      </li>
      <li class="add-role" title="Tilføj rolle" @click="handleAddRole">
        <span class="fas fa-plus"></span>
      </li>
    </ul>
  </li>
</template>

<script>
import { simpleStringFormat } from '@/dateUtils';

export default {
  name: 'UserAdminListItem',

  props: {
    user: {
      required: true,
      type: Object,
    },
  },

  methods: {
    simpleStringFormat,

    handleAddRole() {
      this.$dialog.confirm(null, {
        view: 'role-picker-dialog',
        loader: true,
      })
        .then(async (dialog) => {
          const selectedRole = dialog.data;

          if (selectedRole === null) {
            dialog.close();
            return;
          }

          try {
            await this.$store.dispatch('addRole', {
              roleId: selectedRole.id,
              userId: this.user.id,
            });

            dialog.close();
            this.$emit('reload');
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl!');
          }
        })
        .catch(() => {});
    },

    async handleRemoveRole(role) {
      this.$dialog.confirm(`Er du sikker på, at du vil fjerne rollen '${role.title}' fra ${this.user.username}?`, {
        loader: true,
      })
        .then(async (dialog) => {
          try {
            await this.$store.dispatch('removeRole', {
              roleId: role.id,
              userId: this.user.id,
            });

            dialog.close();
            this.$emit('reload');
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl!');
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.user {
  display: grid;
  grid-template-areas:
    "avatar name date"
    "avatar roles roles";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr;
  column-gap: 1rem;
  row-gap: 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 0.6rem;
    padding-bottom: 0.6rem;
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    grid-area: avatar;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $primary-accent;
    border-radius: 100%;

    img {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .username {
    font-size: 1rem;
    grid-area: 'user';
    font-weight: 600;
  }

  .date {
    font-size: 0.9rem;
    grid-area: 'date';
    color: rgba(0, 0, 0, 0.75);
  }

  .roles-list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    align-items: center;

    .add-role {
      color: rgba(0, 0, 0, 0.3);
      border: 0.075rem solid rgba(0, 0, 0, 0.3);
      font-size: 0.75rem;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.3rem;
      height: 1.3rem;
      cursor: pointer;

      &:hover {
        color: rgba(0, 0, 0, 0.4);
        border-color: rgba(0, 0, 0, 0.4);
      }
    }

    .roles-list-item {
      font-size: 0.9rem;
      color: $primary-text;
      padding: 0.1rem 0.5rem 0.1rem 0.25rem;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 10rem;
      display: flex;
      align-items: center;
      column-gap: 0.5rem;

      .rm-role {
        width: 0.9rem;
        height: 0.9rem;
        padding: none;
        margin: none;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        border: none;
        cursor: pointer;
        background-color: #fff;

        &:hover .icon-circle, .icon-remove {
          display: none;
        }

        &:hover .icon-remove, .icon-circle {
          display: inline;
        }
      }
    }
  }
}
</style>