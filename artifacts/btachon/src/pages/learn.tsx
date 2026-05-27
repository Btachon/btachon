import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, Video, Users, UserPlus, MicOff, PhoneOff, Users2, Sparkles, MapPin, Globe, ArrowLeft, ArrowRight, GraduationCap, School, Play, Clock, Bookmark, BookmarkCheck, X, Star, Repeat2, HandshakeIcon, Trash2, Ban } from "lucide-react";
import { WATCH_VIDEOS, VIDEO_CATEGORIES, type WatchVideo, type VideoCategory } from "@/data/watchVideos";
import {
  useListTutors,
  useRegisterAsTutor,
  useRemoveTutorListing,
  useContactTutor,
  useListLearnSessions,
  useCreateLearnSession,
  useRespondToLearnSession,
  useGetProfile,
  getListLearnSessionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";

import heroLearn from "@/assets/hero-learn.png";
import chavrusaHeader from "@/assets/chavrusa-header.png";
import lishmaHeader from "@/assets/lishma-header.png";
import studySessionsHeader from "@/assets/study-sessions-header.png";

type Section = null | "chavrusa" | "lishma" | "study" | "skillswap";

const SECTIONS = [
  {
    id: "chavrusa" as Section,
    title: "Peer to Peer",
    subtitle: "1:1 Tutoring & Chavrusa",
    description: "Connect one-on-one with a tutor or find a chavrusa anywhere in the world. Gemara, Halacha, Tanach, Hashkafa — any subject, any level.",
    image: chavrusaHeader,
    icon: Users,
    cta: "Find a Tutor or Chavrusa",
  },
  {
    id: "skillswap" as Section,
    title: "Skill-Swap Lab",
    subtitle: "Global Talent Exchange",
    description: "Post a skill you have and a skill you want to learn. Find your match and grow together — Torah, music, languages, and more.",
    image: lishmaHeader,
    icon: Repeat2,
    cta: "Enter the Marketplace",
  },
  {
    id: "lishma" as Section,
    title: "Lishma",
    subtitle: "Torah for Its Own Sake",
    description: "Open learning sessions hosted by the chevra. Register for upcoming shiurim or host your own. Learn for the love of it.",
    image: studySessionsHeader,
    icon: School,
    cta: "Browse Sessions",
  },
  {
    id: "study" as Section,
    title: "Study Sessions",
    subtitle: "Open Groups",
    description: "Group learning anyone can join. Tutor-led or peer-led. Perfect for asking questions in a supportive environment.",
    image: heroLearn,
    icon: GraduationCap,
    cta: "Join a Session",
  },
];

export default function Learn() {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [watchCategory, setWatchCategory] = useState<VideoCategory | "All">("All");
  const [watchTab, setWatchTab] = useState<"clips" | "shiurim">("clips");
  const [savedVideos, setSavedVideos] = useLocalStorage<string[]>("savedVideos", []);
  const [playingVideo, setPlayingVideo] = useState<WatchVideo | null>(null);

  const toggleSave = (id: string) => {
    setSavedVideos(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const filteredVideos = WATCH_VIDEOS.filter(v => {
    const matchCat = watchCategory === "All" || v.category === watchCategory;
    const matchTab = watchTab === "clips" ? v.isShort : !v.isShort;
    return matchCat && matchTab;
  });

  const [lishmaRegistrations, setLishmaRegistrations] = useLocalStorage<any[]>("lishmaRegistrations", []);
  const [sessionSuggestions, setSessionSuggestions] = useLocalStorage<any[]>("sessionSuggestions", []);
  const qc = useQueryClient();

  const { data: tutorList = [], isLoading: tutorsLoading, refetch: refetchTutors } = useListTutors();
  const registerAsTutor = useRegisterAsTutor();
  const removeTutorListing = useRemoveTutorListing();
  const contactTutor = useContactTutor();
  const { data: allSessions = [], isLoading: sessionsLoading, refetch: refetchSessions } = useListLearnSessions();
  const createLearnSession = useCreateLearnSession();
  const respondToSession = useRespondToLearnSession();
  const { data: myProfile } = useGetProfile();
  const myUserId = (myProfile as any)?.userId;
  const amAdmin = !!(myProfile as any)?.isAdmin;
  const [becomeTutorOpen, setBecomeTutorOpen] = useState(false);

  const handleDeleteListing = async (sessionId: string) => {
    try {
      await customFetch(`/api/learn-sessions/${sessionId}`, { method: "DELETE", responseType: "json" });
      toast.success("Listing removed");
      refetchSessions();
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      if (status === 403) toast.error("Not allowed — only the owner or an admin can remove this.");
      else if (status === 401) toast.error("Please sign in again.");
      else toast.error("Could not remove listing");
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    if (!confirm(`Ban ${userName}? This will lock their account and delete all their listings. You can unban from the admin panel in Settings.`)) return;
    try {
      await customFetch(`/api/admin/users/${userId}/ban`, {
        method: "POST",
        body: JSON.stringify({ reason: "Banned from marketplace" }),
        responseType: "json",
      });
      toast.success(`${userName} has been banned`, { description: "Their listings have been removed." });
      refetchSessions();
      refetchTutors();
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      if (status === 403) toast.error("You're not an admin — check ADMIN_EMAILS matches your login email.");
      else if (status === 401) toast.error("Please sign in again.");
      else toast.error(err?.message ?? "Could not ban user");
    }
  };

  const dbTutors = tutorList as any[];

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [levelFilter, setLevelFilter] = useState("All");

  const handleJoin = (session: any) => {
    setActiveSession(session);
    setIsJoinModalOpen(true);
  };

  const handleRequestTutor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const topic = formData.get("topic") as string;
    const level = formData.get("level") as string;
    const time = formData.get("time") as string;
    const language = formData.get("language") as string;
    try {
      await createLearnSession.mutateAsync({ data: {
        type: "request",
        title: topic,
        description: `Available: ${time} · Language: ${language}`,
        level,
      }});
      qc.invalidateQueries({ queryKey: getListLearnSessionsQueryKey() });
      toast.success("Request posted!", { description: "Tutors can now see it and reach out to you via Alerts." });
      (e.target as HTMLFormElement).reset();
      document.getElementById("close-request-tutor")?.click();
    } catch {
      toast.error("Could not post request. Please try again.");
    }
  };

  const handleRespondToRequest = async (sessionId: string, message: string, closeId: string) => {
    try {
      await respondToSession.mutateAsync({ id: sessionId, data: { message: message || null } });
      toast.success("Offer sent!", { description: "The student will see your message in their Alerts." });
      document.getElementById(closeId)?.click();
    } catch {
      toast.error("Could not send response.");
    }
  };

  const handleBecomeTutor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await registerAsTutor.mutateAsync({ data: {
        displayName: formData.get("displayName") as string,
        subjects: formData.get("subjects") as string,
        languages: formData.get("languages") as string,
        availability: formData.get("availability") as string,
        bio: (formData.get("bio") as string) || null,
      }});
      toast.success("You're listed as a tutor!", { description: "Other users can now find and contact you." });
      setBecomeTutorOpen(false);
      refetchTutors();
    } catch {
      toast.error("Could not save tutor profile");
    }
  };

  const handleRemoveTutorListing = async () => {
    try {
      await removeTutorListing.mutateAsync();
      toast.success("Listing removed");
      refetchTutors();
    } catch {
      toast.error("Could not remove listing");
    }
  };

  const handleRequestChavrusa = async (e: React.FormEvent<HTMLFormElement>, tutorId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    try {
      await contactTutor.mutateAsync({ tutorId, data: { message } });
      toast.success("Message sent!", { description: "They'll get a notification and email." });
      (e.target as HTMLFormElement).reset();
      document.getElementById(`close-chavrusa-${tutorId}`)?.click();
    } catch {
      toast.error("Could not send message");
    }
  };

  const handleRegisterLishma = (session: any) => {
    if (lishmaRegistrations.some((r: any) => r.id === session.id)) { toast("Already registered"); return; }
    setLishmaRegistrations([...lishmaRegistrations, session]);
    toast.success(`Registered for ${session.title}`, { description: "We'll send you a reminder." });
  };

  const handlePostChavrusa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get("subject") as string;
    const level = formData.get("level") as string;
    const schedule = formData.get("schedule") as string;
    const bring = formData.get("bring") as string;
    try {
      await createLearnSession.mutateAsync({ data: {
        type: "chavrusa",
        title: subject,
        description: `Schedule: ${schedule}${bring ? ` · I bring: ${bring}` : ""}`,
        level,
      }});
      qc.invalidateQueries({ queryKey: getListLearnSessionsQueryKey() });
      toast.success("Posted to the Chavrusa board!", { description: "Others can now find and connect with you." });
      (e.target as HTMLFormElement).reset();
      document.getElementById("close-post-chavrusa")?.click();
    } catch {
      toast.error("Could not post. Please try again.");
    }
  };

  const handlePostSkillSwap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const have = formData.get("have") as string;
    const want = formData.get("want") as string;
    const details = formData.get("details") as string;
    try {
      await createLearnSession.mutateAsync({ data: {
        type: "skillswap",
        title: have,
        description: `Want to learn: ${want}${details ? ` · ${details}` : ""}`,
        level: "All",
      }});
      qc.invalidateQueries({ queryKey: getListLearnSessionsQueryKey() });
      toast.success("Listed in the Skill-Swap marketplace!", { description: "Others can now offer to swap with you." });
      (e.target as HTMLFormElement).reset();
      document.getElementById("close-post-skillswap")?.click();
    } catch {
      toast.error("Could not post. Please try again.");
    }
  };

  const handleHostSession = async (e: React.FormEvent<HTMLFormElement>, type: "lishma" | "study") => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createLearnSession.mutateAsync({ data: {
        type,
        title: (formData.get("topic") || formData.get("title")) as string,
        description: formData.get("description") as string || undefined,
        topic: formData.get("topic") as string || undefined,
        level: formData.get("level") as string || "All",
        format: formData.get("format") as string || "peer",
        date: formData.get("date") as string || undefined,
        time: formData.get("time") as string || undefined,
        duration: formData.get("duration") as string || undefined,
        capacity: parseInt((formData.get("capacity") as string) || "10"),
      }});
      toast.success("Session created", { description: "Your session is now live on the board." });
      (e.target as HTMLFormElement).reset();
      qc.invalidateQueries({ queryKey: getListLearnSessionsQueryKey() });
    } catch {
      toast.error("Could not create session");
    }
  };

  const handleSuggestSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSessionSuggestions([...sessionSuggestions, {
      topic: formData.get("topic") as string,
      format: formData.get("format") as string,
      reason: formData.get("reason") as string,
    }]);
    toast.success("Suggestion submitted", { description: "We'll see if we can get this on the schedule." });
    document.getElementById("close-suggest-session")?.click();
  };

  const sessions = Array.isArray(allSessions) ? (allSessions as any[]) : [];
  const lishmaSessionsAll = sessions.filter((s) => s.type === "lishma");
  const studySessionsAll = sessions.filter((s) => s.type === "study");
  const chavrusaPartners = sessions.filter((s) => s.type === "chavrusa");
  const skillSwapPosts = sessions.filter((s) => s.type === "skillswap");
  const filteredLishma = lishmaSessionsAll.filter(
    (s) => levelFilter === "All" || s.level === levelFilter || s.level === "All"
  );

  return (
    <div className="pb-24">
      {/* Hero — always visible */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={heroLearn} alt="Beis Medrash" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full max-w-5xl mx-auto flex items-end justify-between">
          <div>
            {activeSection ? (
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Learning Lab
              </button>
            ) : null}
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {activeSection
                ? SECTIONS.find(s => s.id === activeSection)?.title
                : "Learning Lab"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeSection
                ? SECTIONS.find(s => s.id === activeSection)?.description.slice(0, 60) + "…"
                : "Connect. Learn. Grow together."}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* HUB — section picker */}
        {!activeSection && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pt-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Choose a section</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SECTIONS.map((sec, i) => (
                <motion.button
                  key={sec.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setActiveSection(sec.id)}
                  className="group text-left rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={sec.image}
                      alt={sec.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{sec.subtitle}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">{sec.title}</h2>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:border-primary/40 transition-colors">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sec.description}</p>
                    <div className="pt-1">
                      <span className="text-xs font-bold text-primary group-hover:underline">{sec.cta} →</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION: Peer to Peer / Chavrusa */}
        {activeSection === "chavrusa" && (
          <motion.div
            key="chavrusa"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8 space-y-10 max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border shadow-sm hover:border-primary/50 transition-colors overflow-hidden group">
                <CardContent className="p-8 flex flex-col h-full relative">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Users className="w-32 h-32 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Need a Tutor?</h3>
                  <p className="text-muted-foreground mb-8">Looking for guidance? Request a tutor for a specific topic, level, and time.</p>
                  <div className="mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full text-lg h-14">Request a Tutor</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Request a Tutor</DialogTitle>
                          <DialogDescription>Fill out this form to connect with an available tutor.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRequestTutor} className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input name="topic" required placeholder="e.g. Gemara Brachos, Hashkafa..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Level</Label>
                            <Select name="level" required defaultValue="beginner">
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Preferred Time</Label>
                            <Input name="time" required placeholder="e.g. Evenings, Sundays..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Language Preference</Label>
                            <Input name="language" required placeholder="e.g. English, Hebrew..." />
                          </div>
                          <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" id="close-request-tutor">Cancel</Button>
                            <Button type="submit">Submit Request</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:border-primary/50 transition-colors overflow-hidden group bg-secondary/10">
                <CardContent className="p-8 flex flex-col h-full relative">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Sparkles className="w-32 h-32 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Share Your Knowledge</h3>
                  <p className="text-muted-foreground mb-8">One of the highest forms of Avodah is teaching others. List yourself as a tutor.</p>
                  <div className="mt-auto">
                    <Button size="lg" variant="secondary" className="w-full text-lg h-14" onClick={() => setBecomeTutorOpen(true)}>
                      Become a Tutor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Become a Tutor dialog */}
            <Dialog open={becomeTutorOpen} onOpenChange={setBecomeTutorOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tutor Profile</DialogTitle>
                  <DialogDescription>List your availability and expertise so others can find you.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBecomeTutor} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Your Name / Display Name</Label>
                    <Input name="displayName" required placeholder="e.g. Yosef Goldberg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subjects you can teach</Label>
                    <Input name="subjects" required placeholder="e.g. Chumash, Halacha, Gemara..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Languages spoken</Label>
                    <Input name="languages" required placeholder="e.g. English, Yiddish, Hebrew..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Input name="availability" required placeholder="e.g. Monday nights, Sundays 9am..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Bio <span className="text-muted-foreground">(optional)</span></Label>
                    <Textarea name="bio" placeholder="A brief intro about your learning background..." className="resize-none" rows={3} />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={() => setBecomeTutorOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={registerAsTutor.isPending}>
                      {registerAsTutor.isPending ? "Saving..." : "List Me as a Tutor"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Tutor Directory */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">Tutor Directory</h3>
                <Button variant="outline" size="sm" onClick={() => setBecomeTutorOpen(true)}>
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add yourself
                </Button>
              </div>

              {tutorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-44 rounded-xl bg-secondary/30 animate-pulse" />)}
                </div>
              ) : dbTutors.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                  <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground opacity-10 mb-3" />
                  <p className="font-bold text-lg">No tutors listed yet</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Be the first to offer your knowledge to the chevra.</p>
                  <Button className="mt-5" onClick={() => setBecomeTutorOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Become a Tutor
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {dbTutors.map((t: any, i: number) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Card className="border-border hover:border-primary/40 transition-colors shadow-sm h-full flex flex-col">
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex items-start gap-3 mb-4">
                            {t.profileImageUrl ? (
                              <img src={t.profileImageUrl} alt={t.displayName} className="w-11 h-11 rounded-full border border-border object-cover shrink-0" />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                                {(t.displayName[0] || "?").toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-base leading-tight truncate">{t.displayName}</h4>
                                {t.isFeatured && <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />}
                              </div>
                              {t.bio && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.bio}</p>}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm flex-1">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subjects</span>
                              <p className="text-foreground mt-0.5">{t.subjects}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Languages</span>
                              <p className="text-foreground mt-0.5">{t.languages}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Available</span>
                              <p className="text-foreground mt-0.5">{t.availability}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                            {t.userId !== myUserId ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="flex-1">Contact</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Contact {t.displayName}</DialogTitle>
                                    <DialogDescription>Your message goes to their Alerts — they can accept and share their Zoom link with you.</DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={(e) => handleRequestChavrusa(e, t.id)} className="space-y-4 pt-4">
                                    <Textarea name="message" required placeholder={`Hi ${t.displayName}, I'm interested in learning ${t.subjects.split(",")[0].trim()} together...`} className="resize-none" rows={4} />
                                    <DialogFooter>
                                      <Button id={`close-chavrusa-${t.id}`} type="button" variant="outline">Cancel</Button>
                                      <Button type="submit" disabled={contactTutor.isPending}>
                                        {contactTutor.isPending ? "Sending..." : "Send Message"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <div className="flex-1 flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">Your listing</Badge>
                                <Button size="sm" variant="ghost" className="ml-auto text-muted-foreground hover:text-destructive" onClick={handleRemoveTutorListing}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Open Learning Requests Board */}
            {(() => {
              const openRequests = (allSessions as any[]).filter(s => s.type === "request");
              if (openRequests.length === 0) return null;
              return (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold tracking-tight">Open Learning Requests</h3>
                    <Badge variant="secondary">{openRequests.length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2">Students looking for a tutor. Click "I Can Help" to reach out.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {openRequests.map((req: any) => (
                      <Card key={req.id} className="border-border shadow-sm">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <p className="font-bold text-base leading-tight">{req.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">By {req.hostName}</p>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-xs">{req.level}</Badge>
                          </div>
                          {req.description && (
                            <p className="text-sm text-muted-foreground mb-4">{req.description}</p>
                          )}
                          {req.hostUserId === myUserId ? (
                            <p className="text-xs text-primary font-medium">Your request — tutors will reach out via your Alerts.</p>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="w-full">I Can Help</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Offer to help {req.hostName}</DialogTitle>
                                  <DialogDescription>They'll get a notification in their Alerts so they can accept and connect with you.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 pt-2">
                                  <Textarea
                                    id={`respond-msg-${req.id}`}
                                    placeholder={`Hi ${req.hostName}, I can help you with ${req.title}! I'm available...`}
                                    className="resize-none"
                                    rows={4}
                                  />
                                  <DialogFooter>
                                    <Button id={`close-respond-${req.id}`} type="button" variant="outline">Cancel</Button>
                                    <Button
                                      onClick={() => {
                                        const msg = (document.getElementById(`respond-msg-${req.id}`) as HTMLTextAreaElement)?.value ?? "";
                                        handleRespondToRequest(req.id, msg, `close-respond-${req.id}`);
                                      }}
                                      disabled={respondToSession.isPending}
                                    >
                                      {respondToSession.isPending ? "Sending..." : "Send Offer"}
                                    </Button>
                                  </DialogFooter>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Chavrusa Partner Board */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-bold tracking-tight">Find a Chavrusa Partner</h3>
                  <p className="text-sm text-muted-foreground">Looking for a peer learning partner? Post yourself or connect with others.</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Post Yourself
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Looking for a Chavrusa</DialogTitle>
                      <DialogDescription>Post your availability to find a peer learning partner.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePostChavrusa} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Subject you want to learn</Label>
                        <Input name="subject" required placeholder="e.g. Mishnah Berurah, Chumash, Gemara..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Your level</Label>
                        <Select name="level" required defaultValue="beginner">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>When you're available</Label>
                        <Input name="schedule" required placeholder="e.g. Sundays 9am, evenings after 9pm..." />
                      </div>
                      <div className="space-y-2">
                        <Label>What you bring <span className="text-muted-foreground">(optional)</span></Label>
                        <Input name="bring" placeholder="e.g. Patience, strong background in Rashi..." />
                      </div>
                      <DialogFooter className="pt-2">
                        <Button id="close-post-chavrusa" type="button" variant="outline">Cancel</Button>
                        <Button type="submit" disabled={createLearnSession.isPending}>
                          {createLearnSession.isPending ? "Posting..." : "Post to Board"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {sessionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-36 rounded-xl bg-secondary/30 animate-pulse" />)}
                </div>
              ) : chavrusaPartners.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                  <Users2 className="w-10 h-10 mx-auto text-muted-foreground opacity-10 mb-3" />
                  <p className="font-bold text-base">No one posted yet</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Be the first to post your availability and find a chavrusa.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chavrusaPartners.map((p: any) => (
                    <Card key={p.id} className="border-border shadow-sm hover:border-primary/30 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                              {p.hostName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-tight">{p.hostName}</p>
                              <p className="text-xs text-muted-foreground">{p.title}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">{p.level}</Badge>
                        </div>
                        {p.description && (
                          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
                        )}
                        {p.hostUserId === myUserId ? (
                          <p className="text-xs text-primary font-medium">Your listing — others can see and connect with you.</p>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary" className="w-full">Connect</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Connect with {p.hostName}</DialogTitle>
                                <DialogDescription>They'll receive a notification in their Alerts so you can set up a time.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 pt-2">
                                <Textarea
                                  id={`chavrusa-msg-${p.id}`}
                                  placeholder={`Shalom ${p.hostName}, I'm interested in learning ${p.title} together. I'm available...`}
                                  className="resize-none"
                                  rows={4}
                                />
                                <DialogFooter>
                                  <Button id={`close-respond-chavrusa-${p.id}`} type="button" variant="outline">Cancel</Button>
                                  <Button
                                    onClick={() => {
                                      const msg = (document.getElementById(`chavrusa-msg-${p.id}`) as HTMLTextAreaElement)?.value ?? "";
                                      handleRespondToRequest(p.id, msg, `close-respond-chavrusa-${p.id}`);
                                    }}
                                    disabled={respondToSession.isPending}
                                  >
                                    {respondToSession.isPending ? "Sending..." : "Send Message"}
                                  </Button>
                                </DialogFooter>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SECTION: Skill-Swap Lab */}
        {activeSection === "skillswap" && (
          <motion.div
            key="skillswap"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto"
          >
            {/* Action card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border shadow-sm hover:border-primary/50 transition-colors overflow-hidden group">
                <CardContent className="p-8 flex flex-col h-full relative">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Repeat2 className="w-32 h-32 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">List Your Skills</h3>
                  <p className="text-muted-foreground mb-8">Post a skill you have and a skill you want to learn. The chevra has more to offer than you think.</p>
                  <div className="mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full text-lg h-14">Post a Skill Swap</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Post a Skill Swap</DialogTitle>
                          <DialogDescription>Tell the community what you can teach and what you'd love to learn.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePostSkillSwap} className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Skill I have (what you can teach)</Label>
                            <Input name="have" required placeholder="e.g. Guitar, Spoken Hebrew, Graphic Design..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Skill I want (what you'd like to learn)</Label>
                            <Input name="want" required placeholder="e.g. Gemara, Coding, Cooking..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Additional details <span className="text-muted-foreground">(optional)</span></Label>
                            <Textarea name="details" placeholder="e.g. Available Sundays, prefer video call, beginner level..." className="resize-none" rows={3} />
                          </div>
                          <DialogFooter className="pt-2">
                            <Button id="close-post-skillswap" type="button" variant="outline">Cancel</Button>
                            <Button type="submit" disabled={createLearnSession.isPending}>
                              {createLearnSession.isPending ? "Posting..." : "List in Marketplace"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm bg-secondary/10 overflow-hidden">
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">How It Works</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground mt-2">
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <span>Post a skill you can teach and a skill you want to learn.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <span>Browse the marketplace and find someone whose "have" matches your "want".</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <span>Click "Swap" to send them a message. They'll see it in their Alerts.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
                      <span>Connect, set up a time, and both of you grow.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Marketplace Board */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Marketplace</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Browse what the chevra has to offer and swap skills.</p>
                </div>
                {skillSwapPosts.length > 0 && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">{skillSwapPosts.length} listing{skillSwapPosts.length !== 1 ? "s" : ""}</Badge>
                )}
              </div>

              {sessionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-44 rounded-xl bg-secondary/30 animate-pulse" />)}
                </div>
              ) : skillSwapPosts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                  <Repeat2 className="w-12 h-12 mx-auto text-muted-foreground opacity-10 mb-3" />
                  <p className="font-bold text-lg">No listings yet</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Be the first to post a skill swap and set the marketplace in motion.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillSwapPosts.map((post: any) => {
                    const wantMatch = post.description?.match(/Want to learn:\s*([^·]+)/);
                    const wantSkill = wantMatch ? wantMatch[1].trim() : null;
                    const extraDetails = post.description?.replace(/Want to learn:[^·]*/, "").replace(/^·\s*/, "").trim();
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors h-full">
                          <CardContent className="p-5 flex flex-col h-full">
                            <div className="flex items-center gap-2.5 mb-4">
                              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                {post.hostName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{post.hostName}</p>
                                <p className="text-xs text-muted-foreground">Listed a swap</p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4 flex-1">
                              <div className="px-3 py-2 rounded-lg bg-primary/8 border border-primary/15">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Can Teach</p>
                                <p className="text-sm font-semibold text-foreground">{post.title}</p>
                              </div>
                              {wantSkill && (
                                <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Wants to Learn</p>
                                  <p className="text-sm font-semibold text-foreground">{wantSkill}</p>
                                </div>
                              )}
                              {extraDetails && (
                                <p className="text-xs text-muted-foreground px-1 leading-relaxed">{extraDetails}</p>
                              )}
                            </div>

                            {post.hostUserId === myUserId ? (
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-primary font-medium">Your listing — others can reach you via Alerts.</p>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteListing(post.id)}
                                  title="Remove listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="flex-1" variant="secondary">
                                      <Repeat2 className="w-3.5 h-3.5 mr-1.5" /> Swap
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Connect with {post.hostName}</DialogTitle>
                                      <DialogDescription>They'll receive a notification so you can arrange your swap.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3 pt-2">
                                      <Textarea
                                        id={`swap-msg-${post.id}`}
                                        placeholder={`Shalom ${post.hostName}! I see you can teach ${post.title} — I'd love to swap with you...`}
                                        className="resize-none"
                                        rows={4}
                                      />
                                      <DialogFooter>
                                        <Button id={`close-swap-${post.id}`} type="button" variant="outline">Cancel</Button>
                                        <Button
                                          onClick={() => {
                                            const msg = (document.getElementById(`swap-msg-${post.id}`) as HTMLTextAreaElement)?.value ?? "";
                                            handleRespondToRequest(post.id, msg, `close-swap-${post.id}`);
                                          }}
                                          disabled={respondToSession.isPending}
                                        >
                                          {respondToSession.isPending ? "Sending..." : "Send Swap Request"}
                                        </Button>
                                      </DialogFooter>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                {amAdmin && (
                                  <>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDeleteListing(post.id)}
                                      title="Admin: remove listing"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleBanUser(post.hostUserId, post.hostName)}
                                      title="Admin: ban this user"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SECTION: Lishma */}
        {activeSection === "lishma" && (
          <motion.div
            key="lishma"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto"
          >
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="browse" className="text-base">Browse Opportunities</TabsTrigger>
                <TabsTrigger value="host" className="text-base">Host a Session</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                <div className="flex gap-2 pb-4 overflow-x-auto">
                  {["All", "Beginner", "Intermediate", "Advanced"].map(level => (
                    <Button
                      key={level}
                      variant={levelFilter === level ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setLevelFilter(level)}
                      className="rounded-full shrink-0"
                    >
                      {level}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLishma.map(session => {
                    const isRegistered = lishmaRegistrations.some((r: any) => r.id === session.id);
                    return (
                      <Card key={session.id} className="border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors shadow-sm">
                        <div className="h-40 w-full relative">
                          {session.image ? (
                            <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-muted-foreground opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border hover:bg-background">{session.topic}</Badge>
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">{session.level}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h4 className="font-bold text-lg leading-tight mb-3 flex-1">{session.title}</h4>
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
                                {session.hostAvatar}
                              </div>
                              <span className="font-medium text-foreground">{session.host}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{session.date}</span>
                              <span>{session.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                              <Users2 className="w-3.5 h-3.5" />
                              {session.registered} / {session.capacity}
                            </div>
                            <Button
                              variant={isRegistered ? "secondary" : "default"}
                              size="sm"
                              disabled={isRegistered}
                              onClick={() => handleRegisterLishma(session)}
                            >
                              {isRegistered ? "Registered" : "Register"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="host">
                <Card className="border-border shadow-sm max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl">Host a Lishma Session</CardTitle>
                    <CardDescription className="text-primary font-medium mt-1 italic">
                      "Sharing what you know is one of the highest forms of avodah."
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleHostSession(e, "lishma")} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Topic / Title</Label>
                        <Input name="topic" required placeholder="e.g. Overview of Hilchos Shabbos" className="bg-secondary/20 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" required placeholder="What will participants learn?" className="bg-secondary/20 min-h-[100px]" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input name="date" type="date" required className="bg-secondary/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input name="time" type="time" required className="bg-secondary/20" />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Select name="duration" defaultValue="45 min">
                            <SelectTrigger className="bg-secondary/20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30 min">30 min</SelectItem>
                              <SelectItem value="45 min">45 min</SelectItem>
                              <SelectItem value="60 min">60 min</SelectItem>
                              <SelectItem value="90 min">90 min</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Max Participants</Label>
                          <Input name="capacity" type="number" defaultValue="50" required className="bg-secondary/20" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Level</Label>
                          <Select name="level" defaultValue="All">
                            <SelectTrigger className="bg-secondary/20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Levels</SelectItem>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" size="lg" className="w-full text-lg h-14 mt-4" disabled={createLearnSession.isPending}>
                        {createLearnSession.isPending ? "Creating..." : "Create Session"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* SECTION: Study Sessions */}
        {activeSection === "study" && (
          <motion.div
            key="study"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto"
          >
            {/* Hosted sessions submitted by real users */}
            {studySessionsAll.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studySessionsAll.map((session: any) => (
                  <Card key={session.id} className="border-border transition-colors shadow-sm bg-card hover:border-primary/50">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary">{session.level}</Badge>
                      </div>
                      <h4 className="font-bold text-xl mb-1">{session.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Host: {session.hostName}</p>
                      <p className="text-xs text-muted-foreground mb-6">{session.date}{session.time ? ` at ${session.time}` : ""}</p>
                      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {session.capacity} spots
                        </span>
                        <Button variant="outline" size="sm" onClick={() => toast.success("Registered!", { description: "You'll receive a reminder closer to the time." })}>
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                <Video className="w-10 h-10 mx-auto text-muted-foreground opacity-20 mb-3" />
                <p className="font-bold text-lg">No sessions scheduled yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Be the first to host a session or suggest a topic below.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Host a Study Session</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Host a Study Session</DialogTitle>
                    <DialogDescription>Anyone can host — tutor-led or peer discussion.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => handleHostSession(e, "study")} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Topic / Title</Label>
                      <Input name="topic" required placeholder="e.g. Intro to Mishnah Brachos" className="bg-secondary/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input name="date" type="date" className="bg-secondary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input name="time" type="time" className="bg-secondary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select name="duration" defaultValue="45 min">
                          <SelectTrigger className="bg-secondary/20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30 min">30 min</SelectItem>
                            <SelectItem value="45 min">45 min</SelectItem>
                            <SelectItem value="60 min">60 min</SelectItem>
                            <SelectItem value="90 min">90 min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Level</Label>
                        <Select name="level" defaultValue="All">
                          <SelectTrigger className="bg-secondary/20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Levels</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Format</Label>
                        <Select name="format" defaultValue="peer">
                          <SelectTrigger className="bg-secondary/20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tutor">Tutor-led</SelectItem>
                            <SelectItem value="peer">Peer-led</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Max Participants</Label>
                        <Input name="capacity" type="number" defaultValue="20" className="bg-secondary/20" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createLearnSession.isPending}>
                        {createLearnSession.isPending ? "Creating..." : "Create Session"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-dashed">Suggest a Study Session</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suggest a Session</DialogTitle>
                    <DialogDescription>Is there a topic you'd love to see covered in a group setting?</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSuggestSession} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Input name="topic" required placeholder="e.g. Intro to Rashi script" />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Format</Label>
                      <Select name="format" defaultValue="tutor">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tutor">Tutor-led (Expert teaching)</SelectItem>
                          <SelectItem value="peer">Peer-led (Group discussion)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Why would this be valuable?</Label>
                      <Textarea name="reason" required placeholder="A lot of beginners struggle with..." />
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" id="close-suggest-session">Cancel</Button>
                      <Button type="submit">Submit Suggestion</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        )}

        {/* SECTION: Watch & Learn — dead section kept for safety */}
        {(false as boolean) && activeSection === ("watch" as string) && (
          <motion.div
            key="watch"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto"
          >
            {/* Tab toggle: clips vs shiurim */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-0 bg-secondary/50 rounded-lg p-1">
                {(["clips", "shiurim"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setWatchTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                      watchTab === tab
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "clips" ? "Short Clips" : "Full Shiurim"}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setWatchCategory("All")}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    watchCategory === "All"
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {VIDEO_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setWatchCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      watchCategory === cat
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                <Play className="w-10 h-10 mx-auto text-muted-foreground opacity-20 mb-3" />
                <p className="font-bold">No videos in this filter</p>
                <p className="text-sm text-muted-foreground mt-1">Try another category or tab.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map(video => {
                  const isSaved = savedVideos.includes(video.id);
                  return (
                    <motion.div
                      key={video.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group rounded-xl border border-border overflow-hidden bg-card hover:border-primary/40 transition-all shadow-sm flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative aspect-video cursor-pointer overflow-hidden bg-black"
                        onClick={() => setPlayingVideo(video)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {video.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex-1 flex flex-col gap-2">
                        <p
                          className="font-semibold text-sm leading-snug cursor-pointer hover:text-primary transition-colors line-clamp-2"
                          onClick={() => setPlayingVideo(video)}
                        >
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{video.speaker}</p>
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {video.duration}
                          </span>
                          <button
                            onClick={() => toggleSave(video.id)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title={isSaved ? "Remove from saved" : "Save for later"}
                          >
                            {isSaved
                              ? <BookmarkCheck className="w-4 h-4 text-primary" />
                              : <Bookmark className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Video Player Modal */}
      <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0 bg-black border-border">
          <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/10">
            <div className="min-w-0 flex-1 pr-4">
              <DialogTitle className="text-white text-sm font-semibold leading-tight line-clamp-1">
                {playingVideo?.title}
              </DialogTitle>
              <p className="text-xs text-white/50 mt-0.5">{playingVideo?.speaker} · {playingVideo?.channel}</p>
            </div>
            <button
              onClick={() => setPlayingVideo(null)}
              className="text-white/50 hover:text-white transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {playingVideo && (
            <div className="aspect-video w-full">
              <iframe
                key={playingVideo.id}
                src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          {playingVideo && (
            <div className="px-4 py-3 bg-[#111] border-t border-white/10 flex items-center justify-between">
              <p className="text-xs text-white/60 leading-relaxed max-w-xl">
                {playingVideo.description}
              </p>
              <button
                onClick={() => toggleSave(playingVideo.id)}
                className="ml-4 shrink-0 text-white/50 hover:text-amber-400 transition-colors"
              >
                {savedVideos.includes(playingVideo.id)
                  ? <BookmarkCheck className="w-5 h-5 text-amber-400" />
                  : <Bookmark className="w-5 h-5" />
                }
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fake Video Call Modal */}
      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent className="sm:max-w-4xl bg-[#0F0F0F] border-border p-0 overflow-hidden gap-0">
          <div className="p-4 border-b border-white/10 bg-[#1A1A1A] flex justify-between items-center">
            <div>
              <DialogTitle className="text-white text-lg font-medium">{activeSession?.title}</DialogTitle>
              <span className="text-xs text-white/50">{activeSession?.format} • Hosted by {activeSession?.host}</span>
            </div>
            <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">REC</Badge>
          </div>
          <div className="aspect-video bg-black relative flex flex-col">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-1 p-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-md relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <Users className="w-6 h-6 text-white/30" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white/90">
                    Participant {i}
                  </div>
                  {i % 2 === 0 && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1 rounded text-red-400">
                      <MicOff className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
              <div className="bg-[#2A2A2A] rounded-md relative overflow-hidden border border-primary/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-sm font-bold text-primary">You</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white/90">You</div>
              </div>
            </div>
            <div className="h-16 bg-[#1A1A1A] border-t border-white/10 flex items-center justify-center gap-4 px-4">
              <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-10 w-10">
                <MicOff className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-10 w-10">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="destructive" className="rounded-full px-6 h-10 font-medium tracking-wide shadow-lg shadow-red-500/20" onClick={() => setIsJoinModalOpen(false)}>
                <PhoneOff className="w-4 h-4 mr-2" /> Leave
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
