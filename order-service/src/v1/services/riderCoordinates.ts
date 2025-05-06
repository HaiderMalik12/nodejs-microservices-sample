import moment from 'moment';
import riderCoordinates from '@logs/models/riderCoordiantes';
import fs from 'fs';
import { Request, Response } from 'express';
import { PassThrough } from 'stream';
import fileUpload from './fileUpload';
import path from 'path';
import momentTz from 'moment-timezone';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import dispatcherAxios from './dispatcherAxios';

interface AllRidersCoordiantesInput {
  startDate: Date | null;
  endDate: Date | null;
  pageValue?: number;
  limitValue?: number;
  appId: string;
}

interface CreateRiderCoordinates {
  userId: string;
  appId: string;
  deviceToken: string;
  coordinate: {
    lat: number;
    lng: number;
    created: Date;
  };
}

/**
 * Get rider details from dispatcher microservice based on rider _id or device token
 * @param userId - A rider Id
 */
async function getRiderFromDispatcher(userId: string, appId: string, deviceToken: string) {
  return await dispatcherAxios.get(
    `/admin/getDriverByIdV2`,
    {
      userId,
      deviceToken
    },
    { appId }
  );
}

export async function saveRiderCoordinates(payload: CreateRiderCoordinates) {
  const rider = await getRiderFromDispatcher(payload.userId, payload.appId, payload.deviceToken);
  if (!rider) {
    throw new Error('could not be able to fetch the rider details from dispatcher');
  }
  if (!payload.userId) {
    payload.userId = rider._id;
  }
  return await riderCoordinates.findOneAndUpdate(
    { userId: new ObjectId(payload.userId), appId: payload.appId }, // Query to find the specific document
    {
      $push: { coordinates: payload.coordinate }, // Push the new coordinate to the array
      rider
    },
    {
      new: true, // Return the updated document
      upsert: true // Create the document if it doesn't exist
    }
  );
}

export async function getAllRidersCoordinates({ startDate, endDate, appId }: AllRidersCoordiantesInput) {
  const filter: Record<string, string | object> = {
    appId
  };
  if (startDate && endDate) {
    filter['coordinates.created'] = {
      $gte: new Date(moment(startDate).startOf('day').toDate()),
      $lte: new Date(moment(endDate).endOf('day').toDate())
    };
  }

  const pipeline: any = [
    // Unwind the coordinates array to work with individual coordinate documents
    { $unwind: '$coordinates' },
    { $match: filter },

    // Sort by userId and created date to get the latest coordinates at the top per user
    { $sort: { 'coordinates.created': -1, userId: 1 } },

    // Group by userId and appId, and get the first coordinate (latest) for each group
    {
      $group: {
        _id: { userId: '$userId', appId: '$appId' },
        latestCoordinate: { $first: '$coordinates' },
        rider: { $first: '$rider' }
      }
    },

    // Project the fields you want to return
    {
      $project: {
        _id: 0,
        userId: '$_id.userId',
        appId: '$_id.appId',
        rider: 1,
        latestCoordinate: 1
      }
    }
  ];

  const riders = await riderCoordinates.aggregate(pipeline).exec();
  return riders;
}
export async function exportAllRidersCoordinates(req: Request, res: Response) {
  try {
    const fileName = 'rider-coordinates.csv';
    const directoryPath = path.resolve(__dirname, '../../public/files/');
    const fileUrl = path.join(directoryPath, fileName);

    const appId = req.headers.appid?.toString() || '';
    const startDate = req.query.startDate ? new Date(req.query.startDate.toString()) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate.toString()) : null;

    const riders = await getAllRidersCoordinates({ startDate, endDate, appId });
    const writableStream = fs.createWriteStream(fileUrl);

    // Write CSV Header
    const header = `No.,Driver Id, Driver Name, Driver Phone No.,Platform,Platform City,Longitude,Latitude,CreatedAt,First State,2nd State\n`;
    writableStream.write(header);

    // Write CSV Rows
    riders.forEach((data: any, index: number) => {
      const line = formatRiderData(data, index + 1);
      writableStream.write(line);
    });

    writableStream.end();
    writableStream.on('finish', async () => await handleFileUpload(fileName, fileUrl, req, res));
    writableStream.on('error', (err) => handleWriteError(err, res));
  } catch (err) {
    console.error('Error exporting rider coordinates:', err);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

function formatRiderData(data: any, count: number): string {
  const driverNo = data?.rider?.driverNo || '';
  const driverName = `${data?.rider?.firstName || ''} ${data?.rider?.lastName || ''}`.trim();
  const driverPhone = `${data?.rider?.countryCode || ''} ${data?.rider?.phone || ''}`.trim();
  const platform = data?.rider?.platform || '';
  const platformCity = data?.rider?.platform_city || '';
  const longitude = data.latestCoordinate.lng || '';
  const latitude = data.latestCoordinate.lat || '';
  const createdAt = data.latestCoordinate.created
    ? momentTz(data.latestCoordinate.created).tz('Asia/Dubai').format('YYYY-MM-DD HH:mm:ss')
    : '';
  const firstState = data.latestCoordinate.firstState || '';
  const secondState = data.latestCoordinate.secondState || '';

  return `${count},${driverNo},${driverName},${driverPhone},${platform},${platformCity},${longitude},${latitude},${createdAt},${firstState},${secondState}\n`;
}

async function handleFileUpload(fileName: string, fileUrl: string, req: Request, res: Response) {
  try {
    const readableStream = fs.createReadStream(fileUrl);
    const passThrough = new PassThrough();
    readableStream.pipe(passThrough);

    await fileUpload.uploadFileS3(fileName, passThrough, req, res);
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    res.status(500).send('Error uploading file');
  }
}

function handleWriteError(err: Error, res: Response) {
  console.error('Error writing to CSV file:', err);
  res.status(500).send('Error writing CSV file');
}
