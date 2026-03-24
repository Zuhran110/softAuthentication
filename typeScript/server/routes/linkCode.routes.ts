import { Router } from "express";
import LinkCodeController from "../controllers/LinkCode.controller";

const router = Router();

router.post("/link-code", LinkCodeController);

export default router;
