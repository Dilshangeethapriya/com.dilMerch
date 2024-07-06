"use server"

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";




const addSchema = z.object({ 
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    image: z.any().refine(file => file, "Please upload Image")
});


export async function addProduct(prevState: unknown, formData: FormData){
    const result = addSchema.safeParse(Object.fromEntries(formData.entries())) ;
    if(result.success === false){
        return result.error.formErrors.fieldErrors;
    }

    console.log(result);

    const data = result.data;
    await fs.mkdir("/public/products", {recursive: true});
    const imagePath = `/public/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()));

   await db.product.create({ data: {
    isAvailableForPurchase: false,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath : imagePath,
        imagePath: imagePath
    }}) 

    redirect("/admin/products");
}

const editSchema = addSchema.extend({
    image: z.optional(z.any().refine(file => file, "Please upload Image"))
})

export async function updateProduct(id : string, prevState: unknown, formData: FormData){
    const result = editSchema.safeParse(Object.fromEntries(formData.entries())) ;
    if(result.success === false){
        return result.error.formErrors.fieldErrors;
    }

    

    const data = result.data;
    const product = await db.product.findUnique({where: {id}})

    if(product == null){
        return notFound();
    }

    let imagePath = product.imagePath;
    if(data.image != null &&  data.image.size > 0) {
        await fs.unlink(product.imagePath);
        imagePath = `/public/products/${crypto.randomUUID()}-${data.image.name}`;
        await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()));
    }
    


   await db.product.update({where: {id},
     data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath : imagePath,
        imagePath: imagePath
    }}) 

    redirect("/admin/products");
}


export async function toggleProductAvailability(id:string, isAvailableForPurchase: boolean){
    await db.product.update({where:{id}, data: {isAvailableForPurchase}})
}

export async function deleteProduct(id:string){
    const product = await db.product.delete({where:{id}})

    if(product == null){
        return notFound();
    }

    await fs.unlink(product.imagePath);
}