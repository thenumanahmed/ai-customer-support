import { NextResponse } from "next/server";

const systemPrompt =
  "You are a customer support assistant for HeadStarterAi, a platform that provides AI-driven interviews for software engineering (SWE) jobs. Your role is to assist users with account setup, interview preparation, technical issues, and general inquiries about the platform's features and services. Be friendly, concise, and professional in all responses, and provide clear, actionable steps to help resolve the user's concerns. Always ensure the user's experience is smooth and positive, and escalate issues to the appropriate team when necessary.";

export async function POST(req) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  // const YOUR_SITE_URL = process.env.YOUR_SITE_URL; // Optional
  // const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME; // Optional

  const data = await req.json();

  // Make the request to OpenRouter API
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      // "HTTP-Referer": YOUR_SITE_URL, // Optional
      // "X-Title": YOUR_SITE_NAME, // Optional
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sao10k/l3.1-euryale-70b", // Specify the model
      messages: [
        { role: "system", content: systemPrompt }, // Add the system prompt
        ...data,
      ],
    }),
  });

  // Check for errors
  if (!response.ok) {
    return new NextResponse("Failed to fetch from OpenRouter API", { status: response.status });
  }

  // Parse JSON response
  const jsonResponse = await response.json();

  // Extract content from the response
  const content = jsonResponse.choices[0].message.content;

  return NextResponse.json({ content });
}
