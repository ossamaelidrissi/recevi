'use client'

import { useEffect, useState } from 'react'
import MoreIcon from '@/components/icons/MoreIcon'
import BlankUser from '../BlankUser'
import { UPDATE_CURRENT_CONTACT, useContacts, useCurrentContactDispatch } from '../CurrentContactContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'react-hot-toast'
import { createClient } from "@/utils/supabase-browser"
import { useRouter } from 'next/navigation'
import { AddTagDialog } from './addTagDialog'


export default function ChatHeader({ waId , contact }: { waId: string , contact : any }) {
    const [ loading , setLoading ] = useState<any>(0);
    const router = useRouter();
    const currentContact = useContacts()
    const dispatch = useCurrentContactDispatch();

    const [ chechTagging , setChechTagging  ] = useState(true);
    useEffect(() => {

        const supabaseClient = createClient()

        if (!currentContact?.current && dispatch) {
            dispatch({type: UPDATE_CURRENT_CONTACT, waId: Number.parseInt(waId)})
        }

        // const checkIsTaged = async () => {
        //     const { data: contactsWithTags, error } = await supabaseClient
        //     .from('contact_tag')
        //     .select(`contact`)
        //     .eq('contact' , waId)
        //     setChechTagging(contactsWithTags?.length > 0 ? 0 : 1);
        // //     console.log("🚀 ~ checkIsTaged ~ checkIsTaged:", contactsWithTags)
        // }

        // checkIsTaged();
        
        
    },[]);

    const [ isDialogOpen, setDialogOpen] = useState(false); 

    const MoveToTrash = async (contactId: any) => {
        if(loading) return;
        setLoading(true);

        const supabaseClient = createClient()

        const refreshingToast = toast.loading(  "Moving contact to trash...");

        const { error } = await supabaseClient
        .from('contacts')
        .update({ in_chat: false })
        .eq('wa_id', contactId);

        if (error) {
            setLoading(false);
            toast.error('Please try again', {
                id : refreshingToast
            });
            throw error;
          }

          router.push('/chats');

          toast.success('Contact moved to trash successfully.' , {
            id : refreshingToast
          });

      
          console.log('Contact moved to trash successfully.');

          location.reload();


    }

    const CopyNumberPhone = (phoneNumber: any) => {
        navigator.clipboard.writeText(phoneNumber);

        toast.success('Phone Number copied successfully')
    };
    return (
        <div className="bg-panel-header-background">
            <Toaster position='top-center' />
            <header className="px-4 py-2 flex flex-row gap-4 items-center">
                <BlankUser className="w-10 h-10" />
                <div className='text-primary-strong flex-grow'>
                    {contact[0].profile_name}
                </div>
                {
                    contact[0].tag_id == null ?
                        <AddTagDialog waId = {waId} setDialogOpen = {setDialogOpen} isDialogOpen={isDialogOpen} onSuccessfulAdd={() => {}}>
                            <Button className="ml-auto">Add tag</Button>
                        </AddTagDialog>   
                        : <></>
                }
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled = {loading} variant="ghost" className="h-8 w-8 p-0">
                            <MoreIcon  className='text-panel-header-icon'  />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => MoveToTrash(contact[0]?.wa_id)}>Move to trash</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => CopyNumberPhone(contact[0]?.wa_id)}>Copy Phone Number</DropdownMenuItem>
                        {/* <DropdownMenuItem className="cursor-pointer" onClick={() => MoveToTrash()}>Move to Trash</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        </div>
    )
}
