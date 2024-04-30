import ContactBrowserFactory from "@/lib/repositories/contacts/ContactBrowserFactory"
import { ContactFilterArray } from "@/lib/repositories/contacts/ContactRepository"

export const itemsPerPage = 10

export async function fetchData(options: {
    pageIndex: number
    pageSize: number
    searchFilter: string
}) {
    const contactRepository = ContactBrowserFactory.getInstance()
    const limit = options.pageSize;
    const offset = options.pageSize * options.pageIndex;
    let filter: ContactFilterArray | undefined = undefined
    if (options.searchFilter) {
        filter= [];
        filter.push({
            column: "profile_name",
            operator: "ilike",
            value: `%${options.searchFilter}%`
        })
    }

    
    const result = await contactRepository.getContacts(
        filter,
        { column: 'profile_name', options: { ascending: true } },
        { limit: limit, offset: offset},
        true,
    )


    const filteredRows = result.rows.filter((row: any) => !row.in_chat);

    const res = {
        rows : filteredRows,
        itemsCount: filteredRows.length
    }

    const pageCount = res.itemsCount ? Math.ceil(res.itemsCount / itemsPerPage) : -1;
    return {
        rows: res.rows,
        pageCount
    }
}