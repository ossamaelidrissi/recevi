'use client'

import { useEffect, useState } from "react";
import ChatContactsClient from "./ChatContactsClient";
import { useContacts } from "./CurrentContactContext";
import { createClient } from "@/utils/supabase-browser"
import { useSearchParams } from 'next/navigation'


export const revalidate = 0

export default function ChatContacts() {
    const contactState = useContacts();


    const searchParams = useSearchParams()

    
    const [ data , setData ] = useState<any>();

    useEffect(() => {
        async function ContactUIfetchContactsWithTags() {

            
            const supabaseClient = createClient()


            const search = searchParams?.get('filter')
            console.log("🚀 ~ ContactUIfetchContactsWithTags ~ search:", search)
      
            if(search) {

              try {
  
                const { data : contactsWithTags, error } = await supabaseClient
                  .from('contacts')
                  .select(`* , tags (name , color)`)
                  .eq('tag_id', search)
                if (error) {
                  throw error;
                }
  
                setData(contactsWithTags);
            
                return contactsWithTags;
                
              } catch (error: any) {
                throw error;
              }
            } else { 

              try {
  
                const { data: contactsWithTags, error } = await supabaseClient
                  .from('contacts')
                  .select(`* , tags (name , color)`)
                if (error) {
                  throw error;
                }
  
                setData(contactsWithTags);
            
                return contactsWithTags;
              } catch (error: any) {
                throw error;
              }
            }

          }

          ContactUIfetchContactsWithTags()
    },[data])
    if (data) {
        return (
            <div className="flex flex-col">
                <ChatContactsClient contacts={data} />
            </div>
        )
    } else {
        return (
            <div>
                Unable to fetch contacts
            </div>
        )
    }
}
