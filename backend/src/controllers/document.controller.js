import { documentService } from '../services/document.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const documentController = {
  getDocuments(req, res) {
    try {
      const docs = documentService.getDocumentsByApplication(req.params.id, req.user.id, req.user.role);
      return successResponse(res, 'Daftar dokumen berhasil diambil.', docs);
    } catch (err) {
      const statusCode = err.message.includes('Akses ditolak') ? 403 : 404;
      return errorResponse(res, err.message, 'NOT_FOUND', [], statusCode);
    }
  },

  uploadDocument(req, res) {
    try {
      const { document_type, filename, mime_type, file_size } = req.body;
      if (!document_type) {
        return errorResponse(res, 'Tipe dokumen wajib diisi.', 'VALIDATION_ERROR', [], 422);
      }

      const doc = documentService.addDocument(req.params.id, req.user.id, {
        document_type,
        filename,
        mime_type,
        file_size
      });

      return successResponse(res, 'Dokumen berhasil diunggah.', doc, 201);
    } catch (err) {
      const statusCode = err.message.includes('Akses ditolak') ? 403 : 400;
      return errorResponse(res, err.message, 'UPLOAD_FAILED', [err.message], statusCode);
    }
  },

  deleteDocument(req, res) {
    try {
      documentService.deleteDocument(req.params.id, req.user.id);
      return successResponse(res, 'Dokumen berhasil dihapus.');
    } catch (err) {
      const statusCode = err.message.includes('Akses ditolak') ? 403 : 404;
      return errorResponse(res, err.message, 'DELETE_FAILED', [err.message], statusCode);
    }
  }
};
