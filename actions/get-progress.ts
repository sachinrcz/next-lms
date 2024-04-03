import { db } from "@/lib/db";
import { validateHeaderName } from "http";

export const getProgress = async (
    userId: string,
    courseId: string
): Promise<number> => {
    try{

        const publishedChapter = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select:{
                id: true,
            }
        });

        const publishedChapterId = publishedChapter.map((chapter)=> chapter.id);
        const validCompltedChapter = await db.userProgress.count({
            where:{
                userId: userId,
                chapterId: {
                    in: publishedChapterId,
                },
                isCompleted: true,
            }
        });

        const progressPercentage = (validCompltedChapter/publishedChapterId.length)*100;
        return progressPercentage;

    }catch(error){
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}