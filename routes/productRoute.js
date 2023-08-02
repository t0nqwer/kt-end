import express from "express";
import {
  deleteCloth,
  deleteExample,
  deleteKhwanta,
  getAddProduct,
  getCloth,
  getExample,
  getKhwanta,
  getSingleCloth,
  getSingleKhwanta,
  getSingleExample,
} from "../controller/product/get.js";
const router = express.Router();

router.get("/cloth", getCloth);
router.get("/khwanta", getKhwanta);
router.get("/example", getExample);
router.get("/addproduct", getAddProduct);
router.get("/cloth/:id", getSingleCloth);
router.get("/khwanta/:id", getSingleKhwanta);
router.get("/example/:id", getSingleExample);

router.post("/cloth");
router.post("/khwanta");
router.post("/example");

router.delete("/cloth/:id", deleteCloth);
router.delete("/khwanta/:id", deleteKhwanta);
router.delete("/example/:id", deleteExample);

router.put("/price/:id");
router.put("/detailImage/:id");
router.put("/deleteDetailImage/:id");

export default router;
