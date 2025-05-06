import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IRiderCoordinates {
  userId: string;
  appId: string;
  rider: Object;
  coordinates: {
    lat: number;
    lng: number;
    created: Date;
    firstState: FIRST_STATE,
    secondState: SECOND_STATE,
  }[];
}

export enum FIRST_STATE {
  LOGIN = "login",
  LOGOUT = "logout"
}
export enum SECOND_STATE {
  FOREGROUND = "foreground",
  BACKGROUND = "background"
}

// 2. Create a Schema corresponding to the document interface.
const riderCoordinatesSchema = new Schema<IRiderCoordinates>(
  {
    userId: {
      type: String,
      required: true
    },
    rider: {
      type: Object,
      required: true
    },
    appId: {
      type: String,
      required: true
    },
    coordinates: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        created: { type: Date, default: Date.now },
        firstState: { type: String, enum: Object.values(FIRST_STATE) },
        secondState: { type: String, enum: Object.values(SECOND_STATE) },
      }
    ]
  },
  {
    timestamps: true
  }
);

const riderCoordinates = model<IRiderCoordinates>('RiderCoordinates', riderCoordinatesSchema);

export default riderCoordinates;
