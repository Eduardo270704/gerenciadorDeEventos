import express from "express";
import { EventController } from "../../Controllers";

const router = express.Router();

router.post("/", EventController.createEvent);
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);
router.put("/:id", EventController.updateEvent);
router.delete("/:id", EventController.deleteEvent);

export default router;
