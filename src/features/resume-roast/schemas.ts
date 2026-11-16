import { z } from "zod";

export const roastIntensityEnum = z.enum(["lembut", "sedang", "brutal"]);
export type RoastIntensity = z.infer<typeof roastIntensityEnum>;

export const roastResultSchema = z.object({
  openingRoast: z
    .string()
    .describe(
      "Pembuka roasting yang menohok dan langsung ke point. 1-2 kalimat.",
    ),
  brutalSummary: z
    .string()
    .describe("Ringkasan singkat dan tajam tentang resume secara keseluruhan."),
  sectionRoasts: z
    .array(
      z.object({
        section: z
          .string()
          .describe(
            "Nama section yang di-roast (misal: Personal Info, Experience, Skills).",
          ),
        roast: z
          .string()
          .describe("Roast spesifik untuk section ini, lucu dan sarkastik."),
      }),
    )
    .min(3)
    .max(7),
  uniqueProblems: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "Masalah-masalah unik yang dideteksi, ditulis dengan gaya sarkasme.",
    ),
  silverLining: z
    .string()
    .describe(
      "Satu-satunya hal positif (kalau ada), atau hiburan halus di akhir. Tetap dalam nada bercanda.",
    ),
  finalVerdict: z
    .string()
    .describe(
      "Kesimpulan akhir dengan rating ngawur (misal: '3.5 dari 10 alpaca').",
    ),
  brutalScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Skor 'kebrutalan' resume — semakin rendah semakin parah."),
});

export type RoastResult = z.infer<typeof roastResultSchema>;
