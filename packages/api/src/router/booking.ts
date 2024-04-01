import { cancelBookingController } from "../controllers/booking/cancel";
import { createBookingController } from "../controllers/booking/create";
import { getBookingController } from "../controllers/booking/get";
import { listUpcomingController } from "../controllers/booking/list";
import { createTRPCRouter } from "../trpc";


export const bookingRouter = createTRPCRouter({
    create: createBookingController,
    list: listUpcomingController,
    get: getBookingController,
    cancel: cancelBookingController
})


