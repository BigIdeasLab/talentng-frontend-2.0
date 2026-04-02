import { formatDistanceToNow } from "date-fns";
import { User, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@/lib/api/support/types";

interface ConversationThreadProps {
  messages: ConversationMessage[];
}

export function ConversationThread({ messages }: ConversationThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-[13px] font-inter-tight text-[#525866]">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.isAdmin ? "flex-row" : "flex-row-reverse",
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              message.isAdmin
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600",
            )}
          >
            {message.isAdmin ? (
              <Headphones className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={cn(
              "flex-1 max-w-[80%]",
              message.isAdmin ? "text-left" : "text-right",
            )}
          >
            <div
              className={cn(
                "inline-block rounded-[12px] px-4 py-3",
                message.isAdmin
                  ? "bg-[#F5F5F5] text-black"
                  : "bg-[#5C30FF] text-white",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "text-[11px] font-medium font-inter-tight",
                    message.isAdmin ? "text-[#525866]" : "text-white/80",
                  )}
                >
                  {message.isAdmin ? "Support Team" : message.author.username}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-inter-tight",
                    message.isAdmin ? "text-[#525866]" : "text-white/60",
                  )}
                >
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p
                className={cn(
                  "text-[13px] font-inter-tight leading-relaxed whitespace-pre-wrap",
                  message.isAdmin ? "text-black" : "text-white",
                )}
              >
                {message.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
