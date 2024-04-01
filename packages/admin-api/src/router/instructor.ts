import { createInstructorController } from "../controllers/instructor/create";
import { deleteInstructorController } from "../controllers/instructor/delete";
import { getInstructorByIdController } from "../controllers/instructor/get";
import { listInstructorController } from "../controllers/instructor/list";
import { eidtInstructorController } from "../controllers/instructor/update";
import { createTRPCRouter } from "../trpc";


const instructorRouters = createTRPCRouter({
   create: createInstructorController,
   list: listInstructorController,
   get: getInstructorByIdController,
   edit: eidtInstructorController,
   delete: deleteInstructorController
})

export { instructorRouters }
