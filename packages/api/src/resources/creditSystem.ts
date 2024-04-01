import type { subscription } from "@solu/db";
import { type prisma } from "@solu/db"
import { v4 as uuidv4 } from 'uuid';

export type CreditSystemType = 'TopUp' | 'Basic' | 'Premium' | 'Stellar';



type PrismaClient = typeof prisma

interface CreditSystemConfig {
    type: CreditSystemType;
    points: number
    amount: number;
    duration: number;
    userId: string;
}

interface Subscription {
    id: string;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}


const permissionsMap: { [key in CreditSystemType]: string[]} = {
    'TopUp': ['canBookSession'],
    'Basic': ['canGetDiscountBooking', 'canBookSession', 'canViewPremiumContent',  'solu weekends'],
    'Premium': ['canGetDiscountBooking', 'canBookSession', 'canViewPremiumContent',  'solu weekends'],
    'Stellar' : ['canGetDiscountBooking', 'canBookSession', 'canViewPremiumContent', 'hasVipAccess', 'self-care box', 'solu weekends']
}

export class CreditSystem {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async buildPackage(config: CreditSystemConfig): Promise<void> {
        // Validate config
        if (config.amount <= 0 || config.duration <= 0) {
            throw new Error("Invalid package configuration");
        }

        // Perform package-specific logic (e.g., top-up, subscription)
        switch (config.type) {
            case 'TopUp':
                await this.topUp(config);
                break;
            case 'Basic':
            case 'Premium':
            case 'Stellar':
                await this.subscribe(config);
                break;
            default:
                throw new Error("Invalid package type");
        }
    }

    async getActiveSubscription(userId: string): Promise<Subscription | null> {
        const currentDate = new Date();
        
        const activeSubscription = await this.prisma.subscription.findFirst({
            where: {
                wallet: {
                    userId: userId
                },
                expiryDate: {
                    gt: currentDate
                }
            }
        });
        return activeSubscription;
    }

    async getSubscriptions(userId: string): Promise<Subscription[]> {
        const subscriptions = await this.prisma.subscription.findMany({
            where: {
                wallet: {
                    userId: userId
                }
            }
        });
        return subscriptions;
    }

    async subscribe(config: CreditSystemConfig): Promise<void> {
        const currentDate = new Date();
        const expiryDate = new Date(currentDate.getTime() + config.duration * 24 * 60 * 60 * 1000);

        // todo: change paymentId to actual id
        const paymentId =  uuidv4();
        const permissions = permissionsMap[config.type]

        await this.prisma.subscription.create({
            data: {
                wallet: {
                    connect: { userId: config.userId }
                },
                permissions, // TopUp plan has no specific permissions
                amount: config.amount,
                paymentId, 
                metadata: {}, // add payments info 
                points: config.points,
                expiryDate: expiryDate
            }
        });

        // Update user's wallet with the amount
        await this.prisma.wallet.update({
            where: { userId: config.userId },
            data: {
                point: {
                
                    increment: config.amount
                },
                logs: {
                    create: {
                        point: config.amount,
                        type: 'Credit',
                        reasons: [`Subscribed to ${config.type}`]
                    }
                }
            }
        });
    }

    async cancelSubscription(userId: string, subscriptionId: string): Promise<subscription> {
        // Find active subscriptions
        const activeSubscription = await this.prisma.subscription.update({
            where: {
                id: subscriptionId,
              
            },
            data: {
               isCancelled: true
            },
            include: {
                wallet: true
            }
        });
       return activeSubscription;
    }

    async topUp(config: CreditSystemConfig): Promise<void> {
        await this.prisma.wallet.update({
            where: { userId: config.userId },
            data: {
                point: {
                    increment: config.amount
                },
                logs: {
                    create: {
                        point: config.amount,
                        type: 'Credit',
                        reasons: [`Top-up ${config.amount}`]
                    }
                }
            }
        });
    }


    static convertAmountToPoint (amount: number,type: CreditSystemType ){
        let rate = 0.98 // relook into out rate
        if (type === 'TopUp'){
            rate  = 0.85
    
        }
        return  amount * rate ;
    }
}
