const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createJob = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User not authenticated",
    );
  }

  const {
    title,
    description,
    difficulty,
    quality,
    handwrittenLength,
    subject,
    credit,
  } = data;
  const price = calculatePrice(
    difficulty,
    quality,
    handwrittenLength,
    subject,
    credit,
  );
  const job = {
    title,
    description,
    difficulty,
    quality,
    handwrittenLength,
    subject,
    credit,
    price,
    clientId: context.auth.uid,
    status: "open",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await admin.firestore().collection("jobs").add(job);

  return { jobId: docRef.id, price };
});

exports.acceptJob = functions.https.onCall(async)