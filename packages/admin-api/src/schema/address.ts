import { z } from "zod";

export const CreateAddresSchema = z.object({
    name: z.string(),
    lat: z.string(),
    building: z.string(),
    floor: z.string(),
    street: z.string().optional(),
    lng: z.string(),
    city: z.string(),
    country: z.string(),
    partnerId: z.string()
  });

  

export const UpdateAddressSchema = z.object({
  id: z.string(),
  name: z.string(),
  lat: z.string(),
  building: z.string(),
  floor: z.string(),
  street: z.string().optional(),
  lng: z.string(),
  city: z.string(),
  country: z.string(),
})
