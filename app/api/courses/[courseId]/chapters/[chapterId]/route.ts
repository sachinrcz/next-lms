import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}: {params: { courseId: string, chapterId: string}}
    ) {

        try{

            const {userId} = auth();
            if (!userId){
                return new NextResponse("Unauthorised", {status: 401});
            }

            const courseOwner = await db.course.findUnique({
                where: {
                    id: params.courseId, 
                    userId: userId

                }
            })

            if(!courseOwner){
                return new NextResponse("Unauthorised", {status: 401});
            }

            const {isPublished, ...values} = await req.json();

            const chapter = await db.chapter.update({
                where:{
                    id: params.chapterId,
                    courseId: params.courseId,
                },
                data:{
                    ...values,
                }
            })

            //TODO: handle video upload
            return NextResponse.json(chapter);


        }catch(error){
            console.log("[ChapterID]", error);
            return new NextResponse("Internal Error", {status: 500});
        }
    
}