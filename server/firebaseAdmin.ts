import admin from 'firebase-admin';

/**
 * Initialise Firebase Admin SDK.
 *
 * In production (Railway) set the FIREBASE_SERVICE_ACCOUNT env var to the
 * full JSON string of the service-account key, e.g.:
 *   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"resume-alchemy-app",...}'
 *
 * Locally you can either:
 *   • Set the same env var, or
 *   • Set GOOGLE_APPLICATION_CREDENTIALS to the path of the JSON key file.
 *
 * If neither is set the SDK still initialises (useful for local dev when
 * running against the Firebase emulator or when ADC is configured).
 */
function initFirebaseAdmin() {
    if (admin.apps.length) return admin; // already initialised

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('✅ Firebase Admin initialised with service-account JSON');
        } catch (err: any) {
            console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', err.message);
            // Fall through to default init
            admin.initializeApp();
        }
    } else {
        // Uses GOOGLE_APPLICATION_CREDENTIALS or ADC
        admin.initializeApp();
        console.log('✅ Firebase Admin initialised with application-default credentials');
    }

    return admin;
}

initFirebaseAdmin();

export default admin;
