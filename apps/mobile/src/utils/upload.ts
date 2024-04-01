import * as FileSystem from "expo-file-system";
import {Buffer} from "buffer";
import axios from 'axios'


export const getBlob = async (fileUri: string) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  };
  
  export const uploadImage = async (uploadUrl: string, fileUri: string, fileType: string) => {
    // const base64 = await FileSystem.readAsStringAsync(fileUri, {
    //     encoding: FileSystem.EncodingType.Base64,
    //   });
    //   const buffer = Buffer.from(base64, "base64");
    const blob = getBlob(fileUri)
   console.log({ blob, fileType  })
    return axios(uploadUrl, {
        method: "POST",
       data: blob,
        headers: {
            'Content-Type': 'image/jpg',
        }
    });
};
