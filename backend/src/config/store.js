import { seedData } from './seed-data.js';

class DataStore {
  constructor() {
    this.users = [...seedData.users];
    this.periods = [...seedData.periods];
    this.paths = [...seedData.paths];
    this.categories = [...seedData.categories];
    this.questions = [...seedData.questions];
    this.packages = [...seedData.packages];
    this.applications = [...seedData.applications];
    this.documents = [...seedData.documents];
    this.attempts = [];
    this.answers = [];
    this.eligibilityEvaluations = [];
    this.recommendations = [];
    this.notifications = [...seedData.notifications];
    this.auditLogs = [...seedData.auditLogs];
  }

  // Audit Logger
  addAuditLog(actorId, action, entityType, entityId, metadata = {}) {
    const entry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      created_at: new Date().toISOString()
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  // Notification Helper
  addNotification(userId, title, message, type = 'info') {
    const notif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      title,
      message,
      type,
      read_at: null,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }
}

export const store = new DataStore();
