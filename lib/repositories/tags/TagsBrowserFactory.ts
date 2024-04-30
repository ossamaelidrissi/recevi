import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { TagRepositorySupabaseImpl } from "./TagsRepositorySupabaseImpl";
import { TagRepository } from "./TagsRepository";

export default class TagBrowserFactory {
    private static _instance: TagRepository;
    public static getInstance(): TagRepository {
        if (!TagBrowserFactory._instance) {
            const client = createBrowserClient();
            TagBrowserFactory._instance = new TagRepositorySupabaseImpl(client)
        }
        return TagBrowserFactory._instance
    }
}
