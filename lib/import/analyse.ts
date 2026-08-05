import Papa from "papaparse";

import {
  ENTITY_DEFINITIONS,
  type ImportEntity,
} from "@/lib/import/definitions";

/** Guards the server action payload; a school roll is well under this. */
export const MAX_ROWS = 2000;
export const MAX_BYTES = 1_000_000;

export type RowStatus = "create" | "update" | "invalid" | "duplicate";

export type AnalysedRow = {
  /** 1-based line number in the file, counting the header — what the user sees. */
  line: number;
  status: RowStatus;
  /** Column key -> message, so the UI can point at the offending cell. */
  errors: Record<string, string>;
  /** Raw cell values, for the preview table. */
  raw: Record<string, string>;
  /** Parsed value; only present when the row is importable. */
  value?: Record<string, unknown>;
  identity: string;
  note?: string;
};

export type ImportAnalysis = {
  entity: ImportEntity;
  columns: { key: string; label: string }[];
  /** Headers in the file that the importer does not recognise. */
  unknownColumns: string[];
  missingColumns: string[];
  rows: AnalysedRow[];
  summary: {
    total: number;
    create: number;
    update: number;
    invalid: number;
    duplicate: number;
  };
};

export type AnalysisFailure = { ok: false; error: string };

/**
 * Turns a CSV into a per-row verdict.
 *
 * `existing` maps an identity (admission number, email, …) to what is already
 * stored, so a row can be reported as an update rather than silently creating a
 * second record. Nothing is written here — this drives the preview.
 */
export function analyseCsv({
  entity,
  csv,
  existing,
}: {
  entity: ImportEntity;
  csv: string;
  existing: Set<string>;
}): ImportAnalysis | AnalysisFailure {
  const definition = ENTITY_DEFINITIONS[entity];

  if (csv.length > MAX_BYTES) {
    return {
      ok: false,
      error: `That file is larger than ${Math.round(
        MAX_BYTES / 1000
      )}KB. Split it into smaller batches.`,
    };
  }

  const parsed = Papa.parse<Record<string, string>>(csv.trim(), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  const headers = parsed.meta.fields ?? [];

  if (headers.length === 0) {
    return { ok: false, error: "That file has no header row." };
  }

  const known = new Set(definition.columns.map((c) => c.key));
  const required = definition.columns.filter((c) => c.required).map((c) => c.key);

  const missingColumns = required.filter((key) => !headers.includes(key));
  if (missingColumns.length > 0) {
    return {
      ok: false,
      error: `Missing required column${
        missingColumns.length === 1 ? "" : "s"
      }: ${missingColumns.join(", ")}. Download the template to see the expected format.`,
    };
  }

  if (parsed.data.length === 0) {
    return { ok: false, error: "That file has a header but no rows." };
  }

  if (parsed.data.length > MAX_ROWS) {
    return {
      ok: false,
      error: `That file has ${parsed.data.length} rows; the limit is ${MAX_ROWS}. Split it into smaller batches.`,
    };
  }

  const rows: AnalysedRow[] = [];
  // Identities already claimed by an earlier row in this same file.
  const seenInFile = new Map<string, number>();

  parsed.data.forEach((raw, index) => {
    // +2: one for the header line, one because humans count from 1.
    const line = index + 2;
    const result = definition.schema.safeParse(raw);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "_");
        // Keep the first message per column; later ones are usually noise.
        errors[key] ??= issue.message;
      }

      rows.push({
        line,
        status: "invalid",
        errors,
        raw,
        identity: definition.identity(raw),
      });
      return;
    }

    const value = result.data as Record<string, unknown>;
    const identity = definition.identity(value);

    if (!identity) {
      rows.push({
        line,
        status: "invalid",
        errors: { _: `Could not read the ${definition.identityLabel}.` },
        raw,
        identity: "",
      });
      return;
    }

    const firstSeenAt = seenInFile.get(identity);
    if (firstSeenAt !== undefined) {
      rows.push({
        line,
        status: "duplicate",
        errors: {},
        raw,
        identity,
        note: `Same ${definition.identityLabel} as line ${firstSeenAt}. This row will be skipped.`,
      });
      return;
    }

    seenInFile.set(identity, line);

    rows.push({
      line,
      status: existing.has(identity) ? "update" : "create",
      errors: {},
      raw,
      value,
      identity,
      note: existing.has(identity)
        ? `Already in Scoolr — the existing record will be updated.`
        : undefined,
    });
  });

  return {
    entity,
    columns: definition.columns.map((c) => ({ key: c.key, label: c.label })),
    unknownColumns: headers.filter((header) => !known.has(header)),
    missingColumns: [],
    rows,
    summary: {
      total: rows.length,
      create: rows.filter((r) => r.status === "create").length,
      update: rows.filter((r) => r.status === "update").length,
      invalid: rows.filter((r) => r.status === "invalid").length,
      duplicate: rows.filter((r) => r.status === "duplicate").length,
    },
  };
}
