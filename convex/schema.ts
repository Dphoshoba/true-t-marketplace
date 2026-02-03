import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        name: v.string(),
        price: v.number(),
        description: v.string(),
        category: v.string(),
        image: v.string(),
        status: v.string(), // 'published' | 'draft'
        seo: v.object({
            title: v.string(),
            description: v.string(),
            slug: v.string(),
        }),
    }),
    posts: defineTable({
        title: v.string(),
        excerpt: v.string(),
        content: v.string(),
        author: v.string(),
        date: v.string(),
        image: v.string(),
        category: v.string(),
        readingTime: v.string(),
        status: v.string(),
        seo: v.object({
            title: v.string(),
            description: v.string(),
            slug: v.string(),
        }),
    }),
    projects: defineTable({
        title: v.string(),
        client: v.string(),
        category: v.string(),
        year: v.string(),
        description: v.string(),
        image: v.string(),
        challenge: v.string(),
        outcome: v.string(),
    }),
    bookings: defineTable({
        customerName: v.string(),
        email: v.string(),
        service: v.string(),
        date: v.string(),
        status: v.string(), // 'pending' | 'confirmed' | 'completed'
        message: v.string(),
        timestamp: v.string(),
    }),
    site_settings: defineTable({
        brandName: v.string(),
        primaryColor: v.string(),
        fontFamily: v.string(),
        logoUrl: v.string(),
        socialLinks: v.object({
            instagram: v.string(),
            pinterest: v.string(),
            facebook: v.string(),
            linkedin: v.string(),
        }),
        stripeAccountId: v.optional(v.string()),
    }),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.string(), // 'artist' | 'admin'
        stripeAccountId: v.optional(v.string()),
        joinedAt: v.string(),
    }),
});
