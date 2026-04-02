import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReplyFormProps {
  onSubmit: (message: string) => Promise<void>;
  isSubmitting: boolean;
}

export function ReplyForm({ onSubmit, isSubmitting }: ReplyFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await onSubmit(message);
      setMessage("");
      toast.success("Reply sent successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reply",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        disabled={isSubmitting}
        className="resize-none font-inter-tight text-[13px]"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="bg-[#5C30FF] hover:bg-[#4a24d6] text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
