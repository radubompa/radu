import axios from 'axios';
import cloudinary from 'cloudinary';
import {create} from "../controllers/message";

export default function fileUploadMiddleware(req, res) {
  cloudinary.uploader.upload_stream((result) => {
    if (result.error) {
      return res.status(result.error.http_code).json(result.error.message)
    }
    create(req.body.userId, req.body.chatId, {type: 'file', content: result.secure_url}).then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json(error.stack);
    });
  }).end(req.file.buffer);
}
