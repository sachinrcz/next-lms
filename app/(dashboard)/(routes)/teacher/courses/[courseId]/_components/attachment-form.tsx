"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Course & {attachment: Attachment[]};
    courseId: string;
}

const formSchema= z.object({
    url: z.string().min(1),
})

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course updated")
            toggleEdit();
            router.refresh();
        }catch{
            toast.error("Something went wrong")
        }
    }

    const toggleEdit = () => setIsEditing((current)=> !current);

    const onDelete = async (id: string) => {
        try{
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted");
            router.refresh();

        }catch{
            toast.error("Something went wrong")
        }finally{
            setDeletingId(null);
        }
    }


    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && (
                        <>Cancel</>
                    )} 

                    {!isEditing && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file  
                        </>
                    )}


                </Button>
            </div>
            {!isEditing  && (
                <>
                    {initialData.attachment.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No Attachments yet
                        </p>
                    )}
                    {initialData.attachment.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachment.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                    <p className="text-xs line-clamp-1">
                                        {file.name}
                                    </p>
                                    {deletingId === file.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                        </div>
                                    )}
                                    {deletingId !== file.id && (
                                        <Button 
                                            onClick={()=> onDelete(file.id)}
                                            className="ml-auto hover:opacity-75 transition"
                                            variant="ghost"
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )
            
            
            }
            {isEditing && (
                    <div>
                        <FileUpload 
                            endpoint="courseAttachment"
                            onChange={(url) => {
                                console.log(url);
                                if(url){
                                    onSubmit({url: url});
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Add anything that your student might need to complete the course
                        </div>
                    </div>
            )}
        </div>
     );
}