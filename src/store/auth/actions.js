import * as auth from '@/api/auth';

export default {
  async updateAuthStatus(context) {
    const { authToken } = context.state;
    const isAuthenticated = authToken === null
      ? false
      : await auth.tokenIsValid(authToken);

    context.commit('SET_AUTH_STATUS', isAuthenticated);

    return isAuthenticated;
  },

  async login(context, { email, password }) {
    const authToken = await auth.login(email, password);

    window.localStorage.setItem('authToken', authToken);

    context.commit('SET_AUTH_TOKEN', authToken);
    context.dispatch('updateAuthStatus');
  },

  async loadPreviousAuthTokenIfExists(context) {
    const authToken = window.localStorage.getItem('authToken');

    if (authToken) {
      context.commit('SET_AUTH_TOKEN', authToken);
      const isValidToken = await context.dispatch('updateAuthStatus');

      if (!isValidToken) {
        context.commit('SET_AUTH_TOKEN', null);
      }
    }
  },

  async signUp(context, form) {
    await auth.signUp(form);
  },

  async resendEmail(context, email) {
    await auth.resendEmail(email);
  },

  logout(context) {
    const { authToken } = context.state;
    auth.logout(authToken).catch(() => {});
    window.localStorage.removeItem('authToken');
    context.dispatch('resetAllState', null, { root: true });
  },

  async confirmEmail(context, { confirmationToken }) {
    await auth.confirmEmail(confirmationToken);
  },

  async sendPasswordResetMail(context, email) {
    await auth.sendPasswordResetMail(email);
  },

  async getResetTokenDetails(context, resetToken) {
    const resetTokenDetails = await auth.getResetTokenDetails(resetToken);
    return resetTokenDetails;
  },

  async changePassword(context, {
    resetToken,
    email,
    newPassword,
    passwordRepeated,
  }) {
    await auth.changePassword(resetToken, email, newPassword, passwordRepeated);
  },
};
