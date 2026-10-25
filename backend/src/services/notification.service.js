import { store } from '../config/store.js';

export const notificationService = {
  getUserNotifications(userId) {
    return store.notifications.filter(n => n.user_id === userId);
  },

  markAsRead(notificationId, userId) {
    const notif = store.notifications.find(n => n.id === notificationId && n.user_id === userId);
    if (!notif) throw new Error('Notifikasi tidak ditemukan.');

    notif.read_at = new Date().toISOString();
    return notif;
  },

  markAllAsRead(userId) {
    const list = store.notifications.filter(n => n.user_id === userId && !n.read_at);
    const now = new Date().toISOString();
    list.forEach(n => {
      n.read_at = now;
    });
    return list.length;
  }
};
