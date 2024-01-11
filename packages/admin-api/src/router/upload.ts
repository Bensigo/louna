import { getImageController } from "../controllers/upload/getImage";
import { getFilesByBaseIdsController } from "../controllers/upload/getImagesByBaseId";
import { getUploadPreSignedUrl } from "../controllers/upload/getSignedUrl";
import { validateFileUploadController } from "../controllers/upload/validateUpload";
import { createTRPCRouter } from "../trpc";


export const uploadRouters = createTRPCRouter({
    getUploadPreSignedUrl: getUploadPreSignedUrl,
    getImage: getImageController,
    updateFileUpload: validateFileUploadController,
    getFilesByBaseId: getFilesByBaseIdsController
})