"use client";

import { useRef, useState, useTransition } from "react";
import { Paperclip, Send } from "lucide-react";
import { sendMessageAction } from "@/app/actions";
import { timeAgo } from "@/lib/utils";
import type { Message, Profile } from "@/db/schema";

export function ChatClient({
  conversationId,
  meId,
  other,
  initial,
}: {
  conversationId: string;
  meId: string;
  other: Profile;
  initial: Message[];
}) {
  const [pending, start] = useTransition();
  const [text, setText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col lg:h-[calc(100dvh-6rem)]">
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {initial.map((m) => {
          const mine = m.senderId === meId;
          return (
            <div key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                  mine ? "rounded-br-md bg-forest text-white" : "rounded-bl-md bg-white shadow-card"
                }`}
              >
                <p>{m.content}</p>
                {m.fileName ? (
                  <p className={mine ? "mt-1 text-xs text-white/80" : "mt-1 text-xs text-mute"}>
                    📎 {m.fileName}
                  </p>
                ) : null}
                <p className={mine ? "mt-1 text-[10px] text-white/60" : "mt-1 text-[10px] text-mute"}>
                  {timeAgo(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        ref={formRef}
        className="flex items-end gap-2"
        action={(fd) => {
          start(async () => {
            await sendMessageAction(fd);
            setText("");
            formRef.current?.reset();
          });
        }}
      >
        <input type="hidden" name="conversationId" value={conversationId} />
        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-mute shadow-card"
          onClick={() => {
            const fd = new FormData();
            fd.set("conversationId", conversationId);
            fd.set("content", "Te envío los planos.");
            fd.set("fileName", "planos.dwg");
            start(async () => {
              await sendMessageAction(fd);
            });
          }}
          aria-label="Adjuntar"
        >
          <Paperclip size={18} />
        </button>
        <textarea
          name="content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder={`Mensaje para ${other.firstName}...`}
          className="input max-h-28 min-h-12 flex-1 resize-none"
        />
        <button
          className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf text-white"
          disabled={pending}
          aria-label="Enviar"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
