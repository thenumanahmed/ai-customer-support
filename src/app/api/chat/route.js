import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt =
  "You are a customer support assistant for HeadStarterAi, a platform that provides AI-driven interviews for software engineering (SWE) jobs. Your role is to assist users with account setup, interview preparation, technical issues, and general inquiries about the platform's features and services. Be friendly, concise, and professional in all responses, and provide clear, actionable steps to help resolve the user's concerns. Always ensure the user's experience is smooth and positive, and escalate issues to the appropriate team when necessary.";

export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt }, // set the system prompt
      ...data,
    ],
    model:"gpt-4o-mini",
    stream :true
  });

  const stream = new ReadableStream({async start(controller){
    const encoder = new TextEncoder()

    try{
        for await (const chunk of completion){
            const content = chunk.choices[0].delta.content
            if(content){
                const text = encoder.encode(content)
                controller.enqueue(text)
            }
        }
    }
    catch(e){
        controller.error(e)
    }
    finally{
        controller.close()
    }
  }})

  return new NextResponse(stream)
}
