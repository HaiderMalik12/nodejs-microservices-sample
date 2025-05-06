import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for user metadata
interface IUserMetaData {
  email: string;
  _id: string;
}

interface IDeliveryData {
  userMetaData: IUserMetaData;
  appCode: string;
  token: string;
  refreshToken: string;
  tokenExpiry: number;
  type: string;
  deepLinkUrl: string;
  baseUrl: string;
}

export interface IAppSetting extends Document {
  deliveryData: IDeliveryData | null;
}

const AppSettingSchema = new Schema<IAppSetting>(
  {
    deliveryData: {
      userMetaData: {
        email: { type: String, required: true },
        _id: { type: String, required: true }
      },
      appCode: { type: String, required: true },
      token: { type: String, required: true },
      refreshToken: { type: String, required: true },
      tokenExpiry: { type: Number, required: true },
      type: { type: String, required: true },
      deepLinkUrl: { type: String, required: true },
      baseUrl: { type: String, required: true }
    }
  },
  { timestamps: true }
);
// Export the model
const appSettings = mongoose.model<IAppSetting>('AppSettings', AppSettingSchema);

export default appSettings;
