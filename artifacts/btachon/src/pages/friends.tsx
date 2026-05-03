import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, UserPlus, Copy, Share2, Check, X, Mail, Link } from "lucide-react";
import { useGetFriends, useAddFriendByCode, useRemoveFriend } from "@workspace/api-client-react";

function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setProfile(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return { profile, loading };
}

export default function Friends() {
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { profile } = useProfile();
  const { data: friends = [], isLoading, refetch } = useGetFriends();
  const addFriend = useAddFriendByCode();
  const removeFriend = useRemoveFriend();

  const handleCopyCode = () => {
    if (!profile?.shareCode) return;
    navigator.clipboard.writeText(profile.shareCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}?invite=${profile?.shareCode}`;
    if (navigator.share) {
      navigator.share({ title: "Join me on Btachon", text: "I'm on Btachon — a Jewish personal growth app. Use my code to add me!", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Invite link copied!");
    }
  };

  const handleShareApp = () => {
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({ title: "Btachon – Jewish Personal Growth", text: "Check out Btachon — a beautiful app for Jewish growth, learning, and accountability.", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("App link copied!");
    }
  };

  const handleAddFriend = async () => {
    if (!friendCode.trim()) return;
    try {
      await addFriend.mutateAsync({ data: { shareCode: friendCode.trim().toUpperCase() } });
      toast.success("Friend added!");
      setFriendCode("");
      setAddDialogOpen(false);
      refetch();
    } catch (err: any) {
      const msg = err?.data?.error ?? "Could not add friend. Check the code and try again.";
      toast.error(msg);
    }
  };

  const handleRemoveFriend = async (friendUserId: string) => {
    try {
      await removeFriend.mutateAsync({ friendUserId });
      toast.success("Friend removed");
      refetch();
    } catch {
      toast.error("Could not remove friend");
    }
  };

  const friendDisplayName = (f: any) =>
    f.displayName || [f.firstName, f.lastName].filter(Boolean).join(" ") || "Anonymous";

  const friendInitial = (f: any) =>
    (f.displayName?.[0] || f.firstName?.[0] || "?").toUpperCase();

  const friendList = (friends as any[]);

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative h-40 bg-gradient-to-br from-background to-secondary/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,hsl(35_65%_62%/0.08),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
          <p className="text-muted-foreground mt-1">Connect, invite, and grow with your chevra</p>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">

        {/* Your invite code */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <Link className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold mb-1">Your Invite Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share this with friends so they can add you on Btachon
                </p>

                {profile?.shareCode ? (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-background border border-border rounded-xl px-5 py-3 flex-1">
                      <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5">Your code</div>
                      <div className="text-2xl font-mono font-bold tracking-widest text-foreground">{profile.shareCode}</div>
                    </div>
                    <Button variant="outline" size="icon" className="h-14 w-14 shrink-0" onClick={handleCopyCode}>
                      {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                ) : (
                  <div className="h-16 bg-background/50 border border-border rounded-xl animate-pulse mb-4" />
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={handleShareLink}>
                    <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share my code
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShareApp}>
                    <Mail className="w-3.5 h-3.5 mr-1.5" /> Invite to Btachon
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Friends list header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your Chevra</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? "Loading..." : `${friendList.length} friend${friendList.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" /> Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Friend</DialogTitle>
                <DialogDescription>Enter your friend's invite code to connect on Btachon</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Friend's Code</Label>
                  <Input
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                    placeholder="e.g. A1B2C3D4"
                    className="font-mono text-xl tracking-widest uppercase h-14 text-center"
                    maxLength={8}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-center">Your friend can find their code on this Friends page</p>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFriend} disabled={!friendCode.trim() || addFriend.isPending}>
                  {addFriend.isPending ? "Adding..." : "Add Friend"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Friends list */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : friendList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-2xl"
          >
            <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="font-bold text-lg">No friends yet</p>
            <p className="text-sm mt-2 max-w-xs mx-auto">
              Share your invite code or tap "Add Friend" to enter a friend's code
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {friendList.map((friend: any, i: number) => (
                <motion.div
                  key={friend.userId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="border-border hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {friend.profileImageUrl ? (
                          <img
                            src={friend.profileImageUrl}
                            alt={friendDisplayName(friend)}
                            className="w-11 h-11 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground text-lg">
                            {friendInitial(friend)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{friendDisplayName(friend)}</div>
                          <div className="text-xs text-muted-foreground font-mono tracking-wider">{friend.shareCode}</div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => handleRemoveFriend(friend.userId)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Share app CTA */}
        <div className="border border-dashed border-border rounded-2xl p-6 text-center">
          <Mail className="w-8 h-8 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="font-bold mb-1">Bring your chevra to Btachon</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Know someone who'd love a personal Jewish growth app? Invite them.
          </p>
          <Button variant="outline" onClick={handleShareApp}>
            <Share2 className="w-4 h-4 mr-2" /> Share Btachon
          </Button>
        </div>

      </div>
    </div>
  );
}
