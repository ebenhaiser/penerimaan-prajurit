import { store } from '../config/store.js';

export const documentService = {
  getDocumentsByApplication(applicationId, userId, userRole) {
    const app = store.applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Pendaftaran tidak ditemukan.');

    if (userRole === 'candidate' && app.candidate_id !== userId) {
      throw new Error('Akses ditolak.');
    }

    return store.documents.filter(d => d.application_id === applicationId);
  },

  addDocument(applicationId, userId, { document_type, filename, mime_type, file_size }) {
    const app = store.applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Pendaftaran tidak ditemukan.');
    if (app.candidate_id !== userId) throw new Error('Akses ditolak.');

    // Remove existing document of the same type if updating
    const existingIdx = store.documents.findIndex(
      d => d.application_id === applicationId && d.document_type === document_type
    );

    const doc = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      application_id: applicationId,
      document_type,
      storage_path: `/uploads/documents/${applicationId}/${filename || `${document_type.toLowerCase()}.pdf`}`,
      mime_type: mime_type || 'application/pdf',
      file_size: file_size || 250000,
      verification_status: 'pending',
      reviewed_by: null,
      review_notes: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      store.documents[existingIdx] = doc;
    } else {
      store.documents.push(doc);
    }

    store.addAuditLog(userId, 'DOCUMENT_UPLOADED', 'candidate_documents', doc.id, {
      application_id: applicationId,
      document_type
    });

    return doc;
  },

  verifyDocument(documentId, committeeUserId, { verification_status, review_notes }) {
    const doc = store.documents.find(d => d.id === documentId);
    if (!doc) throw new Error('Dokumen tidak ditemukan.');

    doc.verification_status = verification_status;
    doc.review_notes = review_notes || null;
    doc.reviewed_by = committeeUserId;
    doc.reviewed_at = new Date().toISOString();

    const app = store.applications.find(a => a.id === doc.application_id);
    if (app) {
      store.addNotification(
        app.candidate_id,
        `Status Dokumen ${doc.document_type}`,
        `Dokumen ${doc.document_type} Anda berstatus: ${verification_status === 'verified' ? 'Terverifikasi' : 'Perlu Perbaikan'} (${review_notes || 'Telah diperiksa panitia'}).`,
        verification_status === 'verified' ? 'success' : 'warning'
      );
    }

    store.addAuditLog(committeeUserId, 'DOCUMENT_VERIFIED', 'candidate_documents', doc.id, {
      verification_status,
      review_notes
    });

    return doc;
  },

  deleteDocument(documentId, userId) {
    const docIdx = store.documents.findIndex(d => d.id === documentId);
    if (docIdx === -1) throw new Error('Dokumen tidak ditemukan.');

    const doc = store.documents[docIdx];
    const app = store.applications.find(a => a.id === doc.application_id);
    if (app && app.candidate_id !== userId) {
      throw new Error('Akses ditolak.');
    }

    store.documents.splice(docIdx, 1);
    store.addAuditLog(userId, 'DOCUMENT_DELETED', 'candidate_documents', documentId);
    return true;
  }
};
