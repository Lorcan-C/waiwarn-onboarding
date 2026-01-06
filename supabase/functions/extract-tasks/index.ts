import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExtractedTask {
  title: string;
  description?: string;
  suggestedAssignee?: string;
  suggestedDueDate?: string;
  confidence: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId, meetingTitle, meetingDate, attendees, notesContent } = await req.json();

    if (!notesContent) {
      return new Response(
        JSON.stringify({ error: "Notes content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert at extracting action items and tasks from meeting notes.

Your job is to analyze meeting notes and identify actionable tasks. Look for:
1. Explicit action items marked with "Action:", "TODO:", "- [ ]", "Action Item:", etc.
2. Sentences with action verbs indicating someone will do something (e.g., "Bob will prepare...", "Alice needs to...")
3. Deadlines or due dates mentioned (e.g., "by Friday", "due next week", "EOD Wednesday")
4. Follow-up items or commitments made during the meeting

For each task, determine:
- A clear, actionable title (start with a verb)
- Optional description with additional context
- The suggested assignee (if mentioned by name)
- The suggested due date (if mentioned, format as relative date like "EOD Wednesday" or specific date)
- Confidence score (0-1) based on how clearly the task was stated

Meeting context:
- Meeting Title: ${meetingTitle || "Meeting"}
- Meeting Date: ${meetingDate || "Unknown"}
- Attendees: ${attendees?.join(", ") || "Unknown"}

Be conservative - only extract items that are clearly actionable tasks. Do not create tasks from general discussion points or information sharing.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract action items from these meeting notes:\n\n${notesContent}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_tasks",
              description: "Extract action items and tasks from meeting notes",
              parameters: {
                type: "object",
                properties: {
                  tasks: {
                    type: "array",
                    description: "List of extracted tasks",
                    items: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description: "Clear, actionable task title starting with a verb",
                        },
                        description: {
                          type: "string",
                          description: "Additional context or details about the task",
                        },
                        suggestedAssignee: {
                          type: "string",
                          description: "Name of the person assigned to this task",
                        },
                        suggestedDueDate: {
                          type: "string",
                          description: "Due date mentioned for this task",
                        },
                        confidence: {
                          type: "number",
                          description: "Confidence score from 0 to 1 indicating how clearly this was stated as a task",
                        },
                      },
                      required: ["title", "confidence"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["tasks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_tasks" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to process notes with AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    let extractedTasks: ExtractedTask[] = [];

    // Parse the tool call response
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const functionArgs = toolCalls[0].function?.arguments;
      if (functionArgs) {
        try {
          const parsed = JSON.parse(functionArgs);
          extractedTasks = parsed.tasks || [];
        } catch (parseError) {
          console.error("Failed to parse function arguments:", parseError);
        }
      }
    }

    // Generate unique IDs for each task
    const tasksWithIds = extractedTasks.map((task, index) => ({
      ...task,
      id: `extracted-${meetingId}-${index}-${Date.now()}`,
    }));

    console.log(`Extracted ${tasksWithIds.length} tasks from meeting notes`);

    return new Response(
      JSON.stringify({ 
        extractedTasks: tasksWithIds,
        meetingId,
        meetingTitle,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in extract-tasks function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
