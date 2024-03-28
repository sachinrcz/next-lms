import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request, 
    {params}: { params: {courseId : string}}
) {
    try{

        const {userId} = auth();

        if (!userId){
            return new NextResponse("Unauthorised", {status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course){
            return new NextResponse("Unauthorised", {status: 401});
        }

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
        if (!hasPublishedChapter){
            return new NextResponse("Atleast one published chapter is required", {status: 401});
        }

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId){
            return new NextResponse("Missing Required Fields", {status: 401});
        }

        const publishedCourse = await db.course.update({
            where:{
                id: params.courseId,
                userId,
            },
            data:{
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);

    }catch(error){
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", {status: 500});
    }

    
}