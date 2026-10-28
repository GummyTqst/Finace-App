"use server";

import z from "zod";
import Stripe from "stripe";

// const stripeClient = new Stripe(process.env.STRIPE_SECRET || "")

// async function createCheckoutSession(price: string, user_id: string, user_email: string) {
//     const session = await stripeClient.checkout.sessions.create({
//         mode: "subscription",
//         line_items: [
//             {
//                 price,
//                 quantity: 1,
//             }
//         ],
//         customer_email: user_email,
//         metadata: {
//             userId: user_id
//         },
//         success_url: "http://localhost:3400/checkout/success?session_id={CHECKOUT_SESSION_ID}",
//         cancel_url: "http://localhost:3400/checkout/cancel",
//     });

//     return session.url;
// }

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  subscription: z.string().min(1),
  tos_read: z
    .string()
    .transform((value) => value === "on")
    .refine((value) => value === true, {
      message: "Du skal acceptere brugerbetingelserne",
    }),
});

export default async function registerAction(
  prevState: any,
  formData: FormData,
) {
  const { name, email, password, subscription, tos_read } =
    Object.fromEntries(formData);

  const validated = schema.safeParse({
    name,
    email,
    password,
    subscription,
    tos_read,
  });

  if (!validated.success) {
    return { error: "Ugyldigt input – tjek felterne" };
  }

  // if (!validated.success) {
  //     return {
  //         ...validated,
  //         error: z.treeifyError(validated.error).properties
  //     }
  // }

  const response = await fetch("http://api:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: validated.data.name,
      email: validated.data.email,
      password: validated.data.password,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return { error: data.error ?? "Kunne ikke registrere bruger" };
  }

  const stripeClient = new Stripe(process.env.STRIPE_SECRET || "");

  const product = await stripeClient.products.retrieve(
    validated.data.subscription,
    {
      expand: ["default_price"],
    },
  );

  const price = product.default_price;

  if (!price || typeof price === "string") {
    return { error: "Produktet har ikke en pris" };
  }

  const session = await stripeClient.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer_email: validated.data.email,
    success_url:
      "http://localhost:3400/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3400/checkout/cancel",
  });

  return { success: true, checkoutUrl: session.url };
}
