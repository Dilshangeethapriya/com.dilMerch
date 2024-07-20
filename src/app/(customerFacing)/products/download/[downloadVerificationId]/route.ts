import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"

export async function GET(req: NextRequest, {params: {
    downloadVerificationId} , }: {params: {downloadVerificationId : string}}) {
    const data = await db.downloadVerification.findUnique({where: {id: downloadVerificationId, expiresAt: {gt: new Date()}}, 
     select: {product: {select: {filePath: true, name: true}}}
})
    
    if(data == null){
        return NextResponse.redirect(new URL("/products/download/expired", req.url));
    }
    const path = require('path');
    const relFilePath =  `public/${data.product.filePath}`;
    const baseDir = process.cwd(); // Get current working directory (optional)
    const filePath = path.join(baseDir, relFilePath);  // Join (optional)
    const {size} = await fs.stat(filePath);
    const file = await fs.readFile(filePath);
    const extension = data.product.filePath.split(".").pop();

    return new NextResponse(file, {
        headers: {
           "Content-Disposition" : `attachment; filename="${data.product.name}.${extension}"`,
           "Content-Length" : size.toString(),
        }
    })
  
}