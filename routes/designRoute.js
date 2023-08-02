import express from "express";
import {
  AddDetailImage,
  CreateDesign,
  DeleteDesign,
  GetAddDesignData,
  GetDesignById,
  GetDesignList,
  RemoveDetailImage,
  UpdateDesign,
} from "../controller/design/design.js";

const router = express.Router();

router.get("/getDesignList", GetDesignList);
router.get("/addDesign", GetAddDesignData);
router.get("/deleteDesign/:id", DeleteDesign);
router.get("/singleDesign/:id", GetDesignById);

router.post("/updateDesign", UpdateDesign);
router.post("/createDesign", CreateDesign);
router.post("/addDetailImage", AddDetailImage);
router.post("/deleteDetailImage", RemoveDetailImage);

export default router;
