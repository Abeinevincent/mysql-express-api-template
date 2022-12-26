const admin = require("firebase-admin");
const uuid = require('uuid-v4');

// Path to your service account
const serviceAccount = require("path/to/serviceAccountKey.json");

// Initialise admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "YourDefaultBucketName.appspot.com"
});

const bucket = admin.storage().bucket();

const filename = "pathToImage e.g sampleimage.png" //If sample image is in the same directory as this file

// Upload Image function
const uploadFile = async () => {

  const metadata = {
    metadata: {
      // This line is very important. It creates a download token.
      firebaseStorageDownloadTokens: uuid() // U can replace uuid with your unique identifier library or function call if youre generating it with a custom function 
    },
    contentType: 'image/png',
    cacheControl: 'public, max-age=31536000',
  };

  // Uploads a local file to the bucket
  await bucket.upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: metadata,
  });

console.log(`${filename} uploaded.`);

}

uploadFile().catch(console.error);