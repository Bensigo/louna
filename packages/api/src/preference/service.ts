import { PrismaClient } from "@lumi/db";
import { CreateProfileSchema } from './schema'
import { z } from "zod";

export default class PreferenceService {
    private prisma: PrismaClient;

    constructor(){
        this.prisma  = new PrismaClient();
    }
    async cretate ( userId: string, data: z.infer<typeof CreateProfileSchema>){
        const pref = await this.prisma.$transaction(async (tx) => {
            const preference = await tx.preference.create({
                data: {
                    age: data.age,
                    height: parseFloat(data.height),
                    weight: parseFloat(data.weight),
                    intrest: data.intrest,
                    user: {
                        connect: { id: userId }
                    },
                }
            });

            await tx.profile.update({
                where: { id: userId },
                data: {
                    hasPref: true,
                    ...(data.isHealthKitAuthorize ? { hasHealthKitAuthorize: true } : {})
                }
            });

            return preference;
        });
    }
    async update(userId: string, data: Partial<z.infer<typeof CreateProfileSchema>>) {
        const updatedPreference = await this.prisma.preference.update({
            where: { userId },
            data: {
                age: data.age,
                height: data.height ? parseFloat(data.height) : undefined,
                weight: data.weight ? parseFloat(data.weight) : undefined,
                intrest: data.intrest,
            },
        });

        if (data.isHealthKitAuthorize !== undefined) {
            await this.prisma.profile.update({
                where: { id: userId },
                data: {
                    hasHealthKitAuthorize: data.isHealthKitAuthorize
                }
            });
        }

        return updatedPreference;
    }

    async get(userId: string) {
        const preference = await this.prisma.preference.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        hasHealthKitAuthorize: true
                    }
                }
            }
        });

        if (!preference) {
            throw new Error('Preference not found');
        }

        return {
            ...preference,
            isHealthKitAuthorize: preference.user.hasHealthKitAuthorize
        };
    }
}