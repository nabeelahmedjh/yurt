import express from "express";
import { tagsController } from "../controllers/index.js";

const router = express.Router();

router.get("/", tagsController.getTags);

router.post("/", tagsController.createTag);

router.delete("/:tagId", tagsController.deleteTag);

router.put("/:tagId", tagsController.updateTag);


router.post("/bulk", tagsController.bulkUploadTags);
export default router;