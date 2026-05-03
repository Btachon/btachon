import { useState, useEffect } from "react";

interface HebrewDateInfo {
  hebrewDate: string;
  hebrewYear: string;
  parsha: string | null;
  isLoading: boolean;
}

export function useHebrewDate(): HebrewDateInfo {
  const [info, setInfo] = useState<HebrewDateInfo>({
    hebrewDate: "",
    hebrewYear: "",
    parsha: null,
    isLoading: true,
  });

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateParam = `${yyyy}-${mm}-${dd}`;

    Promise.all([
      fetch(`https://www.hebcal.com/converter?cfg=json&date=${dateParam}&g2h=1&strict=1`).then(r => r.json()),
      fetch(`https://www.hebcal.com/shabbat?cfg=json&geo=none&m=50`).then(r => r.json()),
    ])
      .then(([dateData, shabbatData]) => {
        const hebrewDate: string = dateData.hebrew ?? "";
        const hebrewYear: string = dateData.hy ? String(dateData.hy) : "";

        let parsha: string | null = null;
        if (shabbatData?.items) {
          const parshaItem = shabbatData.items.find(
            (item: { category: string; title: string }) => item.category === "parashat"
          );
          if (parshaItem) {
            parsha = parshaItem.title.replace(/^Parashat\s+/i, "").replace(/^Parasha\s+/i, "");
          }
        }

        setInfo({ hebrewDate, hebrewYear, parsha, isLoading: false });
      })
      .catch(() => {
        setInfo(prev => ({ ...prev, isLoading: false }));
      });
  }, []);

  return info;
}
