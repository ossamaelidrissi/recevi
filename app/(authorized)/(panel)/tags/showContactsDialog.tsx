import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Form,
    FormControl, FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DBTables } from "@/lib/enums/Tables"
import { createClient } from "@/utils/supabase-browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactNode, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import BlankUser from "../chats/BlankUser"



const FormSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).min(3),
    color: z.string({
        required_error: "Color is required",
    }),
    contacts: z.array(z.object({
        value : z.string(),
        label : z.string()
    })).optional(),
})

export function ShowContactsDialog({ children, onSuccessfulAdd , tag }: { children: ReactNode, onSuccessfulAdd: () => void , tag : any }) {
    const [ loading , setLoading ] = useState(false);
    const [ isDialogOpen, setDialogOpen] = useState(false); 
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            color: "",
        }
    })

    const router = useRouter();

    const [ contactSelected,setContactsSelected ] = useState<any>();

     interface ColourOption {
        readonly value: string;
        readonly label: string;
        readonly color: string;
        readonly isFixed?: boolean;
        readonly isDisabled?: boolean;
      }

     const colourOptions: readonly ColourOption[] = [
        { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
        { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' },
      ];    
    
    async function onSubmit(dataa: z.infer<typeof FormSchema>) {
        if(loading) return;
        setLoading(true);
        const refreshingToast = toast.loading('Refreshing...');
        const supabaseClient = createClient()
        const { error } = await supabaseClient.from(DBTables.Tags).insert({ name: dataa.name, color: contactSelected?.color });

        if(error) {
            setLoading(false)
            if(error.code == '23505') {
                toast.error('Please Try Onother Name or onother color', {
                    id: refreshingToast
                })
            }
            throw error
        }

        // Query the database again to retrieve the inserted data
        // const { data: insertedData, error: queryError } = await supabaseClient
        // .from('tags')
        // .select('*')
        // .filter('name', 'eq', dataa.name)
        // .single();

        // if (queryError) {
        //     throw queryError;
        //   }

        // if (!insertedData) {
        //     throw new Error('Failed to retrieve inserted tag record.');
        // }

        // const contactTagRows = contactSelected?.map((contactId: any) => ({
        //     tag_id: insertedData?.id,
        //     contact_id: contactId.value
        // }));


        // console.log("🚀 ~ contactTagRows ~ contactTagRows:", contactTagRows[0].tag_id , insertedData.id);

        //   const { error: contactTagError } = await supabaseClient.from(DBTables.ContactTag).insert({ contact : contactTagRows[0].contact_id , tag : insertedData.tag_id });
        
          // Assuming 'id' is the primary key of the 'tags' table

        //   if (contactTagError) {
        //     throw contactTagError;
        //   }

        setLoading(true);

        toast.success('Tag added successfully', {
            id : refreshingToast
        });

        form.reset()
        setDialogOpen(false)
        onSuccessfulAdd()
    }

    useEffect(() => {
        async function getContactByTags(tag: any) {
            try {
                const supabaseClient = createClient();

                setContactsSelected([]);

                const { data: tag_id , error : error_  } = await supabaseClient.from('tags').select('id').eq('name', tag)
                
                const { data: contacts , error } = await supabaseClient.from('contacts').select('*').eq('tag_id' , tag_id[0]?.id)

                setContactsSelected(contacts);

                console.log("🚀 ~ getContactByTags ~ tag_id:",contactSelected )
                
            } catch (error: any) {
                console.log(error.message);
            }
        }

        getContactByTags(tag);
    },[])


    //   useEffect(() => {
    //     async function getContactsNotInTag(): Promise<{ value: string; label: string; color: string }[]> {
    //         try {
    
    //             const supabaseClient = createClient()
    
    //           // Query contacts that do not have an associated ID in contact_tag
    //           const { data: contacts, error } = await supabaseClient
    //             .from('contacts')
    //             .select('wa_id, profile_name')
    //             .not('wa_id', 'in', supabaseClient.from('contact_tag').select('contact_id').eq('contact_id', null));

    //           console.log("🚀 ~ getContactsNotInTag ~ contacts:", contacts)
          
    //           if (error) {
    //             throw error;
    //           }
          
    //           if (!contacts) {
    //             throw new Error('No contacts found.');
    //           }
          
    //           // Transform query result into colourOptions format
    //           // Transform query result into colourOptions format
    //            const newColourOptions = contacts.map((contact: any) => ({
    //             value: contact.wa_id,
    //             label: contact.name,
    //             color: 'getRandomColor()' // You can implement a function to generate random colors or use predefined colors
    //           }));
      
    //           setColourOptions(newColourOptions);
          
    //           return colourOptions;
    //         } catch (error: any) {
    //           if (error) {
    //             console.error('Postgrest error:', error.message, error.details);
    //           } else {
    //             console.error('Error getting contacts:', error.message);
    //           }
    //           return [];
    //         }
    //       }

    //       getContactsNotInTag();
    //   } , [])
      

    const colourStyles: StylesConfig<ColourOption, true> = {
        control: (styles) => ({ ...styles, backgroundColor: 'white' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          const color = chroma(data.color);
          return {
            ...styles,
            backgroundColor: isDisabled
              ? undefined
              : isSelected
              ? data.color
              : isFocused
              ? color.alpha(0.1).css()
              : undefined,
            color: isDisabled
              ? '#ccc'
              : isSelected
              ? chroma.contrast(color, 'white') > 2
                ? 'white'
                : 'black'
              : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',
      
            ':active': {
              ...styles[':active'],
              backgroundColor: !isDisabled
                ? isSelected
                  ? data.color
                  : color.alpha(0.3).css()
                : undefined,
            },
          };
        },
        multiValue: (styles, { data }) => {
          const color = chroma(data.color);
          return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
          };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: data.color,
          ':hover': {
            backgroundColor: data.color,
            color: 'white',
          },
        }),
      };
      

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Contacts ({contactSelected?.length})</DialogTitle>
                    <DialogDescription>
                        Enter color and name of the tag
                    </DialogDescription>
                </DialogHeader>
                {

                    <ul className="flex flex-col items-start w-full space-y-1 border-t">
                    
                        {
                            contactSelected?.map((contact: any) => (
                                <li onClick={() => router.push('/chat/'+contact.wa_id)} className="w-full items-center flex flex-row p-2 hover:bg-background-default-hover gap-4 cursor-pointer">
                                    <div>
                                        <BlankUser className="w-12 h-12" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-semibold" >{contact.wa_id} ({contact.profile_name})</span>
                                        {/* <span className= {`text-xs py-1 px-2 text-white rounded bg-opacity-5 `} style={{background: tag?.color}} >{tag?.name}</span> */}
                                        {/* TODO: Add some indication that this row is selected based on condition - contact.is_current */}
                                    </div>
                                </li>
                            ))
                        }
                    </ul>

                    // contacts.map((contact:any) => (
                    //     <>hello</>
                    // ))
                }
            </DialogContent>
        </Dialog>
    )
}
