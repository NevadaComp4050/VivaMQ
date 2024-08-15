import { Router } from 'express';
import FileController from './files.controller';
import MapFilesDto from '@/dto/file.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const files: Router = Router();
const controller = new FileController();

/**
 * Map files body
 * @typedef {object} MapFilesBody
 * @property {string} studentId.required - Student ID
 */
/**
 * File
 * @typedef {object} File
 * @property {string} filename - Filename of the file
 * @property {string} fileUrl - URL of the file
 * @property {string} studentId - Student ID
 */

/**
 * GET /files/getall
 * Get all files
 * @tags files
 * @return {Array.<File>} 200 - List of files
 */
files.get('/getall', verifyAuthToken, controller.getAllFiles);

/**
 * PUT /files/map/:fileId
 * Map a file to a student
 * @tags files
 * @param {MapFilesBody} request.body.required
 * @return {File} 200 - Updated file
 */
files.put(
  '/map/:fileId',
  verifyAuthToken,
  RequestValidator.validate(MapFilesDto),
  controller.mapFilesToStudents
);

export default files;
