import multer from 'multer';
import { extname } from 'path';
import { v1 as guidGenerator } from 'uuid';

import { Response, NextFunction } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';

// Create a multer parse for image upload
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/images/');
  },
  filename: (req, file, callback) => {
    const ext = extname(file.originalname);
    const guid = guidGenerator();
    callback(null, `${guid}${ext}`);
  },
});

const parser = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname);
    const allowedTypes = ['.png', '.jpg', '.gif', '.jpeg'];
    if (!allowedTypes.includes(ext)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: process.env.IMG_UPLOAD_MAX_SIZE ? parseInt(process.env.IMG_UPLOAD_MAX_SIZE) : 10 * 1024 * 1024 },
});

export default (fieldName: string) => (req: RequestWithUser, res: Response, next: NextFunction) => {
  // Creates multer middleware
  const upload = parser.single(fieldName);

  // Only allows multipart/form-data request
  const contentType = req.header('content-type');
  if (!(contentType && contentType.indexOf('multipart/form-data') > -1)) {
    return res.status(500).json({ error: 'Request must be a multipart/form-data' });
  }

  // Prevent Multer errors
  upload(req, res, (err: any) => {
    // A Multer error occurred when uploading.
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    // An unknown error occurred when uploading.
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Image field is required
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: `Field "${fieldName}" is required` });
    }
    // Everything went fine
    next();
  });
};
