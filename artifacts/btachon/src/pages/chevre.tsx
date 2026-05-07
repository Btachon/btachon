import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredJwt } from "@workspace/replit-auth-web";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, UserPlus, Handshake, Check, Share2, Copy, Mail, Link, X, Swords, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  useGetFriends,
  useAddFriendByCode,
  useRemoveFriend,
  useGetIncomingFriendRequests,
  useSendFriendRequest,
  useRespondToFriendRequest,
} from "@workspace/api-client-react";
import chevreHero from "@/assets/connect-hero.png";

function getApiBase(): string {
  return (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
}

function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    const token = getStoredJwt();
    fetch(`${getApiBase()}/api/profile`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => setProfile(d))
      .catch(() => {});
  }, []);
  return profile;
}

const CHALLENGE_PRESETS = [
  "Learn together for 30 days",
  "Daily 10-minute learning",
  "Daf Yomi chavrusa",
  "One mitzvah a day for 30 days",
  "No social media for a week",
  "Say Shema twice daily for 30 days",
  "Mussar study for 2 weeks",
];

type RequestType = "challenge" | "tehillim";

function friendDisplayName(f: any) {
  return f.displayName || f.fromDisplayName || f.firstName || f.fromFirstName || "Friend";
}
function friendInitial(f: any) {
  return ((f.displayName || f.fromDisplayName || f.firstName || f.fromFirstName || "?")[0] || "?").toUpperCase();
}

function IncomingRequestCard({ req, onRespond }: { req: any; onRespond: () => void }) {
  const respond = useRespondToFriendRequest();
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null);

  const handle = async (status: "accepted" | "declined") => {
    setLoading(status);
    try {
      await respond.mutateAsync({ requestId: req.id, data: { status } });
      toast.success(status === "accepted" ? "Accepted!" : "Declined");
      onRespond();
    } catch {
      toast.error("Could not respond");
    } finally {
      setLoading(null);
    }
  };

  const fromName = req.fromDisplayName || req.fromFirstName || "A friend";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-4 rounded-xl border ${req.type === "tehillim" ? "border-blue-500/30 bg-blue-500/5" : "border-primary/30 bg-primary/5"}`}
    >
      <div className="flex items-start gap-3">
        {req.fromProfileImageUrl ? (
          <img src={req.fromProfileImageUrl} alt={fromName} className="w-9 h-9 rounded-full border border-border object-cover shrink-0 mt-0.5" />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm ${req.type === "tehillim" ? "bg-blue-500/20 text-blue-400" : "bg-primary/20 text-primary"}`}>
            {(fromName[0] || "?").toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground">{fromName}</span>
            {req.type === "challenge" ? (
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary px-1.5 py-0">Challenge</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-400 px-1.5 py-0">Tehillim</Badge>
            )}
          </div>
          {req.message && (
            <p className="text-sm text-muted-foreground mt-1 leading-snug">{req.message}</p>
          )}
          {!req.message && req.type === "tehillim" && (
            <p className="text-sm text-muted-foreground mt-1">is asking you to say Tehillim</p>
          )}
          {!req.message && req.type === "challenge" && (
            <p className="text-sm text-muted-foreground mt-1">is inviting you to a growth challenge</p>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              disabled={!!loading}
              onClick={() => handle("accepted")}
            >
              {loading === "accepted" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              disabled={!!loading}
              onClick={() => handle("declined")}
            >
              {loading === "declined" ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              Decline
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SendRequestDialog({
  friend,
  open,
  onClose,
}: {
  friend: any;
  open: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState<RequestType>("challenge");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const sendRequest = useSendFriendRequest();

  const name = friendDisplayName(friend);

  const handleSend = async () => {
    const message = type === "challenge"
      ? (selectedPreset ?? customMessage.trim() ?? null)
      : customMessage.trim() || null;

    try {
      await sendRequest.mutateAsync({ data: { toUserId: friend.userId, type, message: message || null } });
      toast.success(`${type === "challenge" ? "Challenge" : "Tehillim request"} sent to ${name}`);
      setSelectedPreset(null);
      setCustomMessage("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.error ?? "Could not send request");
    }
  };

  const canSend = type === "tehillim" || selectedPreset || customMessage.trim();

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send to {name}</DialogTitle>
          <DialogDescription>Choose what you want to do together</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setType("challenge"); setSelectedPreset(null); setCustomMessage(""); }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                type === "challenge" ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Swords className="w-4 h-4" /> Growth Challenge
            </button>
            <button
              onClick={() => { setType("tehillim"); setSelectedPreset(null); setCustomMessage(""); }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                type === "tehillim" ? "border-blue-500/50 bg-blue-500/10 text-blue-400" : "border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Ask for Tehillim
            </button>
          </div>

          {type === "challenge" && (
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pick a challenge</Label>
              <div className="grid grid-cols-1 gap-1.5">
                {CHALLENGE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => { setSelectedPreset(preset); setCustomMessage(""); }}
                    className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                      selectedPreset === preset
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/50 bg-secondary/10 text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Or write your own</Label>
                <Input
                  value={customMessage}
                  onChange={e => { setCustomMessage(e.target.value); setSelectedPreset(null); }}
                  placeholder="e.g. No YouTube for a month..."
                  className="bg-secondary/30"
                />
              </div>
            </div>
          )}

          {type === "tehillim" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Who to daven for?</Label>
              <Textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="e.g. Please say Tehillim for Yossi ben Rivka — refuah shleimah"
                className="bg-secondary/30 resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Leave blank to send a general request</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSend}
            disabled={!canSend || sendRequest.isPending}
            className={type === "tehillim" ? "bg-blue-600 hover:bg-blue-500 text-white" : ""}
          >
            {sendRequest.isPending ? "Sending..." : `Send ${type === "challenge" ? "Challenge" : "Tehillim Request"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Chevre() {
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);

  const profile = useProfile();
  const { data: dbFriends = [], isLoading: dbLoading, refetch } = useGetFriends();
  const { data: incoming = [], refetch: refetchIncoming } = useGetIncomingFriendRequests();
  const addFriend = useAddFriendByCode();
  const removeFriend = useRemoveFriend();

  const dbFriendList = dbFriends as any[];
  const incomingList = incoming as any[];
  const pendingCount = incomingList.length;

  const handleCopyCode = () => {
    if (!profile?.shareCode) return;
    navigator.clipboard.writeText(profile.shareCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}?invite=${profile?.shareCode}`;
    if (navigator.share) {
      navigator.share({ title: "Join me on Btachon", text: "Use my code to add me on Btachon!", url }).catch(() => {});
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
      setAddOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error ?? "Couldn't add friend. Check the code and try again.");
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

  return (
    <div className="pb-24">
      <div className="relative h-48 w-full overflow-hidden border-b border-border/50">
        <img src={chevreHero} alt="Chevra" className="w-full h-full object-cover opacity-60 object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Connect</h1>
          <p className="text-muted-foreground mt-1">Growth is a team sport. Keep each other accountable.</p>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto pt-6">
        <Tabs defaultValue="chevra">
          <TabsList className="grid w-full max-w-sm grid-cols-2 mb-8">
            <TabsTrigger value="chevra" className="relative">
              My Chevra
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="connect">Add Friends</TabsTrigger>
          </TabsList>

          {/* ── MY CHEVRA TAB ─────────────────────────────────── */}
          <TabsContent value="chevra" className="space-y-6">

            {/* Incoming requests */}
            <AnimatePresence>
              {incomingList.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Waiting for you</p>
                    <Badge className="text-[10px] px-1.5 py-0 h-4">{incomingList.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {incomingList.map(req => (
                        <IncomingRequestCard
                          key={req.id}
                          req={req}
                          onRespond={() => { refetchIncoming(); }}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Friends list */}
            {dbLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />)}
              </div>
            ) : dbFriendList.length > 0 ? (
              <Card className="shadow-sm border-border">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Your Chevra</span>
                    <Button size="sm" variant="ghost" className="text-xs h-7 gap-1.5" onClick={() => setAddOpen(true)}>
                      <UserPlus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <AnimatePresence>
                    {dbFriendList.map((f: any, i: number) => (
                      <motion.div
                        key={f.userId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors border-b border-border/30 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          {f.profileImageUrl ? (
                            <img src={f.profileImageUrl} alt={friendDisplayName(f)} className="w-10 h-10 rounded-full border border-border object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground">
                              {friendInitial(f)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm leading-none text-foreground">{friendDisplayName(f)}</p>
                            <p className="text-xs text-muted-foreground font-mono tracking-wider mt-1">{f.shareCode}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => setSelectedFriend({ ...f, requestType: "challenge" })}
                          >
                            <Swords className="w-3 h-3" /> Challenge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1.5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            onClick={() => setSelectedFriend({ ...f, requestType: "tehillim" })}
                          >
                            <BookOpen className="w-3 h-3" /> Tehillim
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveFriend(f.userId)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-10 mb-3" />
                <p className="font-bold text-lg">Your chevra is empty</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Add friends to challenge each other and grow together.</p>
                <Button className="mt-5" onClick={() => setAddOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Add a Friend
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ── ADD FRIENDS TAB ───────────────────────────────── */}
          <TabsContent value="connect" className="space-y-6 max-w-xl">

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                    <Link className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1">Your Invite Code</h3>
                    <p className="text-sm text-muted-foreground mb-4">Share this with friends so they can add you</p>
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

            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Add a Friend</h3>
                    <p className="text-sm text-muted-foreground mb-4">Enter a friend's code to connect on Btachon</p>
                    <div className="space-y-3">
                      <Input
                        value={friendCode}
                        onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                        placeholder="e.g. A1B2C3D4"
                        className="font-mono text-xl tracking-widest uppercase h-14 text-center bg-secondary/30"
                        maxLength={8}
                        onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                      />
                      <Button
                        className="w-full"
                        onClick={handleAddFriend}
                        disabled={!friendCode.trim() || addFriend.isPending}
                      >
                        {addFriend.isPending ? "Adding..." : "Add Friend"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!dbLoading && dbFriendList.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Connected ({dbFriendList.length})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dbFriendList.map((f: any, i: number) => (
                    <motion.div key={f.userId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="border-border hover:border-primary/40 transition-colors">
                        <CardContent className="p-4 flex items-center gap-3">
                          {f.profileImageUrl ? (
                            <img src={f.profileImageUrl} alt={friendDisplayName(f)} className="w-10 h-10 rounded-full border border-border object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground">
                              {friendInitial(f)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{friendDisplayName(f)}</div>
                            <div className="text-xs text-muted-foreground font-mono tracking-wider">{f.shareCode}</div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => handleRemoveFriend(f.userId)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {!dbLoading && dbFriendList.length === 0 && (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-10 mb-3" />
                <p className="font-bold">No friends yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Share your invite code or enter a friend's code above</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add friend dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Friend</DialogTitle>
            <DialogDescription>Enter your friend's invite code to connect</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
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
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFriend} disabled={!friendCode.trim() || addFriend.isPending}>
              {addFriend.isPending ? "Adding..." : "Add Friend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send request dialog */}
      {selectedFriend && (
        <SendRequestDialog
          friend={selectedFriend}
          open={!!selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  );
}
