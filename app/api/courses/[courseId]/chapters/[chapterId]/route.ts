import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node'

const {video} = new Mux(
    {
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET
    }
);

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

            if(values.videoUrl){
                const existingMuxData = await db.muxData.findFirst({
                    where: {
                        chapterId: params.chapterId,
                    }
                });
                if (existingMuxData){
                    await video.assets.delete(existingMuxData.assetId);
                    await db.muxData.delete({
                        where:{
                            id: existingMuxData.id,
                        }
                    });
                }

            }
            return NextResponse.json(chapter);


        }catch(error){
            console.log("[ChapterID]", error);
            return new NextResponse("Internal Error", {status: 500});
        }
    
}