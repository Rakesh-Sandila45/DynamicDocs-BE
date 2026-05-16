import { Router } from "express";
import User from "../models/User.js";
export const router = Router();

//login Api
router.post("/login", async (req, res) => {
  const { mobile } = req.body;

  try {
    let user = await User.findOne({ mobile });

    if (user) {
      return res.json({
        isExistingUser: true,
        mobile: user.mobile,
        name: user.name,
        userType: user.userType,
      });
    }

    return res.json({
      isExistingUser: false,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
});

// Register a new user API
router.post("/register", async (req, res) => {
  const { name, userType, mobile } = req.body;

  try {
    const user = new User({ name, userType, mobile });
    await user.save();
    res.json({
      success: true,
      message: "User registered successfully",
      user: { name, userType, mobile },
    });
  } catch (error) {
    // Log the error and send an error response
    console.error("Error saving user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user. Please try again.",
      error: error.message,
    });
  }
});

// Get user documents
router.get("/documents/:mobile", async (req, res) => {
  try {
    const user = await User.findOne({ mobile: req.params.mobile }); // Use User.findOne directly
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ documents: user.documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//Add Document to user
router.post("/documents/add", async (req, res) => {
  const { adminMobile, mobile, documents } = req.body;

  // Validate input
  if (!adminMobile || !mobile || !documents) {
    return res.status(400).json({
      error: "Admin mobile, user mobile, and documents are required.",
    });
  }

  try {
    // Verify if the adminMobile belongs to an Admin
    const admin = await User.findOne({ mobile: adminMobile });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    if (admin.userType !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Only Admin Can Add Documents." });
    }

    // Find the target user by mobile number
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove duplicates from the 'documents' array
    const newDocuments = documents.filter(
      (doc) => !user.documents.includes(doc)
    );

    // Add the non-duplicate documents to the user's documents array
    if (newDocuments.length > 0) {
      user.documents.push(...newDocuments);
      await user.save();

      return res.json({
        status: 200,
        message: "Documents added successfully",
        documents: user.documents,
      });
    } else {
      return res.json({
        status: 200,
        message: "No new documents to add, duplicates found",
        documents: user.documents,
      });
    }
  } catch (error) {
    // Log and handle server error
    console.error("Error in /documents/add:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
//remove Document
router.post(
  "/documents/remove/:adminMobile/:mobile/:document",
  async (req, res) => {
    const { mobile, document, adminMobile } = req.params;

    // Validate input
    if (!mobile || !document || !adminMobile) {
      return res.status(400).json({
        error: "Mobile number, admin mobile, and document name are required.",
      });
    }

    try {
      // Verify if adminMobile belongs to an Admin
      const admin = await User.findOne({ mobile: adminMobile });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found." });
      }

      if (admin.userType !== "Admin") {
        return res
          .status(403)
          .json({ error: "Access denied. Only Admin Can Delete Documents." });
      }

      // Find the target user by mobile number
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Check if the document exists in the user's documents array
      const updatedDocuments = user.documents.filter((doc) => doc !== document);
      if (updatedDocuments.length === user.documents.length) {
        return res.status(404).json({ error: "Document not found." });
      }

      // Update the user's documents array
      user.documents = updatedDocuments;
      await user.save();

      // Send response
      res.status(200).json({
        message: "Document removed successfully.",
        documents: user.documents,
      });
    } catch (error) {
      console.error("Error in /documents/remove:", error);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// app.get("/health", (req, res) => {
//   res.status(200).send("OK");
// });

export default router;
