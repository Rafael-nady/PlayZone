import { Router, type IRouter } from "express";
import healthRouter from "./health";
import namesRouter from "./names";

const router: IRouter = Router();

router.use(healthRouter);
router.use(namesRouter);

export default router;
