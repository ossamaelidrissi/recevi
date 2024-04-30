import { DBTables } from "@/lib/enums/Tables";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { TagFromDB, TagRepository , TagFilterArray , TagColumnName } from "./TagsRepository";
import { Tag } from "@/types/tag";

type SupabaseClientType = ReturnType<typeof createBrowserClient>

export class TagRepositorySupabaseImpl implements TagRepository {
    private client;
    constructor(client: SupabaseClientType) {
        this.client = client;
    }
    async getTags(
        filters?: TagFilterArray,
        order?: {
            column: TagColumnName,
            options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: undefined }
        },
        paginationOptions?: { limit: number, offset: number },
        fetchCount?: boolean,
    ): Promise<{ rows: Tag[], itemsCount: number | null }> {
        let selectOptions = {}
        if (fetchCount) {
            selectOptions = { count: 'exact' }
        }
        let query = this.client
            .from(DBTables.Tags)
            .select('*', selectOptions)
        if (filters) {
            for (const filter of filters) {
                query = query.filter(filter.column, filter.operator, filter.value)
            }
        }
        if (order) {
            query = query.order(order.column, order.options)
        }
        if (paginationOptions) {
            const from = paginationOptions.offset
            const to = from + paginationOptions.limit - 1
            query.range(from, to)
        }
        const result = await query
        if (result.error) throw result.error
        return {
            rows: result.data,
            itemsCount: result.count,
        }
    }

    async getTagsHavingTag(tags: string[]): Promise<TagFromDB[]> {
        const { data, error } = await this.client
            .from('tags')
            .select('*')
            .overlaps('tags', tags)
        if (error) throw error
        return data
    }
}