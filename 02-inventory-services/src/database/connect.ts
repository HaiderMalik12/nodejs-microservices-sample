const mongoose = require('mongoose');

export async function mongoDBconnection() {
  const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}`;

  try {
    const connectionString = Number(process.env.USE_ATLAS) === 1 ? mongoUrl : process.env.MONGO_URL;
    await mongoose.connect(connectionString, {
      readPreference: 'secondary',
    });
    console.info('Db successfully connected!');
    return 'Db successfully connected!';
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
