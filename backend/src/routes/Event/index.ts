import express from "express";
import { EventController } from "../../Controllers";

const router = express.Router();

router.post("/", EventController.createEvent);
router.get("/", EventController.getAllEvents);
router.get("/:_id", EventController.getEventById);
router.put("/:_id", EventController.updateEvent);
router.delete("/:_id", EventController.deleteEvent);

export default router;
