import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Users, UserPlus, MessageCircle, Send, Handshake, Check, Share2, Copy, Mail, Link, X } from "lucide-react";
import { useGetFriends, useAddFriendByCode, useRemoveFriend } from "@workspace/api-client-react";
import chevreHero from "@/assets/connect-hero.png";

function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => setProfile(d))
      .catch(() => {});
  }, []);
  return profile;
}

export default function Chevre() {
  const [commitments, setCommitments] = useLocalStorage<any[]>("commitments", []);
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const profile = useProfile();
  const { data: dbFriends = [], isLoading: dbLoading, refetch } = useGetFriends();
  const addFriend = useAddFriendByCode();
  const removeFriend = useRemoveFriend();

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

  const friendDisplayName = (f: any) =>
    f.displayName || [f.firstName, f.lastName].filter(Boolean).join(" ") || "Anonymous";
  const friendInitial = (f: any) =>
    (f.displayName?.[0] || f.firstName?.[0] || "?").toUpperCase();

  const dbFriendList = dbFriends as any[];

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
            <TabsTrigger value="chevra">My Chevra</TabsTrigger>
            <TabsTrigger value="connect">Add Friends</TabsTrigger>
          </TabsList>

          {/* ── MY CHEVRA TAB ─────────────────────────────────── */}
          <TabsContent value="chevra" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">

                {/* Real DB friends */}
                {dbLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />)}
                  </div>
                ) : dbFriendList.length > 0 && (
                  <Card className="shadow-sm border-border">
                    <CardHeader className="pb-4 border-b border-border/50">
                      <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Connected Friends</span>
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
                            className="p-5 flex items-center justify-between hover:bg-secondary/20 transition-colors border-b border-border/30 last:border-0"
                          >
                            <div className="flex items-center gap-4">
                              {f.profileImageUrl ? (
                                <img src={f.profileImageUrl} alt={friendDisplayName(f)} className="w-11 h-11 rounded-full border border-border object-cover" />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground text-lg">
                                  {friendInitial(f)}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-base leading-none text-foreground">{friendDisplayName(f)}</p>
                                <p className="text-xs text-muted-foreground font-mono tracking-wider mt-1">{f.shareCode}</p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveFriend(f.userId)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                )}

                {/* Empty / no-friends state for My Chevra tab */}
                {!dbLoading && dbFriendList.length === 0 && (
                  <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-10 mb-3" />
                    <p className="font-bold text-lg">Your chevra is empty</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Add friends to chat, make commitments, and grow together.</p>
                    <Button className="mt-5" onClick={() => setAddOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" /> Add a Friend
                    </Button>
                  </div>
                )}
              </div>

              {/* Commitments sidebar */}
              <div className="space-y-6">
                <Card className="shadow-sm border-border bg-secondary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                      <Handshake className="w-4 h-4" /> My Commitments
                    </CardTitle>
                    <CardDescription>Joint goals with your chevra.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {commitments.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground font-medium mb-1">No active commitments.</p>
                        <p className="text-xs text-muted-foreground">Send one to a friend to get started.</p>
                      </div>
                    ) : (
                      commitments.map((c, i) => (
                        <div key={i} className="bg-card p-4 rounded-xl border border-border space-y-3">
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-sm text-foreground">{c.type}</p>
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-secondary text-muted-foreground px-2 py-1 rounded-md">w/ {c.friendName}</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 100)} className="h-1.5 bg-secondary" />
                          <p className="text-xs text-muted-foreground text-right font-medium">{c.duration}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── ADD FRIENDS TAB ───────────────────────────────── */}
          <TabsContent value="connect" className="space-y-6 max-w-xl">

            {/* Your invite code */}
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

            {/* Add by code */}
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
                      <div className="space-y-2">
                        <Label>Friend's Code</Label>
                        <Input
                          value={friendCode}
                          onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                          placeholder="e.g. A1B2C3D4"
                          className="font-mono text-xl tracking-widest uppercase h-14 text-center"
                          maxLength={8}
                          onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                        />
                      </div>
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

            {/* Connected friends when on connect tab */}
            {!dbLoading && dbFriendList.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Your connections ({dbFriendList.length})</p>
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

      {/* Add friend dialog (from My Chevra tab) */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Friend</DialogTitle>
            <DialogDescription>Enter your friend's invite code to connect</DialogDescription>
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
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFriend} disabled={!friendCode.trim() || addFriend.isPending}>
              {addFriend.isPending ? "Adding..." : "Add Friend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChatSheet({ friend }: { friend: any }) {
  const [messages, setMessages] = useLocalStorage<any[]>(`chat:${friend.id}`, [
    { sender: "them", text: "Are you learning tonight?", time: "10:00 AM" },
    { sender: "me", text: "Yes, planning to do Daf Yomi after maariv.", time: "10:05 AM" },
    { sender: "them", text: "Hatzlacha!", time: "10:06 AM" }
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages([...messages, { sender: "me", text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full w-10 h-10">
          <MessageCircle className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-card border-l-border">
        <SheetHeader className="p-4 border-b border-border bg-secondary/20">
          <SheetTitle className="text-base font-bold flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarFallback className="bg-secondary text-xs">{friend.name[0]}</AvatarFallback>
            </Avatar>
            {friend.name}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${m.sender === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                  <p className="text-sm">{m.text}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {["Want to learn?", "I'm in shul", "Saying a perek for you", "Bli neder"].map(chip => (
              <button
                key={chip}
                onClick={() => send(chip)}
                className="whitespace-nowrap px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-xs font-medium rounded-full border border-border/50 transition-colors text-foreground"
              >
                {chip}
              </button>
            ))}
          </div>
          <form className="flex gap-2 mt-1" onSubmit={e => { e.preventDefault(); send(input); }}>
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="bg-secondary/30 rounded-full" />
            <Button type="submit" size="icon" className="rounded-full shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CommitmentDrawer({ friend, onCommit }: { friend: any; onCommit: (c: any) => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [duration, setDuration] = useState("1 week");

  const handleSend = () => {
    if (!selectedType) return;
    onCommit({ friendName: friend.name, type: selectedType, duration });
    toast.success("Commitment Sent", { description: `${friend.name} will be notified of your commitment.` });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full w-10 h-10">
          <Handshake className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card border-border">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Send Commitment</DrawerTitle>
          <DrawerDescription>Challenge {friend.name} to grow together.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Select Goal</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["613 Chai Together", "Daf Yomi", "Parsha", "Chavrusa", "Custom Goal"].map(t => (
                <div
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`p-3 rounded-xl border text-sm text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 h-20 ${
                    selectedType === t ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground font-medium"
                  }`}
                >
                  {selectedType === t && <Check className="w-4 h-4" />}
                  {t}
                </div>
              ))}
            </div>
          </div>
          {selectedType && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Duration</p>
              <div className="flex gap-2">
                {["1 week", "30 days", "Custom"].map(d => (
                  <Button
                    key={d}
                    variant={duration === d ? "default" : "outline"}
                    className={`rounded-full ${duration === d ? "" : "text-muted-foreground"}`}
                    size="sm"
                    onClick={() => setDuration(d)}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={handleSend} disabled={!selectedType} className="w-full">
              Send Commitment to {friend.name}
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
