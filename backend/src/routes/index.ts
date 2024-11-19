import { Router, Request, Response } from "express";
import Event from "./Event";

const router = Router();

router.use("/api/events", Event);

export default router;
