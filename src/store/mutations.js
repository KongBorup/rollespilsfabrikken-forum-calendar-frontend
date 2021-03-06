/* eslint-disable no-param-reassign */
import initialState from './state';

export default {
  SET_USER(state, user) {
    state.user = user;
  },

  SET_USERS(state, allUsers) {
    state.allUsers = allUsers;
  },

  SET_ROLES(state, roles) {
    state.allRoles = roles;
  },

  SET_PERMISSIONS(state, perms) {
    state.allPermissions = perms;
  },

  SET_EDIT_ROLE_DETAILS(state, details) {
    state.editRoleDetails = details;
  },

  SET_FORUM_CALENDAR_EDIT_DETAILS(state, details) {
    state.editForumCalendarDetails = details;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState());
  },

  INCREMENT_COUNTER(state) {
    state.counter += 1;
  },
};
