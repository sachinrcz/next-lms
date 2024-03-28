"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionProps) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const confetti = useConfettiStore();


    const onClick = async () => {
        try{
            setIsLoading(true);
            if (isPublished){
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course Unpublished");
            }else{
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published");
                confetti.onOpen();
            }
            router.refresh()

        }catch{
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false);
        }

    }

    const onDelete = async () => {
        try{
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course Deleted");
            router.push(`/teacher/courses`);
            router.refresh();

        }catch{
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false)
        }
    }


    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}