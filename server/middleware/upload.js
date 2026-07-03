const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

// Allow only image files
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png|gif|webp/;

    const isValid =
        allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
        allowedTypes.test(file.mimetype);

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }

};

const upload = multer({

    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

module.exports = upload;