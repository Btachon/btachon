import { motion } from "framer-motion";
import { LIFE_STAGES, type LifeStageId, type LifeStage } from "@/data/lifeStages";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface LifeStageSetupProps {
  onSelect: (id: LifeStageId) => void;
}

export function LifeStageSetup({ onSelect }: LifeStageSetupProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold text-primary">?</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Who are you right now?</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8">
          Pick the stage that fits your life today. Your habits and daily actions will be tailored just for you. You can change this any time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LIFE_STAGES.map((stage, i) => (
          <motion.button
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(stage.id)}
            className="group text-left p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {stage.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{stage.tagline}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

interface LifeStageBadgeProps {
  stage: LifeStage;
  onEdit: () => void;
}

export function LifeStageBadge({ stage, onEdit }: LifeStageBadgeProps) {
  return (
    <button
      onClick={onEdit}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/15 transition-colors"
    >
      {stage.label}
      <Pencil className="w-3 h-3 opacity-60" />
    </button>
  );
}
