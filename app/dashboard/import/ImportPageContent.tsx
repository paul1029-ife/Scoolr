"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageBody, PageHeader } from "@/components/common/page-header";
import { Metric, MetricGroup } from "@/components/common/metric";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import { commitImport, previewImport } from "@/lib/actions/import";
import { runAction } from "@/lib/actions/run-action";
import {
  ENTITY_DEFINITIONS,
  IMPORT_ENTITIES,
  ImportEntity,
  buildTemplate,
} from "@/lib/import/definitions";
import { MAX_BYTES, MAX_ROWS, type ImportAnalysis } from "@/lib/import/analyse";

const STATUS_STYLE = {
  create: "border-success/20 bg-success-subtle text-success",
  update: "border-primary/20 bg-primary/10 text-primary",
  duplicate: "bg-amber-100 text-amber-800",
  invalid: "border-destructive/20 bg-destructive-subtle text-destructive",
} as const;

const STATUS_LABEL = {
  create: "New",
  update: "Update",
  duplicate: "Duplicate",
  invalid: "Error",
} as const;

function downloadCsv(fileName: string, contents: string) {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ImportPageContent({
  recentImports,
}: {
  recentImports: {
    id: string;
    label: string;
    fileName: string;
    totalRows: number;
    createdCount: number;
    updatedCount: number;
    skippedCount: number;
    createdAt: string;
    importedByName: string | null;
  }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const [entity, setEntity] = useState<ImportEntity | null>(null);
  const [fileName, setFileName] = useState("");
  const [csv, setCsv] = useState("");
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const definition = entity ? ENTITY_DEFINITIONS[entity] : null;

  const reset = () => {
    setFileName("");
    setCsv("");
    setAnalysis(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleFile = async (file: File) => {
    if (!entity) return;

    if (file.size > MAX_BYTES) {
      toast({
        title: "File too large",
        description: `Keep it under ${Math.round(
          MAX_BYTES / 1000
        )}KB — split large rolls into batches.`,
        variant: "destructive",
      });
      return;
    }

    const text = await file.text();
    setFileName(file.name);
    setCsv(text);
    setIsWorking(true);

    const result = await runAction(() => previewImport(entity, text));
    setIsWorking(false);

    if (!result.ok) {
      setAnalysis(null);
      toast({
        title: "Could not read that file",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setAnalysis(result.analysis);
  };

  const handleCommit = async () => {
    if (!entity || !analysis) return;

    setIsWorking(true);
    const result = await runAction(() => commitImport(entity, csv, fileName));
    setIsWorking(false);

    if (!result.ok) {
      toast({
        title: "Import finished with problems",
        description: result.error,
        variant: "destructive",
      });
      reset();
      router.refresh();
      return;
    }

    toast({
      title: "Import complete",
      description: `${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`,
    });
    reset();
    router.refresh();
  };

  // ---- entity picker -------------------------------------------------------

  if (!entity) {
    return (
      <>
        <PageHeader
          title="Import"
          description="Bring existing records in from a spreadsheet"
        />

        <PageBody>
          <p className="mb-5 max-w-2xl text-[13px] text-muted-foreground">
            Download the template, fill it in, and you&apos;ll see exactly what
            will change before anything is saved.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {IMPORT_ENTITIES.map((item) => (
              <button
                key={item.entity}
                type="button"
                onClick={() => setEntity(item.entity)}
                className="group rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-border-strong hover:bg-muted/30"
              >
                <span className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                  <FileSpreadsheet className="size-4" />
                </span>
                <span className="block text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="mt-1 block text-[13px] text-muted-foreground">
                  {item.description}
                </span>
              </button>
            ))}
          </div>

          {recentImports.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-2.5 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
                Recent imports
              </h2>
              <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                  {recentImports.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {job.label} · {job.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {job.importedByName ? ` · ${job.importedByName}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <Badge variant="success">{job.createdCount} new</Badge>
                        <Badge variant="secondary">
                          {job.updatedCount} updated
                        </Badge>
                        {job.skippedCount > 0 && (
                          <Badge variant="outline">
                            {job.skippedCount} skipped
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </PageBody>
      </>
    );
  }

  // ---- upload / preview ----------------------------------------------------

  const importableCount =
    (analysis?.summary.create ?? 0) + (analysis?.summary.update ?? 0);

  return (
    <>
      {/* Not PageHeader: the back control resets local wizard state rather
          than navigating, so it is a button and not a link. */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:px-6">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setEntity(null);
              reset();
            }}
            aria-label="Back to import options"
            className="-ml-1.5 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            Import {definition?.label}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv(
              `scoolr-${entity.toLowerCase()}-template.csv`,
              buildTemplate(entity)
            )
          }
        >
          <Download />
          Download template
        </Button>
      </div>

      <PageBody>
        {/* Expected columns */}
        <Card className="mb-5">
          <CardContent className="pt-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Expected columns
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="pb-2 pr-4">Column</th>
                    <th className="pb-2 pr-4">Required</th>
                    <th className="pb-2 pr-4">Notes</th>
                    <th className="pb-2">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {definition?.columns.map((column) => (
                    <tr key={column.key}>
                      <td className="py-2 pr-4">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {column.key}
                        </code>
                      </td>
                      <td className="py-2 pr-4">
                        {column.required ? (
                          <span className="text-destructive">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {column.hint || "—"}
                      </td>
                      <td className="py-2 text-muted-foreground">{column.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-5">
            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => fileInput.current?.click()}
                disabled={isWorking}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isWorking ? "Reading…" : "Choose CSV file"}
              </Button>
              {fileName && (
                <span className="text-sm text-muted-foreground">{fileName}</span>
              )}
              {analysis && (
                <Button variant="ghost" onClick={reset} disabled={isWorking}>
                  Clear
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Up to {MAX_ROWS.toLocaleString()} rows per file. Nothing is saved
              until you confirm.
            </p>
          </CardContent>
        </Card>

        {/* Preview */}
        {analysis && (
          <>
            <MetricGroup className="mb-4">
              {(
                [
                  ["create", analysis.summary.create, "To create"],
                  ["update", analysis.summary.update, "To update"],
                  ["duplicate", analysis.summary.duplicate, "Duplicates"],
                  ["invalid", analysis.summary.invalid, "Errors"],
                ] as const
              ).map(([key, count, label]) => (
                <Metric key={key} label={label} value={count} />
              ))}
            </MetricGroup>

            {analysis.unknownColumns.length > 0 && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/20 bg-warning-subtle p-3 text-[13px] text-warning">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  These columns aren&apos;t recognised and will be ignored:{" "}
                  <span className="font-medium">
                    {analysis.unknownColumns.join(", ")}
                  </span>
                </span>
              </div>
            )}

            <Card className="mb-6 overflow-hidden">
              <div className="border-b border-border px-5 py-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Preview — {analysis.summary.total} row
                  {analysis.summary.total === 1 ? "" : "s"}
                </h2>
              </div>
              <div className="max-h-[480px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead className="w-16">Line</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      {analysis.columns.map((column) => (
                        <TableHead key={column.key}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.rows.map((row) => (
                      <React.Fragment key={row.line}>
                        <TableRow
                          className={
                            row.status === "invalid" ? "bg-destructive-subtle/60" : undefined
                          }
                        >
                          <TableCell className="text-muted-foreground">
                            {row.line}
                          </TableCell>
                          <TableCell>
                            <Badge className={STATUS_STYLE[row.status]}>
                              {STATUS_LABEL[row.status]}
                            </Badge>
                          </TableCell>
                          {analysis.columns.map((column) => (
                            <TableCell
                              key={column.key}
                              className={
                                row.errors[column.key]
                                  ? "text-destructive"
                                  : undefined
                              }
                            >
                              {row.raw[column.key] || (
                                <span className="text-muted-foreground/50">—</span>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {(Object.keys(row.errors).length > 0 || row.note) && (
                          <TableRow className="bg-muted/40">
                            <TableCell />
                            <TableCell
                              colSpan={analysis.columns.length + 1}
                              className="py-2 text-xs"
                            >
                              {Object.entries(row.errors).map(([key, message]) => (
                                <span
                                  key={key}
                                  className="mr-4 inline-block text-destructive"
                                >
                                  <span className="font-medium">
                                    {key === "_" ? "Row" : key}:
                                  </span>{" "}
                                  {message}
                                </span>
                              ))}
                              {row.note && (
                                <span className="text-muted-foreground">{row.note}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
              <p className="text-sm text-muted-foreground">
                {importableCount > 0 ? (
                  <>
                    <CheckCircle2 className="mr-1 inline h-4 w-4 text-success" />
                    {importableCount} row{importableCount === 1 ? "" : "s"} will
                    be imported.
                    {analysis.summary.invalid + analysis.summary.duplicate >
                      0 && (
                      <>
                        {" "}
                        {analysis.summary.invalid + analysis.summary.duplicate}{" "}
                        will be skipped.
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-1 inline h-4 w-4 text-destructive" />
                    Nothing can be imported — fix the errors and try again.
                  </>
                )}
              </p>
              <Button
                onClick={handleCommit}
                disabled={isWorking || importableCount === 0}
              >
                {isWorking
                  ? "Importing…"
                  : `Import ${importableCount} row${
                      importableCount === 1 ? "" : "s"
                    }`}
              </Button>
            </div>
          </>
        )}
      </PageBody>
    </>
  );
}

export default ImportPageContent;
