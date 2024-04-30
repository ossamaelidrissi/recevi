import { Tag } from "@/types/tag";
import { Database } from "@/lib/database.types";

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'cs'
  | 'cd'
  | 'sl'
  | 'sr'
  | 'nxl'
  | 'nxr'
  | 'adj'
  | 'ov'
  | 'fts'
  | 'plfts'
  | 'phfts'
  | 'wfts'

export type TagFromDB = Database['public']['Tables']['tags']['Row'];
export type TagColumnName = string & keyof TagFromDB;
export type TagFilterArray = Array<{ column: TagColumnName, operator: FilterOperator, value: unknown}>

export interface TagRepository {
    getTags(
        filters?: TagFilterArray,
        order?: {
            column: TagColumnName,
            options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: undefined }
        },
        paginationOptions?: { limit: number, offset: number},
        fetchCount?: boolean,
    ): Promise<{ rows: Tag[], itemsCount: number | null }>

    getTagsHavingTag(tags: string[]): Promise<TagFromDB[]>
}

