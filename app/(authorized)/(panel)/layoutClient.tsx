'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase-browser"
import MoreIcon from "@/components/icons/MoreIcon";
import { ArrowBigRight, ArrowRight, ArrowRightSquare, ChevronRight, FlipHorizontal } from "lucide-react";


export default function PanelClient({ children }: { children: ReactNode }) {
    const activePath = usePathname();

    const [tags, setTags] = useState<any>([]); // Create state to store fetched tags

  // Fetch tags on component mount (or on other conditions using useEffect)
  useEffect(() => {
    const fetchTags = async () => {
      const supabaseClient = createClient()
      const { data, error } = await supabaseClient
        .from('tags') // Replace 'tags' with your actual table name
        .select('*');

      if (error) {
        console.error('Error fetching tags:', error);
      } else if (data) {
        setTags(data);
      }
    };

    // const fetchContacts = async () => {
    //     const supabaseClient = createClient();

    //     const { data,error } = await supabaseClient.from('contacts').select("*").eq("tag_id" , )
    // }

    fetchTags();
  }, []); 

    return (
        <div className="flex flex-row h-screen">
            <div className="flex-[6] border-e-2 border-e-slate-100 p-4">
                <div className="text-center">Receevi</div>
                <div className="mt-8">
                    <Link href="/chats"><Button variant={activePath?.startsWith('/chats')? "default" : "ghost"} className="w-full justify-start">Chats</Button></Link>
                    <Link href="/contacts"><Button variant={activePath?.startsWith('/contacts') ? "default" : "ghost"} className="w-full justify-start">Contacts</Button></Link>
                    <Link href="/tags"><Button variant={activePath?.startsWith('/tags') ? "default" : "ghost"} className="w-full justify-start">Tags</Button>
                        
                    </Link>

                    {(activePath?.startsWith('/tags') || activePath?.startsWith('/chats')) && (
                        <ul className="flex flex-col items-start pl-5 py-2 space-y-2 h-1/3 overflow-scroll" >
                            {
                                tags.map((tag: any) => (
                                    <li className="w-full justify-start" >
                                        <Link href={"/chats/?filter="+tag.id}>
                                            <Button variant={activePath?.startsWith('/chats/?filter='+tag.id) ? "default" : "ghost"} className=" w-full justify-between flex items-center space-x-1">
                                                    <div className="flex items-center space-x-1" >
                                                        <div style={{ backgroundColor : tag?.color }} className="h-5 w-5 rounded-full" />
                                                        <p>{ tag?.name } </p>
                                                    </div>
                                                    {/* <MoreIcon  className='text-panel-header-icon'  /> */}
                                                    <ChevronRight />
                                                </Button>
                                            </Link>

                                            <hr className="text-gray-300 w-3/4 mx-auto" />

                                    </li>
                                ))
                            }
                                {/* <li>
                                    <Link href="google" >
                                        <Button variant={activePath?.startsWith('/google') ? "default" : "ghost"} className="f w-full  lex items-center space-x-1">
                                            <div style={{ backgroundColor : 'blue' }} className="h-5 w-5 rounded-full" />
                                            <p>Zak</p>
                                        </Button>
                                    </Link>
                                </li>
                                <li>
                                <Link href="tags">
                                <Button variant={activePath?.startsWith('/google') ? "default" : "ghost"} className=" w-full  flex items-center space-x-1">
                                            <div style={{ backgroundColor : 'red' }} className="h-5 w-5 rounded-full" />
                                            <p>Zak</p>
                                        </Button>
                                    </Link>
                                </li> */}
                            </ul>

                    )}
                    <Link href="/bulk-send"><Button variant={activePath?.startsWith('/bulk-send') ? "default" : "ghost"} className="w-full justify-start">Bulk Send</Button></Link>
                    <Link href="/trash"><Button variant={activePath?.startsWith('/trash') ? "default" : "ghost"} className="w-full justify-start">Trash</Button></Link>
                </div>
            </div>
            <div className="flex-[20] p-4">
                {children}
            </div>
        </div>
    )
}
