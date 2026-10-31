import mongoose from 'mongoose'

// Opens the connection to MongoDB Atlas. If it fails, server.js stops the app
// instead of running an API that cannot reach its database.
export async function connectDB(uri) {
  mongoose.set('strictQuery', true)
  const connection = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  console.log(`MongoDB connected: ${connection.connection.host} / ${connection.connection.name}`)
  return connection
}
