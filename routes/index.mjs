import { Router } from "express";
import notesRoutes from "./notesRoutes.mjs";
import usersRoutes from "./usersRoutes.mjs";

const router = Router();

router.use(notesRoutes, usersRoutes)

export default router;