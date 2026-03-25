import express from "express";
import { uploadPrintPDF } from "../controllers/upload.controller.js";
import upload from "../middleware/multer.js";

const Uploadrouter = express.Router();

Uploadrouter.post("/print", upload.single("file"), uploadPrintPDF);

export default Uploadrouter;
