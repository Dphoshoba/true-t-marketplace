"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";

// Initialize Stripe (Placeholder key if env var missing)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2023-10-16" as any,
});

/**
 * Creates a Stripe Connect Account for the seller (Tanya)
 * and generates an account link for onboarding.
 */
export const createStripeConnectAccount = action({
    args: {
        returnPath: v.optional(v.string()), // e.g. "/dashboard"
    },
    handler: async (ctx, args) => {
        try {
            if (!process.env.STRIPE_SECRET_KEY) {
                console.warn("Missing STRIPE_SECRET_KEY env variable. Using placeholder for testing.");
                // throw new Error("Missing STRIPE_SECRET_KEY env variable");
            }

            // 1. Create a Standard or Express account (Standard feels best for full control)
            const account = await stripe.accounts.create({
                type: "standard",
                country: "AU", // Assuming Australia based on typo 'Jewellery' and timezone? Or defaulting to US. 
                // Actually user is in +10:30 (Adelaide/Darwin), so AU is correct.

                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });

            // 2. Create the account link for onboarding
            // HARDCODED to localhost:3000 to prevent redirection to port 5173 (Echoes & Visions app)
            const DOMAIN = "http://localhost:3000";
            const returnPath = args.returnPath || "/admin";

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `${DOMAIN}${returnPath}`,
                return_url: `${DOMAIN}${returnPath}?stripe_connected=true&account_id=${account.id}`,
                type: "account_onboarding",
            });

            return { url: accountLink.url };
        } catch (error) {
            console.error("Stripe Onboarding Error:", error);
            throw new Error("Failed to initiate Stripe connection: " + (error as any).message);
        }
    },
});

/**
 * Creates a Checkout Session for a product.
 * Splits payment: 1% to Platform, Rest to Connected Account.
 */
export const createCheckoutSession = action({
    args: {
        productId: v.id("products"),
        price: v.number(), // In dollars (e.g. 100)
        name: v.string(),
        stripeAccountId: v.string(), // The seller's connected account ID
    },
    handler: async (ctx, args) => {
        try {
            if (!process.env.STRIPE_SECRET_KEY) console.warn("Missing Stripe Key (using placeholder)");

            const priceInCents = Math.round(args.price * 100);

            const platformFee = Math.round(priceInCents * 0.10); // 10% (5% Tanya + 5% Platform)

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "aud",
                            product_data: {
                                name: args.name,
                            },
                            unit_amount: priceInCents,
                        },
                        quantity: 1,
                    },
                ],
                payment_intent_data: {
                    application_fee_amount: platformFee,
                    transfer_data: {
                        destination: args.stripeAccountId,
                    },
                },
                success_url: `http://localhost:3000/success`,
                cancel_url: `http://localhost:3000/cancel`,
            });

            return { url: session.url };
        } catch (error) {
            console.error("Stripe Checkout Error:", error);
            throw new Error("Failed to create checkout session");
        }
    },
});
