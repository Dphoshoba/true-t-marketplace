
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("projects").collect();
    },
});

export const add = mutation({
    args: {
        title: v.string(),
        client: v.string(),
        category: v.string(),
        year: v.string(),
        description: v.string(),
        image: v.string(),
        challenge: v.string(),
        outcome: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("projects", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("projects"),
        title: v.string(),
        client: v.string(),
        category: v.string(),
        year: v.string(),
        description: v.string(),
        image: v.string(),
        challenge: v.string(),
        outcome: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
