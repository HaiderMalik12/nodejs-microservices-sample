import AppSettings from '@logs/models/appSettings';
import axios from 'axios';

export async function syncDispatcherToken() {
  let currentAppSetting = await AppSettings.findOne(
    {
      deliveryData: { $ne: null }
    },
    { _id: 1, deliveryData: 1 }
  ).lean();

  if (currentAppSetting) {
    let isSend = true;
    if (isSend) {
      try {
        const config = {
          method: 'post',
          url: `${process.env.DISPATCHER_BASE_URL}/api/v1/admin/refreshToken`,
          headers: {},
          data: {
            token: currentAppSetting?.deliveryData?.refreshToken || null,
            appId: currentAppSetting?.deliveryData?.userMetaData._id
          }
        };
        let responce = await axios(config);
        if (responce.data && responce.data.data && responce.data.data.token && responce.data.data.tokenExpiry) {
          await AppSettings.findOneAndUpdate(
            { _id: currentAppSetting._id },
            {
              $set: {
                'deliveryData.token': responce.data.data.token,
                'deliveryData.refreshToken': responce.data.data.token,
                'deliveryData.tokenExpiry': responce.data.data.tokenExpiry
              }
            },
            { new: true }
          );
        }
      } catch (error: any) {
        console.log(`Error sync dispatcher token : ${error.message}`);
      }
    }
  }
}
