import { Router } from "express";
import {
  addNewMedia,
  deleteMedia,
  getMedia,
  getMediaById,
  updateMedia,
} from "../controllers/mediaController.js";
import { verifyCookie } from "../utils/verifyCookie.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { validate } from "../middlewares/zodValidate.js";
import {
  deleteMediaSchema,
  getMediaByIdSchema,
  addMediaSchema,
  updateMediaSchema,
} from "../validators/mediaValidator.js";

const router = Router();

router.post(
  "/add-media",
  verifyCookie,
  verifyAdmin,
  validate(addMediaSchema),
  addNewMedia
);
router.put(
  "/update-media",
  verifyCookie,
  verifyAdmin,
  validate(updateMediaSchema),
  updateMedia
);
router.delete(
  "/delete-media",
  verifyCookie,
  verifyAdmin,
  validate(deleteMediaSchema, "query"),
  deleteMedia
);
router.get("/get-media", getMedia);
router.get("/media", validate(getMediaByIdSchema, "query"), getMediaById);

export { router as mediaRouter };
