import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useListNotifications, useMarkAllNotificationsRead } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: notifications = [] } = useListNotifications({
    query: { refetchInterval: 30000, queryKey: [] },
  });
  const markRead = useMarkAllNotificationsRead();

  const unread = (notifications as any[]).filter(n => !n.isRead).length;

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unread > 0) {
      await markRead.mutateAsync();
      qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center px-0.5 leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-bold text-foreground">Notifications</span>
          {(notifications as any[]).length > 0 && (
            <span className="text-xs text-muted-foreground">{(notifications as any[]).length} total</span>
          )}
        </div>

        {(notifications as any[]).length === 0 ? (
          <div className="py-10 text-center">
            <Bell className="w-8 h-8 mx-auto text-muted-foreground opacity-20 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ul className="max-h-[360px] overflow-y-auto divide-y divide-border/50">
            {(notifications as any[]).map((n: any) => (
              <li
                key={n.id}
                className={`px-4 py-3 transition-colors ${n.isRead ? "" : "bg-primary/5"}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? "bg-muted-foreground/20" : "bg-primary"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
