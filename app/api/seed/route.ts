import Stripe from "stripe";
import {headers} from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";


export async function GET(req: Request){
    try{
        await db.category.createMany({
            data: [
                {name: "Computer Science"},
                {name: "Music"},
                {name: "Fitness"},
                {name: "Photography"},
                {name: "Accounting"},
                {name: "Engineering"},
                {name: "Filming"},

            ]
        });
        return new NextResponse("Success", {status:200});

    }catch(error){
        console.log("Error seeding the database categories", error)
    }finally{
        await database.$disconnect();
    }

    return new NextResponse(null, {status:400});
}