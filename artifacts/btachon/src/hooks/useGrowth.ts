import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { customFetch, getGetProfileQueryKey, useGetProfile } from "@workspace/api-client-react";

export type GrowthKind =
  | "daily_practice_mitzvah"
  | "daily_practice_learn"
  | "daily_practice_geulah"
  | "daily_practice_chai"
  | "tefillah_davened"
  | "tehillim_chapter"
  | "learn_session_complete";

type AwardResult = {
  awarded: number;
  growthPoints: number;
  currentStreak: number;
  longestStreak?: number;
  duplicate?: boolean;
};

export function useGrowth() {
  const qc = useQueryClient();
  const { data: profile } = useGetProfile({ query: { queryKey: getGetProfileQueryKey() } });
  const p = profile as any;

  const award = useCallback(
    async (kind: GrowthKind, key: string): Promise<AwardResult | null> => {
      try {
        const result = await customFetch<AwardResult>("/api/growth/award", {
          method: "POST",
          body: JSON.stringify({ kind, key }),
          responseType: "json",
        });
        qc.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        return result;
      } catch {
        return null;
      }
    },
    [qc],
  );

  return {
    growthPoints: (p?.growthPoints as number | undefined) ?? 0,
    currentStreak: (p?.currentStreak as number | undefined) ?? 0,
    longestStreak: (p?.longestStreak as number | undefined) ?? 0,
    award,
  };
}
