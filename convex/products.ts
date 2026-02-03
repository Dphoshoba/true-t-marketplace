import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});

export const add = mutation({
    args: {
        name: v.string(),
        price: v.number(),
        description: v.string(),
        category: v.string(),
        image: v.string(),
        status: v.string(),
        seo: v.object({
            title: v.string(),
            description: v.string(),
            slug: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.string(),
        price: v.number(),
        description: v.string(),
        category: v.string(),
        image: v.string(),
        status: v.string(),
        seo: v.object({
            title: v.string(),
            description: v.string(),
            slug: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
