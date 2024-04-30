import TagBrowserFactory from "@/lib/repositories/tags/TagsBrowserFactory"
import { TagFilterArray } from "@/lib/repositories/tags/TagsRepository"

export const itemsPerPage = 10

export async function fetchData(options: {
    pageIndex: number
    pageSize: number
    searchFilter: string
}) {
    const tagRepository = TagBrowserFactory.getInstance()
    const limit = options.pageSize;
    const offset = options.pageSize * options.pageIndex;
    let filter: TagFilterArray | undefined = undefined
    if (options.searchFilter) {
        filter= [];
        filter.push({
            column: "name",
            operator: "ilike",
            value: `%${options.searchFilter}%`
        })
    }
    const result = await tagRepository.getTags(
        filter,
        { column: 'name', options: { ascending: true } },
        { limit: limit, offset: offset},
        true,
    )
    const pageCount = result.itemsCount ? Math.ceil(result.itemsCount / itemsPerPage) : -1;
    return {
        rows: result.rows,
        pageCount
    }
}