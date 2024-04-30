"use client"

import { Tag } from "@/types/tag"
import {
    ColumnDef, getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, PaginationState, SortingState, useReactTable, VisibilityState
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { AddTagDialog } from "./addTagDialog"
import { ShowContactsDialog } from "./showContactsDialog"
import { fetchData, itemsPerPage } from "./fetchData"
import { Input } from "@/components/ui/input"
import Loading from "../../../loading"
import { TagsTable } from "./TagsTable"
import { createClient } from "@/utils/supabase-browser"
import {useRouter}  from "next/navigation"
import { toast, Toaster } from "react-hot-toast"


export default function Tags() {
    
    const router = useRouter();

    const [ loading, setLoading ] = useState(false);


    async function deleteTag(tagId: number): Promise<void> {

        if(loading) return;

        const refreshingToast = toast.loading('Refreshing ...')

        setLoading(true);

        const supabaseClient = createClient()

        try {
          // Delete the tag from the 'tags' table
          const { error } = await supabaseClient
            .from('tags')
            .delete()
            .eq('name', tagId);
      
          if (error) {
              setLoading(false);
              toast.error('You cannot delete this tag , because some contacts use it !' , {
                id : refreshingToast
              })
            throw error;
          }

          
          setLoading(false);
          toast.success('The tag deleted successfuly ! ' , {
            id : refreshingToast
          })
          console.log('Tag deleted successfully.');

          location.reload();
        
        } catch (error: any) {

            setLoading(false);

            toast.error('You cannot delete this tag , because some contacts use it ! ' , {
                id : refreshingToast
              })

          if (error) {
            
            console.error('Postgrest error:', error.message, error.details);
          } else {
            console.error('Error deleting tag:', error.message);
          }
        }
    }

    async function showContacts() {

    }

    const columns = useMemo<ColumnDef<Tag>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "color",
                header: "Color",
                cell: ({ row }) => (
                    <div className="rounded h-6 w-7" style={{ backgroundColor : row?.getValue("color") }} ></div>
                ),
            },
            {
                accessorKey: "name",
                header: 'Name',
                cell: ({ row }) => <div>{row.getValue("name")}</div>,
            },
            // {
            //     accessorKey: "profile_name",
            //     header: 'Contacts',
            //     cell: ({ row }) => <div>7</div>,
            // },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center space-x-3 flex-end justify-end" >
                            <ShowContactsDialog tag = {row.getValue('name')} onSuccessfulAdd={dataQuery.refetch}>
                                <Button onClick={() => showContacts()} className="text-sm bg-blue-500" >Show Contacts </Button>
                            </ShowContactsDialog>
                            <Button className="bg-red-500" onClick={() => deleteTag(row.getValue("name"))} >Delete</Button>
                        </div> 
                    )
                },
            },
        ],
        []
    );

    const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: itemsPerPage,
    })
    const [ searchFilter, setSearchFilter ] = useState("")

    const fetchDataOptions = {
        pageIndex,
        pageSize,
        searchFilter
    }

    const dataQuery = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: () => fetchData(fetchDataOptions),
        placeholderData: keepPreviousData
    });


    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const defaultData = React.useMemo(() => [], [])


    const table = useReactTable<Tag>({
        data: dataQuery.data?.rows ?? defaultData,
        columns,
        manualPagination: true,
        pageCount: dataQuery.data?.pageCount ?? -1,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

  return (
    <div className="w-full">
        <Toaster
            position="top-center"
            reverseOrder={false}
         />
        <div className="flex items-center py-4">
                <Input
                    placeholder="Search tag..."
                    value={searchFilter}
                    onChange={(event: any) => setSearchFilter(event.target.value) }
                    className="max-w-sm"
                />
                
                <AddTagDialog onSuccessfulAdd={dataQuery.refetch}  >
                    <Button className="ml-auto">Add Tag</Button>
                </AddTagDialog>
            </div>
            <div className="rounded-md border relative">
                {dataQuery.isLoading && <div className="absolute block w-full h-full bg-gray-500 opacity-30">
                    <Loading />
                </div>}
                <TagsTable table={table} totalColumns={columns.length} />
            </div>
    </div>
  )
}
