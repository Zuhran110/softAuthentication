import { Router } from "express";
import RegisterController from "../controllers/Register.controller";

const router = Router();

router.post("/register", RegisterController);
router.get("/register", RegisterController);

export default router;
