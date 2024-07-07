import db from "@/db/db"; 
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'; 
import path from 'path'; 

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    // Fetching product data
    const product = await db.product.findUnique({
      where: { id },
      select: { imagePath: true, name: true },
    });

    // checking if the prduct is notFound
    if (!product) {
      return notFound();
    }

    // resolving absolute file path 
    const filePath = path.join(process.cwd(), product.imagePath); // Adjust as needed

 
    
    const { size } = await fs.stat(filePath);

    
    const image = await fs.readFile(filePath);

    // Extract extension 
    const extension = path.extname(filePath).slice(1); // Use path.extname for accuracy

    // Build response with appropriate headers
    const response = new NextResponse(image, {
      headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString(),
        "Content-Type": `image/${extension}` 
      },
    });

    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return new Response("Internal Server Error", { status: 500 }); // handling errors
  }
}