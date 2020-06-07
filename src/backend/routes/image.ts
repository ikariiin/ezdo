import * as express from 'express';
import { create } from './image/create';
import * as multer from "multer";
import { destination, filename } from './image/fs-handler';
import { remove } from './image/remove';
import { getImage } from './image/get-image';

const storage = multer.diskStorage({
  destination: destination,
  filename: filename
});

const upload = multer({
  storage
});

const router = express.Router();

router.post("/create", upload.single("image"), create);
router.delete("/:id", remove);
router.get("/:id", getImage);

export { router as ImageRouter };