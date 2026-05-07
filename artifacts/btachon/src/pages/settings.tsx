import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Trash2, Moon, MapPin, Instagram, ExternalLink, MessageCircle, Mail, Users, Video } from "lucide-react";
import { useShabbos } from "@/hooks/useShabbos";
import { SHABBOS_LOCATIONS, LOCATION_REGIONS, formatTimeInTz, formatRelative } from "@/lib/shabbos";
import { useGetProfile, useUpsertProfile } from "@workspace/api-client-react";

const PROFILE_OPTIONS = [
  { value: "teen_male",     label: "Teen — Boy",        sub: "Ages 13–17" },
  { value: "teen_female",   label: "Teen — Girl",       sub: "Ages 13–17" },
  { value: "single_male",   label: "Single Man",        sub: "Bachur / Young Adult" },
  { value: "single_female", label: "Single Woman",      sub: "Young Adult" },
  { value: "married_male",  label: "Married Man",       sub: "Husband / Father" },
  { value: "married_female",label: "Married Woman",     sub: "Wife / Mother" },
];

export default function Settings() {
  const { currentTier } = useTimeTracking();

  const [profileName, setProfileName] = useLocalStorage("profileName", "Friend");
  const [partnerName, setPartnerName] = useLocalStorage("partnerName", "");
  const [isTutor, setIsTutor] = useLocalStorage("availableAsTutor", false);
  const [profileType, setProfileType] = useLocalStorage("btachon:profileType", "");

  const { data: dbProfile } = useGetProfile();
  const upsertProfile = useUpsertProfile();
  const [zoomLink, setZoomLink] = useState("");
  const [zoomSaved, setZoomSaved] = useState(false);

  // Populate zoom link from DB profile once loaded
  const profileZoomLink = (dbProfile as any)?.zoomLink ?? "";
  const [zoomInit, setZoomInit] = useState(false);
  if (!zoomInit && profileZoomLink) {
    setZoomLink(profileZoomLink);
    setZoomInit(true);
  }

  const handleSaveZoom = async () => {
    try {
      await upsertProfile.mutateAsync({ data: { zoomLink: zoomLink.trim() || null } });
      setZoomSaved(true);
      toast.success("Zoom link saved.");
      setTimeout(() => setZoomSaved(false), 3000);
    } catch {
      toast.error("Could not save Zoom link.");
    }
  };

  const shabbos = useShabbos();

  const handleReset = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("btachon:")) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    toast.success("All data has been reset.");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="border-b border-border/50 px-6 md:px-8 py-8 flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Configure your environment for growth.</p>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">

        {/* Profile */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Your name and accountability details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Your Name</Label>
                <Input id="name" value={profileName} onChange={e => setProfileName(e.target.value)} className="bg-secondary/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Accountability Partner</Label>
                <Input id="partner" value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="e.g. Yossi K." className="bg-secondary/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Current Tier</Label>
                <div className="h-10 px-3 flex items-center bg-secondary/20 text-foreground border border-border/50 rounded-md font-semibold tracking-wide">
                  {currentTier}
                </div>
              </div>
              <div className="flex items-center justify-between border border-border/50 p-4 rounded-xl bg-secondary/20">
                <div>
                  <Label className="text-sm font-bold">Available as Tutor</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Receive learning requests</p>
                </div>
                <Switch checked={isTutor} onCheckedChange={setIsTutor} />
              </div>
            </div>

            {/* Zoom Link */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-primary" />
                <Label className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Your Zoom Link</Label>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                When you accept a learning request, this link is automatically shared with the student.
              </p>
              <div className="flex gap-2">
                <Input
                  value={zoomLink}
                  onChange={e => setZoomLink(e.target.value)}
                  placeholder="https://zoom.us/j/your-meeting-id"
                  className="bg-secondary/30 flex-1"
                />
                <Button
                  onClick={handleSaveZoom}
                  disabled={upsertProfile.isPending || zoomSaved}
                  size="sm"
                  className="shrink-0"
                >
                  {zoomSaved ? "Saved" : upsertProfile.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            {/* Profile Type */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <Label className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Who You Are</Label>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Personalizes your daily Mitzvah actions to your life stage.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROFILE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setProfileType(opt.value); toast.success("Profile updated."); }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      profileType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/20 hover:bg-secondary/40 text-foreground"
                    }`}
                  >
                    <p className="font-bold text-xs leading-tight">{opt.label}</p>
                    <p className={`text-[10px] mt-0.5 ${profileType === opt.value ? "text-primary/70" : "text-muted-foreground"}`}>{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shabbos Mode */}
        <Card className={`shadow-sm border-border border-l-4 relative overflow-hidden ${shabbos.isShabbos ? "border-l-primary" : "border-l-muted"}`}>
          <div className="absolute right-0 top-0 opacity-[0.04] pointer-events-none">
            <Moon className="w-44 h-44 -mr-8 -mt-8" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" /> Shabbos Mode
            </CardTitle>
            <CardDescription>
              From candle lighting to havdalah — streaks freeze, nudges silence. Based on your location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground font-medium text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </Label>
                <Select value={shabbos.locationId} onValueChange={shabbos.setLocationId}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {LOCATION_REGIONS.map(region => (
                      <SelectGroup key={region}>
                        <SelectLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 pt-2">{region}</SelectLabel>
                        {SHABBOS_LOCATIONS.filter(l => l.region === region).map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Mode</Label>
                <Select value={shabbos.override} onValueChange={(v) => shabbos.setOverride(v as "auto" | "on" | "off")}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (zmanim)</SelectItem>
                    <SelectItem value="on">Force On</SelectItem>
                    <SelectItem value="off">Force Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Candle Lighting</p>
                <p className="text-base font-bold text-foreground mt-1.5">
                  {formatTimeInTz(shabbos.window.candleLighting, shabbos.location.tz)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(shabbos.minutesUntilCandleLighting)}</p>
              </div>
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Havdalah</p>
                <p className="text-base font-bold text-foreground mt-1.5">
                  {formatTimeInTz(shabbos.window.havdalah, shabbos.location.tz)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(shabbos.minutesUntilHavdalah)}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${shabbos.isShabbos ? "border-primary/40 bg-primary/5" : "border-border/50 bg-secondary/20"}`}>
              <p className="text-sm font-bold text-foreground">
                {shabbos.isShabbos ? "Shabbos Mode active" : "Weekday — full app available"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Candle lighting is 18 min before sunset. Havdalah is 50 min after sunset on Motzei Shabbos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Connect with Btachon */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> Connect with Btachon
            </CardTitle>
            <CardDescription>Follow us, send feedback, or reach out directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://instagram.com/btachon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">@btachon</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Follow us on Instagram</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>

            <a
              href="https://instagram.com/btachon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Contact Us</p>
                  <p className="text-xs text-muted-foreground mt-0.5">DM us on Instagram — we read every message</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>

            <a
              href="mailto:info.btachon@gmail.com"
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">info.btachon@gmail.com</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Send us an email</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          </CardContent>
        </Card>

        {/* Data Management */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Data</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 h-12">
                  <Trash2 className="w-4 h-4 mr-2" /> Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your progress, habits, commitments, and settings from this device. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
