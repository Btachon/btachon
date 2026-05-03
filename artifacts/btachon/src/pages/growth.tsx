import { useState } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Target, Heart, Music, Book, Dumbbell, ChevronRight, Flame, Trophy, Star, Trash2, CheckCircle2, Circle, Pencil } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

interface GrowthGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  target: number;
  unit: string;
  streak: number;
  completedDays: string[];
  createdAt: string;
}

interface Hobby {
  id: string;
  name: string;
  category: string;
  notes: string;
  lastPracticed: string | null;
  frequency: string;
}

const GOAL_CATEGORIES = [
  { id: "tefilla", label: "Tefilla", icon: Star },
  { id: "learning", label: "Torah Learning", icon: Book },
  { id: "health", label: "Health & Fitness", icon: Dumbbell },
  { id: "middos", label: "Middos", icon: Heart },
  { id: "creative", label: "Creative", icon: Music },
  { id: "other", label: "Other", icon: Target },
];

const HOBBY_CATEGORIES = ["Arts & Crafts", "Music", "Sports", "Cooking", "Reading", "Technology", "Nature", "Other"];

const today = new Date().toISOString().split("T")[0];

export default function Growth() {
  const { user } = useAuth();
  const [goals, setGoals] = useLocalStorage<GrowthGoal[]>(`btachon:growth:goals:${user?.id}`, []);
  const [hobbies, setHobbies] = useLocalStorage<Hobby[]>(`btachon:growth:hobbies:${user?.id}`, []);
  const [activeTab, setActiveTab] = useState<"goals" | "hobbies">("goals");
  const [editingGoal, setEditingGoal] = useState<GrowthGoal | null>(null);

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newGoal: GrowthGoal = {
      id: `goal_${Date.now()}`,
      title: form.get("title") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      progress: 0,
      target: parseInt(form.get("target") as string) || 30,
      unit: form.get("unit") as string || "days",
      streak: 0,
      completedDays: [],
      createdAt: today,
    };
    setGoals([...goals, newGoal]);
    toast.success("Goal added!");
    document.getElementById("close-add-goal")?.click();
  };

  const handleUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGoal) return;
    const form = new FormData(e.currentTarget);
    setGoals(goals.map(g => g.id === editingGoal.id ? {
      ...g,
      title: form.get("title") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      target: parseInt(form.get("target") as string) || g.target,
      unit: form.get("unit") as string || g.unit,
    } : g));
    setEditingGoal(null);
    toast.success("Goal updated!");
  };

  const handleCheckIn = (goalId: string) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      if (g.completedDays.includes(today)) {
        toast("Already checked in today");
        return g;
      }
      const newDays = [...g.completedDays, today];
      const newProgress = Math.min(g.progress + 1, g.target);
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = g.completedDays.includes(yesterday) ? g.streak + 1 : 1;
      if (newProgress >= g.target) toast.success("Goal complete!", { description: "Mazel tov!" });
      else toast.success("Checked in!", { description: `${newStreak} day streak` });
      return { ...g, completedDays: newDays, progress: newProgress, streak: newStreak };
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    toast.success("Goal removed");
  };

  const handleAddHobby = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newHobby: Hobby = {
      id: `hobby_${Date.now()}`,
      name: form.get("name") as string,
      category: form.get("category") as string,
      notes: form.get("notes") as string,
      lastPracticed: null,
      frequency: form.get("frequency") as string,
    };
    setHobbies([...hobbies, newHobby]);
    toast.success("Hobby added!");
    document.getElementById("close-add-hobby")?.click();
  };

  const handlePracticed = (hobbyId: string) => {
    setHobbies(hobbies.map(h => h.id === hobbyId ? { ...h, lastPracticed: today } : h));
    toast.success("Logged!");
  };

  const handleDeleteHobby = (hobbyId: string) => {
    setHobbies(hobbies.filter(h => h.id !== hobbyId));
    toast.success("Hobby removed");
  };

  const getCategoryIcon = (catId: string) => {
    const cat = GOAL_CATEGORIES.find(c => c.id === catId);
    return cat ? cat.icon : Target;
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative h-40 bg-gradient-to-br from-background to-secondary/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(35_65%_62%/0.08),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl font-bold tracking-tight">Personal Growth</h1>
          <p className="text-muted-foreground mt-1">Track your goals, habits, and what brings you joy</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-8 pt-6 max-w-5xl mx-auto">
        <div className="flex gap-2 border-b border-border pb-0 mb-6">
          {(["goals", "hobbies"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-colors relative ${
                activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "goals" ? "Growth Goals" : "Hobbies & Interests"}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === "goals" && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {goals.length === 0 ? "Set a goal to get started" : `${goals.length} active goal${goals.length !== 1 ? "s" : ""}`}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1.5" /> Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Growth Goal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGoal} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Goal Title</Label>
                      <Input name="title" required placeholder="e.g. Daven Shacharis every day" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Textarea name="description" placeholder="Why is this important to you?" className="resize-none" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select name="category" defaultValue="other">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {GOAL_CATEGORIES.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Target (days)</Label>
                        <Input name="target" type="number" defaultValue="30" min="1" max="365" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Unit label</Label>
                      <Input name="unit" defaultValue="days" placeholder="days / sessions / pages..." />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" id="close-add-goal">Cancel</Button>
                      <Button type="submit">Add Goal</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No goals yet</p>
                <p className="text-sm mt-1">Add your first growth goal to start tracking</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal, i) => {
                  const Icon = getCategoryIcon(goal.category);
                  const pct = Math.round((goal.progress / goal.target) * 100);
                  const checkedToday = goal.completedDays.includes(today);
                  const isComplete = goal.progress >= goal.target;
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className={`border-border ${isComplete ? "border-primary/40 bg-primary/5" : ""}`}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isComplete ? "bg-primary/20" : "bg-secondary"} border border-border`}>
                                <Icon className={`w-4 h-4 ${isComplete ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm leading-tight">{goal.title}</h3>
                                {goal.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{goal.description}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {isComplete && <Trophy className="w-4 h-4 text-primary" />}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={() => setEditingGoal(goal)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteGoal(goal.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{goal.progress} / {goal.target} {goal.unit}</span>
                              <span>{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Flame className={`w-3.5 h-3.5 ${goal.streak > 0 ? "text-orange-500" : ""}`} />
                              <span>{goal.streak} day streak</span>
                            </div>
                            <Button
                              size="sm"
                              variant={checkedToday ? "secondary" : "default"}
                              className="h-8 text-xs"
                              disabled={isComplete}
                              onClick={() => handleCheckIn(goal.id)}
                            >
                              {checkedToday ? (
                                <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Done today</>
                              ) : (
                                <><Circle className="w-3.5 h-3.5 mr-1" /> Check in</>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "hobbies" && (
          <motion.div
            key="hobbies"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {hobbies.length === 0 ? "What brings you joy?" : `${hobbies.length} interest${hobbies.length !== 1 ? "s" : ""}`}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1.5" /> Add Hobby
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add a Hobby or Interest</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddHobby} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input name="name" required placeholder="e.g. Playing guitar, hiking..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select name="category" defaultValue="Other">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {HOBBY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select name="frequency" defaultValue="weekly">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="whenever">Whenever</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Textarea name="notes" placeholder="Any notes about this hobby..." className="resize-none" rows={2} />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" id="close-add-hobby">Cancel</Button>
                      <Button type="submit">Add</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {hobbies.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No hobbies yet</p>
                <p className="text-sm mt-1">Add things you enjoy or want to explore</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {hobbies.map((hobby, i) => {
                  const practicedToday = hobby.lastPracticed === today;
                  return (
                    <motion.div
                      key={hobby.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="border-border hover:border-primary/40 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold">{hobby.name}</h3>
                              <Badge variant="secondary" className="text-[10px] mt-1">{hobby.category}</Badge>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                              onClick={() => handleDeleteHobby(hobby.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          {hobby.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{hobby.notes}</p>}
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground capitalize">{hobby.frequency}</span>
                            <Button
                              size="sm"
                              variant={practicedToday ? "secondary" : "outline"}
                              className="h-7 text-xs"
                              onClick={() => handlePracticed(hobby.id)}
                            >
                              {practicedToday ? "Logged today" : "Log practice"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Edit Goal Dialog */}
      {editingGoal && (
        <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateGoal} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input name="title" required defaultValue={editingGoal.title} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" defaultValue={editingGoal.description} className="resize-none" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" defaultValue={editingGoal.category}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GOAL_CATEGORIES.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Input name="target" type="number" defaultValue={editingGoal.target} min="1" max="365" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input name="unit" defaultValue={editingGoal.unit} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
