"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Customer } from "@/domain/customer/customer";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  city: z.string().min(2, "Ville/Quartier requis"),
  address: z.string().min(5, "Adresse requise"),
  landmark: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: Customer) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      landmark: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className="rounded-xl border border-[#e8e4d9] bg-white p-6">
        <legend className="mb-4 font-serif text-xl font-semibold text-[#1a1a2e] px-1">
          Informations personnelles
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="fullName" className="text-sm font-medium text-[#1a1a2e]">
              Nom complet *
            </label>
            <input
              id="fullName"
              {...register("fullName")}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.fullName ? "border-destructive focus-visible:ring-destructive" : "border-input"
              )}
              placeholder="Prénom et Nom"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              aria-required="true"
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-[#1a1a2e]">
              Téléphone *
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.phone ? "border-destructive focus-visible:ring-destructive" : "border-input"
              )}
              placeholder="Ex: 77 123 45 67"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              aria-required="true"
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#1a1a2e]">
              Email (optionnel)
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.email ? "border-destructive focus-visible:ring-destructive" : "border-input"
              )}
              placeholder="votre@email.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-[#e8e4d9] bg-white p-6">
        <legend className="mb-4 font-serif text-xl font-semibold text-[#1a1a2e] px-1">
          Adresse de livraison
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="city" className="text-sm font-medium text-[#1a1a2e]">
              Ville / Quartier *
            </label>
            <input
              id="city"
              {...register("city")}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.city ? "border-destructive focus-visible:ring-destructive" : "border-input"
              )}
              placeholder="Ex: Dakar, Almadies"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              aria-required="true"
            />
            {errors.city && (
              <p id="city-error" className="text-xs text-destructive">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="address" className="text-sm font-medium text-[#1a1a2e]">
              Adresse précise *
            </label>
            <input
              id="address"
              {...register("address")}
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.address ? "border-destructive focus-visible:ring-destructive" : "border-input"
              )}
              placeholder="Rue, numéro de villa/bâtiment"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
              aria-required="true"
            />
            {errors.address && (
              <p id="address-error" className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="landmark" className="text-sm font-medium text-[#1a1a2e]">
              Point de repère (optionnel)
            </label>
            <input
              id="landmark"
              {...register("landmark")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="À côté de..."
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="notes" className="text-sm font-medium text-[#1a1a2e]">
              Notes pour le livreur (optionnel)
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Informations supplémentaires (heures préférées, etc.)"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1a1a2e] text-[#f5f0e6] hover:bg-[#1a1a2e]/90 sm:w-auto sm:min-w-[200px]"
        >
          {isSubmitting ? "Validation..." : "Valider la commande"}
        </Button>
      </div>
    </form>
  );
}
