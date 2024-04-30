import { createClient as createServerClient } from "@/utils/supabase-server";
import { TagRepository } from "./TagsRepository";
import { TagRepositorySupabaseImpl } from "./TagsRepositorySupabaseImpl";

export default class ContactServerFactory {
    private static _instance: TagRepository;
    public static getInstance(): TagRepository {
        if (!ContactServerFactory._instance) {
            const client = createServerClient();
            ContactServerFactory._instance = new TagRepositorySupabaseImpl(client)
        }
        return ContactServerFactory._instance
    }
}
