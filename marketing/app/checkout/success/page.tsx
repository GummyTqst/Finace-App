import Stripe from "stripe";
// import sendMail from "@/lib/mail";

import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-neutral-500">Mangler session ID.</p>
      </div>
    );
  }

  const stripeClient = new Stripe(process.env.STRIPE_SECRET || "");

  const session = await stripeClient.checkout.sessions.retrieve(session_id, {
    expand: ["subscription", "subscription.items.data.price"],
  });

  const subscription = session.subscription as Stripe.Subscription;

  if (typeof subscription !== "object" || subscription === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-neutral-500">Ingen abonnement fundet.</p>
      </div>
    );
  }

  if (session.customer_email && typeof session.customer === "string") {
    await fetch("http://api:3000/api/v1/users/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.customer_email,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: new Date(
          subscription.items.data[0].current_period_end * 1000,
        ).toISOString(),
      }),
    });
  }

  const info = await transporter.sendMail({
    from: "neumsnn.tobias@gmail.com",
    to: "neumsnn.tobias@gmail.com",
    subject: "Test email",
    text: "Dette er en test",
  });

  console.log("Message sent: %s", info.messageId);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("Preview URL: %s", previewUrl);

  // const price = subscription.items.data[0]?.price

  // let productName = "dit produkt"
  // if (typeof price === "object" && price !== null && typeof price.product === "string") {
  //     const product = await stripeClient.products.retrieve(price.product)
  //     if (!("deleted" in product)) {
  //         productName = product.name
  //     }
  // }

  // try {
  //     await sendMail(
  //         session.customer_email ?? "",
  //         "Tak for dit køb!",
  //         `<p>Hej!</p><p>Tak fordi du købte <strong>${productName}</strong>. Din betaling er gennemført, og din konto er nu aktiv.</p>`
  //     )
  //     console.log("EMAIL SENT TO:", session.customer_email)
  // } catch (error) {
  //     console.error("EMAIL FAILED:", error)
  // }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Betaling gennemført</h1>
        <p className="mt-2 text-neutral-500">
          Din konto er nu oprettet. Velkommen!
        </p>
      </div>
    </div>
  );
}
