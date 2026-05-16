import { Router } from "express";
import { faqController } from "../controllers/faq.controller";
import { validateWebsite } from "../middleware/website.middleware";


const router = Router();
const faqControllers = new faqController();

// Apply website validation middleware to all routes in this router
router.use(validateWebsite);

router.get("/", faqControllers.getAllFaq);


export default router;
