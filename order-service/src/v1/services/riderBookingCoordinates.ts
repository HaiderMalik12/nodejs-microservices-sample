import riderBookingCoordinates, { IRiderBookingCoordinates } from "@logs/models/riderBookingCoordinates";


export async function saveRiderBookingCoordinates(payload: IRiderBookingCoordinates) {
    return await riderBookingCoordinates.findOneAndUpdate(
        { userId: payload.userId, appId: payload.appId, bookingId: payload.bookingId },
        {
            $setOnInsert: {
                userId: payload.userId,
                appId: payload.appId,
                bookingId: payload.bookingId
            },
            $push: {
                coordinates: { $each: payload.coordinates }
            }
        },
        {
            new: true,
            upsert: true
        }
    );
}