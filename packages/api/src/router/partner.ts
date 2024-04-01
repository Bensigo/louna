import { getPartnerWithSessoions } from "../controllers/partner/get";
import { listPartnerWithSessions } from "../controllers/partner/list";
import { createTRPCRouter } from "../trpc";



export const partnerRouter = createTRPCRouter({
    list: listPartnerWithSessions,
    get: getPartnerWithSessoions
})