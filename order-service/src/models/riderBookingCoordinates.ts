/**
 * If rider off the internet connection on rider app, we are saving the coordinates
 * in the android device. As soon as rider connects to the internet, we are sending
 * the coordinates to the server. This model will save the coordinates against the booking
 */
import { Schema, model } from 'mongoose';

export interface IRiderBookingCoordinates {
    userId: string;
    bookingId: string;
    appId: string;
    coordinates: {
        lat: number;
        lng: number;
        created: Date;
    }[];
}

const riderBookingCoordinatesSchema = new Schema<IRiderBookingCoordinates>(
    {
        userId: {
            type: String,
            required: true
        },
        bookingId: {
            type: String,
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
                created: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
);

const riderBookingCoordinates = model<IRiderBookingCoordinates>('RiderBookingCoordinates', riderBookingCoordinatesSchema);

export default riderBookingCoordinates;
