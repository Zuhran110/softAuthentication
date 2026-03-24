import { Router } from "express";
import GenerateCodeController from "../controllers/GenerateCode.controller";

const router = Router();

router.post("/generate-code", GenerateCodeController);

export default router;
