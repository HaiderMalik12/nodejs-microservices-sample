// @ts-nocheck
import multer from 'multer';
import aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import multerS3 from 'multer-s3';

aws.config.update({
  signatureVersion: 'v4',
  secretAccessKey: process.env.NEW_SECRETACCESSKEY!,
  accessKeyId: process.env.NEW_ACCESSKEYS3!,
  region: process.env.NEW_REGION!
});

const s3 = new aws.S3();

const profilePicStorage = multerS3({
  s3: s3,
  bucket: process.env.NEW_BUCKET_NAME,
  // acl : "public-read",
  key: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname); //use Date.now() for unique file keys
  }
});
const fileStorageTemp = multerS3({
  s3: s3,
  bucket: process.env.NEW_BUCKET_NAME,
  // acl : "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    console.log('req.body', req.headers);
    let folder = 'others/';

    if (req.headers.imageType == 'riderProfile') {
      folder = 'riderProfile/';
    } else if (req.headers.imageType == 'vehicleImage') {
      folder = 'vehicleImage/';
    } else if (req.headers.imageType == 'orderPickupImage') {
      folder = 'orderPickupImage/';
    } else if (req.headers.imageType == 'orderCompleteImage') {
      folder = 'orderCompleteImage/';
    } else if (req.headers.imageType == 'orderReturnImage') {
      folder = 'orderReturnImage/';
    } else if (req.headers.imageType == 'adminSettings') {
      folder = 'adminSettings/';
    } else if (req.headers.imageType == 'wallet') {
      folder = 'wallet/';
    }

    const fileKey = `${folder}${Date.now()}_${file.originalname}`;

    cb(null, fileKey);
  }
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let paths = path.resolve(__dirname, '../../public/files');
    if (!fs.existsSync(paths)) {
      fs.mkdirSync(paths, { recursive: true });
    }
    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`);
  }
});
const ProfilePicUpload = multer({
  storage: profilePicStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
const fileUploadTemp = multer({
  storage: fileStorageTemp
});
const fileStorageLocalTemp = multer.diskStorage({
  destination: function (req, file, cb) {
    let paths = path.resolve(__dirname, '../../public/files');
    if (!fs.existsSync(paths)) {
      fs.mkdirSync(paths, { recursive: true });
    }

    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, 'temp_' + file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`);
  }
});
const fileUploadLocalTemp = multer({
  storage: fileStorageLocalTemp
});
const fileUpload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
const DocumentsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let paths = path.resolve(__dirname, '../../public/documents/driver');
    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`);
  }
});
const DocumentsUpload = multer({
  storage: DocumentsStorage,
  fileFilter: (req, file, cb) => {
    console.log({ file: req.files });
    if (
      file.mimetype == 'application/pdf' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg .pdf format allowed!'));
    }
  }
});
const profilePicStorageAdmin = multer.diskStorage({
  destination: function (req, file, cb) {
    let paths = path.resolve(__dirname, '../../public/images/admin');
    // fs.mkdirSync(paths, { recursive: true })
    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`);
  }
});
const ProfilePicUploadAdmin = multer({
  storage: profilePicStorageAdmin,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
const videoStorageAdmin = multer.diskStorage({
  destination: function (req, file, cb) {
    let paths = path.resolve(__dirname, '../../public/videos');
    fs.mkdirSync(paths, { recursive: true });
    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`);
  }
});
const videoUploadAdmin = multer({
  storage: videoStorageAdmin
});
const walkthroughStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let paths = path.resolve(__dirname, '../../public/walkthrough');
    fs.mkdirSync(paths, { recursive: true });
    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`);
  }
});
const walkthroughUpload = multer({
  storage: walkthroughStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
const serviceImageUpload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const uploadExcelFile = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
      cb(null, true);
    } else {
      cb('Please upload only excel file.', false);
    }
  }
}).single('file');

const getExcelFile = async function (req, res, next) {
  uploadExcelFile(req, res, function (err) {
    if (err) {
      next(err);
    }
    console.log('req.file => ', req.file);
    next();
  });
};
const uploadFileS3 = async function (fileKey, fileStream, req, res) {
  // Prepare the parameters for S3 upload
  let params = {
    Bucket: process.env.NEW_BUCKET_NAME,
    Key: fileKey,
    Body: fileStream
  };

  // Upload the file to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading to S3:', err);
      res.status(500).send('Error uploading to S3');
    } else {
      console.log('File uploaded to S3 successfully:', data.Location);
      const fileUrl2 = path.join(__dirname, '../../public/files/', fileKey);
      fs.unlink(fileUrl2, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File is deleted.');
        }
      });
      // Now, you can include the S3 file link in your response
      const signedUrlParams = {
        Bucket: params.Bucket,
        Key: params.Key,
        Expires: 60 * 60 // Link expires in 1 hour
      };

      s3.getSignedUrl('getObject', signedUrlParams, (err, signedUrl) => {
        if (err) {
          console.error('Error generating signed URL:', err);
          reject(err);
        } else {
          // Send back the signed URL or the public URL as needed
          res.send({
            redirection: signedUrl || data.Location // Provide the generated S3 file link in the response
          });
        }
      });
    }
  });
};

const uploadFileS3Link = async function (fileKey, fileStream) {
  // Prepare the parameters for S3 upload
  let params = {
    Bucket: process.env.NEW_BUCKET_NAME,
    Key: fileKey,
    Body: fileStream
  };
  // Upload the file to S3
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        reject(err);
      } else {
        let fileUrl2 = '../../public/files/' + fileKey;
        fs.unlink(fileUrl2, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('File is deleted.');
          }
        });

        console.log('File uploaded to S3 successfully:', data.Location);
        // resolve(data.Location);

        const signedUrlParams = {
          Bucket: params.Bucket,
          Key: params.Key,
          Expires: 60 * 60 // Link expires in 1 hour
        };

        s3.getSignedUrl('getObject', signedUrlParams, (err, signedUrl) => {
          if (err) {
            console.error('Error generating signed URL:', err);
            res.status(500).send('Error generating signed URL');
          } else {
            // Send back the signed URL or the public URL as needed
            resolve(signedUrl || data.Location);
            // res.send({
            //   redirection: signedUrl || data.Location // Provide the generated S3 file link in the response
            // });
          }
        });
      }
    });
  });
};

export default {
  ProfilePicUpload: ProfilePicUpload,
  fileUploadTemp: fileUploadTemp,
  fileUpload: fileUpload,
  DocumentsUpload: DocumentsUpload,
  ProfilePicUploadAdmin: ProfilePicUploadAdmin,
  videoUploadAdmin: videoUploadAdmin,
  walkthroughUpload: walkthroughUpload,
  serviceImageUpload: serviceImageUpload,
  fileUploadLocalTemp: fileUploadLocalTemp,
  getExcelFile: getExcelFile,
  uploadFileS3: uploadFileS3,
  uploadFileS3Link: uploadFileS3Link
};
