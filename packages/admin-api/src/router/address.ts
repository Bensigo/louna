import { createAddressController } from "../controllers/address/create";
import { deleteAddressController } from "../controllers/address/delete";
import { getAddressController } from "../controllers/address/get";
import { listAddressController } from "../controllers/address/list";
import { updateAddressController } from "../controllers/address/update";
import { createTRPCRouter } from "../trpc";


export const addressRouters = createTRPCRouter({
    create: createAddressController,
    list: listAddressController,
    get: getAddressController,
    delete: deleteAddressController,
    update: updateAddressController
})