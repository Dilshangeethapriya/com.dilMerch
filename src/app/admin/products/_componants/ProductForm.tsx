"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

// productform componant
export function ProductForm({ product }: { product?: Product | null }) {
  // handling formstate and errors
  const [error, action] = useFormState(
    // setting what action to execute based on product exitence
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  //setting state variables to manage price in cents input
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  // rendering the form
  return (
    <form action={action} className="space-t-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}></Input>
        {error.name && (
          <div className="text-destructive">
            {error.name}
            {/* displaying error messages for inputs if exists same method is applyied for other inputs too */}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) =>
            setPriceInCents(Number(e.target.value) || undefined)
          }></Input>
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive">{error.priceInCents}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}></Textarea>
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product.imagePath}
            height="300"
            width="300"
            alt="Product Image"></Image>
        )}
        {/*Rendering the product image if exists*/}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton></SubmitButton>
    </form>
  );
}

// submit button componant
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="my-4" type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
