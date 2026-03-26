"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Conversation, ChatMessage } from "@/types";
import { chatService } from "@/services/extendedServices";
import { useAuth } from "@/lib/authContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { MessageCircle, Send, ChevronLeft, Loader2, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";

// ─── Wrapper com Suspense (obrigatório para useSearchParams no Next.js 14) ────
export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    }>
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  const params = useSearchParams();
  const conversationId = params.get("id");

  if (conversationId) return <ChatRoom conversationId={conversationId} />;
  return <ConversationList />;
}

// ─── Conversations List ───────────────────────────────────────────────────────
function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService.getConversations()
      .then(setConversations)
      .catch(() => toast.error("Erro ao carregar conversas"))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-dvh pb-24 page-enter">
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-dark-50">Mensagens</h1>
            <p className="text-xs text-dark-400 font-body">
              {conversations.reduce((a, c) => a + c.unreadCount, 0)} não lidas
            </p>
          </div>
        </div>
      </div>

      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-dark-300 font-body font-medium">Nenhuma conversa ainda</p>
            <p className="text-dark-500 text-sm font-body mt-1">Inicie uma conversa com um profissional</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv, i) => {
              const other = conv.provider || conv.client;
              const hasUnread = conv.unreadCount > 0;
              return (
                <Link
                  key={conv.id}
                  href={`/chat?id=${conv.id}`}
                  className="card-hover p-4 flex items-center gap-3 block"
                  style={{ animation: `fadeUp 0.35s ${i * 0.07}s ease both` }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-xl font-display font-bold text-orange-400 flex-shrink-0">
                      {other?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{conv.unreadCount}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={clsx("text-sm font-body", hasUnread ? "font-semibold text-dark-50" : "font-medium text-dark-200")}>
                        {other?.name}
                      </p>
                      <p className="text-[10px] text-dark-600 font-body flex-shrink-0 ml-2">
                        {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ""}
                      </p>
                    </div>
                    <p className={clsx("text-xs mt-0.5 truncate font-body", hasUnread ? "text-dark-300" : "text-dark-500")}>
                      {conv.lastMessage?.senderId !== "client1" && "↩ "}
                      {conv.lastMessage?.content ?? "Iniciar conversa"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

// ─── Chat Room ────────────────────────────────────────────────────────────────
function ChatRoom({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find(c => c.id === conversationId);
  const other = conv?.provider || conv?.client;

  useEffect(() => {
    Promise.all([
      chatService.getMessages(conversationId),
      chatService.getConversations(),
      chatService.markAsRead(conversationId),
    ]).then(([msgs, convs]) => {
      setMessages(msgs);
      setConversations(convs);
    }).catch(() => toast.error("Erro ao carregar mensagens"))
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const optimistic: ChatMessage = {
      id: `temp_${Date.now()}`, conversationId, senderId: user?.id || "client1",
      senderRole: user?.role || "client", content: text, type: "text", read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setText("");
    try {
      const sent = await chatService.sendMessage(conversationId, text);
      setMessages(prev => prev.map(m => m.id === optimistic.id ? sent : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      toast.error("Erro ao enviar mensagem");
    } finally { setSending(false); }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const isMe = (msg: ChatMessage) => msg.senderId === (user?.id || "client1");

  const groupedMsgs: { date: string; messages: ChatMessage[] }[] = [];
  messages.forEach(msg => {
    const date = new Date(msg.createdAt).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    const last = groupedMsgs[groupedMsgs.length - 1];
    if (last?.date === date) last.messages.push(msg);
    else groupedMsgs.push({ date, messages: [msg] });
  });

  return (
    <div className="min-h-dvh flex flex-col page-enter">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1a1210]/95 backdrop-blur-xl border-b border-orange-900/10 px-4 py-3 pt-12 flex items-center gap-3">
        <Link href="/chat" className="w-9 h-9 rounded-xl bg-orange-500/8 flex items-center justify-center text-dark-400 hover:text-dark-200 flex-shrink-0">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-lg font-display font-bold text-orange-400 flex-shrink-0">
          {other?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-dark-50 font-body truncate">{other?.name ?? "Carregando..."}</p>
          <p className="text-xs text-emerald-400 font-body">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          </div>
        ) : (
          groupedMsgs.map(group => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-3">
                <span className="text-[10px] text-dark-600 font-body bg-[#261914] px-3 py-1 rounded-full capitalize">{group.date}</span>
              </div>
              <div className="space-y-2">
                {group.messages.map(msg => {
                  const mine = isMe(msg);
                  return (
                    <div key={msg.id} className={clsx("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={clsx(
                        "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed",
                        mine
                          ? "bg-orange-500 text-white rounded-br-md"
                          : "bg-[#2d1f1a] text-dark-100 border border-orange-900/20 rounded-bl-md"
                      )}>
                        <p>{msg.content}</p>
                        <div className={clsx("flex items-center gap-1 mt-1", mine ? "justify-end" : "justify-start")}>
                          <span className={clsx("text-[10px]", mine ? "text-white/60" : "text-dark-600")}>
                            {formatTime(msg.createdAt)}
                          </span>
                          {mine && (msg.read
                            ? <CheckCheck className="w-3 h-3 text-white/60" />
                            : <Check className="w-3 h-3 text-white/50" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-orange-900/15 bg-[#1a1210]/95 backdrop-blur-xl px-4 py-3 pb-8">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Escreva uma mensagem..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-11 h-11 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}