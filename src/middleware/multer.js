import multer from 'multer';

export const upload = multer({
  //Зберігаємо файл
  storage: multer.memoryStorage(),
  // це обмеження
  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  //файли з mimetype => image/
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  },
});
