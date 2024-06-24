import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export async function POST(request: Request) {
  try {
    const { priceId, email, userId } = await request.json();
    console.log(priceId, email, userId);

    const session = await stripe.checkout.sessions.create({
      metadata: {
        user_id: userId,
      },
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          // base subscription
          price: priceId,
        },
        {
          // one-time setup fee
          price: "price_1OtHdOBF7AptWZlcPmLotZgW",
          // price_1PVJhbRu5zEke2diP62za8Hb
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/cancel`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
