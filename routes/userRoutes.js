const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");

// Configure Multer for Profile Picture Uploads
const storage = multer.diskStorage({
    destination: "public/uploads/profilePics/",
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// 🏠 Home Route
router.get("/", (req, res) => res.render("home", { user: res.locals.user }));

// 🔐 Signup & Login Routes
router.get("/signup", (req, res) => res.render("signup", { error: null, user: res.locals.user }));
router.post("/signup", userController.signup);

router.get("/login", (req, res) => res.render("login", { error: null, user: res.locals.user }));
router.post("/login", userController.login);

// 👤 Profile Routes
router.get("/profile", verifyToken, userController.getProfile);
router.get("/profile/edit", verifyToken, userController.getEditProfile);
router.post("/profile/edit", verifyToken, upload.single("profilePic"), userController.updateProfile);

// 🚪 Logout
router.get("/logout", userController.logout);

module.exports = router;
