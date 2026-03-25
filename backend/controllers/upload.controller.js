import uploadOnCloudinary from "../utils/cloudinary.js";


export const uploadPrintPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const cloudinaryUrl = await uploadOnCloudinary(req.file.path);

    return res.status(200).json({ pdfUrl: cloudinaryUrl });
  } catch (error) {
    console.error("Upload print PDF error:", error);
    res.status(500).json({ message: "PDF upload failed" });
  }
};

