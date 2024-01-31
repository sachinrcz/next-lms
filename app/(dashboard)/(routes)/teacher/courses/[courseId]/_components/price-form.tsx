"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage

} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import { formatprice } from "@/lib/format";

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema= z.object({
    price: z.coerce.number(),
})

export const PriceForm = ({
    initialData,
    courseId
}: PriceFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
           price: initialData?.price || undefined,
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated")
            toggleEdit();
            router.refresh();
        }catch{
            toast.error("Something went wrong")
        }
    }

    const toggleEdit = () => setIsEditing((current)=> !current);


    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Price
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                            Edit Price  
                        </>
                    )}
                </Button>
            </div>
            {isEditing ? (
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField 
                                control={form.control}
                                name="price"
                                render ={({field}) => (
                                    <FormItem>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="Set a price for your course"
                                            type="number"
                                            step="0.01"
                                            {...field}
                                        />
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button 
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                >
                                    Save
                                </Button>

                            </div>

                        </form>

                    </Form>


            ): (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                    { initialData.price? formatprice(initialData.price) :  "No Price"}
                </p>
            )}
        </div>
     );
}