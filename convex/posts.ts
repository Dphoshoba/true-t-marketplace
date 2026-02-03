
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("posts").collect();
    },
});

export const add = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("posts", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("posts"),
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
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
