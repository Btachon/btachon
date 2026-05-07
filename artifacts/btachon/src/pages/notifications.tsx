import { useEffect } from "react";
import { Bell, Users, BookOpen, Heart, CheckCheck } from "lucide-react";
import { useListNotifications, useMarkAllNotificationsRead, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByDay(items: any[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: any[] }[] = [];
  const buckets: Record<string, any[]> = {};

  for (const n of items) {
    const d = new Date(n.createdAt);
    d.setHours(0, 0, 0, 0);
    let key: string;
    if (d >= today) key = "Today";
    else if (d >= yesterday) key = "Yesterday";
    else key = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    if (!buckets[key]) { buckets[key] = []; groups.push({ label: key, items: buckets[key] }); }
    buckets[key].push(n);
  }
  return groups;
}

function typeIcon(type: string) {
  if (type === "chavrusa_request" || type === "friend_request") return <Users className="w-4 h-4" />;
  if (type === "tutor_contact") return <BookOpen className="w-4 h-4" />;
  if (type === "tehillim") return <Heart className="w-4 h-4" />;
  return <Bell className="w-4 h-4" />;
}

function typeColor(type: string) {
  if (type === "chavrusa_request" || type === "friend_request") return "bg-blue-500/10 text-blue-400";
  if (type === "tutor_contact") return "bg-amber-500/10 text-amber-400";
  if (type === "tehillim") return "bg-rose-500/10 text-rose-400";
  return "bg-primary/10 text-primary";
}

export default function Notifications() {
  const qc = useQueryClient();
  const { data: notifications = [], isLoading } = useListNotifications({
    query: { queryKey: [] },
  });
  const markRead = useMarkAllNotificationsRead();

  const list = notifications as any[];
  const unread = list.filter(n => !n.isRead).length;

  useEffect(() => {
    if (unread > 0) {
      markRead.mutateAsync().then(() => {
        qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      });
    }
  }, []);

  const groups = groupByDay(list);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {list.length === 0 ? "All clear" : `${list.length} notification${list.length !== 1 ? "s" : ""}`}
            {unread > 0 && ` · ${unread} unread`}
          </p>
        </div>
        {unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-2"
            onClick={async () => {
              await markRead.mutateAsync();
              qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
            }}
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No notifications yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            When someone contacts you, sends a challenge, or requests Tehillim, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.items.map((n: any) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      n.isRead
                        ? "bg-card border-border/50"
                        : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeColor(n.type)}`}>
                      {typeIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-snug ${n.isRead ? "text-foreground" : "text-foreground"}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                      )}
                      {n.fromName && (
                        <p className="text-xs text-muted-foreground/70 mt-1">From {n.fromName}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground/50 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
