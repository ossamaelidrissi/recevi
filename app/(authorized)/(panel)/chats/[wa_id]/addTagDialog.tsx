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




export function AddTagDialog({ waId , children, onSuccessfulAdd , setDialogOpen , isDialogOpen}: { waId : any , children: ReactNode, onSuccessfulAdd: () => void ,setDialogOpen : any ,isDialogOpen : any}) {
    const [ loading , setLoading ] = useState(false);
    const router = useRouter();
    const [tags , setTags] = useState([])
    const form = useForm({
        
        defaultValues: {
            name: "",
            
        }
    })

    const [colourOptions, setColourOptions] = useState<any>([]);

    const [ colorSelected , setColorSelected ] = useState('');


     interface ColourOption {
        readonly value: string;
        readonly label: string;
        readonly color: string;
        readonly isFixed?: boolean;
        readonly isDisabled?: boolean;
      }
  
    
    async function onSubmit(data: any) {
        if(loading) return;
        setLoading(true);
        const refreshingToast = toast.loading('Refreshing...');
        const supabaseClient = createClient()
        const { error } = await supabaseClient.from(DBTables.ContactTag).insert({ contact: waId, tag: colorSelected });
        const { error_ } = await supabaseClient.from(DBTables.Contacts).update({ tag_id : colorSelected }).eq('wa_id' , waId)

        if(error || error_) {
            setLoading(false)
            if(error.code == '23505') {
                toast.error('Please Try Onother Name or onother color', {
                    id: refreshingToast
                })
            }
            throw error
        }

        setLoading(true);

        toast.success('Tag added successfully', {
            id : refreshingToast
        });

        form.reset()

        location.reload();
        setDialogOpen(false)
        // onSuccessfulAdd()
    }


  useEffect(() => {
    async function fetchTags() {
      
      const supabaseClient = createClient()

      try {

        const { data, error } = await supabaseClient
          .from('tags') // Replace 'tags' with your actual table name
          .select('*'); // Select all columns, you can specify columns if needed

        if (error) {
          throw error;
        }

        let newColourOptions = data.map((tag: any) => ({
            value: tag.id, // Assuming 'id' is the unique identifier for each tag
            label: tag.name, // Assuming 'name' is the name of the tag
            color: tag.color, // Assuming 'color' is the color associated with the tag
        }));
        
        setColourOptions(newColourOptions);
                  
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching tags:', error.message);
      }
    }

    fetchTags();
  }, [colourOptions]);
      

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
                    <DialogTitle>Add Tag</DialogTitle>
                    <DialogDescription>
                        Enter color and name of the tag
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Select Tag</FormLabel>
                                    <FormControl>
                                        <Select
                                            defaultValue={colourOptions[2]}
                                            options={colourOptions}
                                            styles={colourStyles}
                                            onChange={(e: any) => setColorSelected(e.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                       
                       
                        <DialogFooter>
                            <Button disabled={loading} className="disabled:bg-gray-600 disabled:text-gray-700" type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
