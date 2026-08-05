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
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
  duplicate: "bg-amber-100 text-amber-800",
  invalid: "bg-red-100 text-red-800",
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
      <div className="mx-auto space-y-8">
        <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
          <h1 className="text-md font-medium tracking-tight">Import Data</h1>
        </div>

        <div className="px-3">
          <p className="mb-6 max-w-2xl text-sm text-gray-600">
            Bring existing records in from a spreadsheet. Download the template,
            fill it in, and you&apos;ll see exactly what will change before
            anything is saved.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {IMPORT_ENTITIES.map((item) => (
              <Card
                key={item.entity}
                className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => setEntity(item.entity)}
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="font-medium text-gray-900">{item.label}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {recentImports.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Recent imports
              </h2>
              <Card className="border-0 shadow-sm">
                <div className="divide-y">
                  {recentImports.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {job.label} · {job.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {job.importedByName ? ` · ${job.importedByName}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <Badge className="bg-green-100 text-green-800">
                          {job.createdCount} new
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {job.updatedCount} updated
                        </Badge>
                        {job.skippedCount > 0 && (
                          <Badge className="bg-gray-100 text-gray-700">
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
        </div>
      </div>
    );
  }

  // ---- upload / preview ----------------------------------------------------

  const importableCount =
    (analysis?.summary.create ?? 0) + (analysis?.summary.update ?? 0);

  return (
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEntity(null);
              reset();
            }}
            aria-label="Back to import options"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-md font-medium tracking-tight">
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
          <Download className="mr-2 h-4 w-4" />
          Download template
        </Button>
      </div>

      <div className="px-3">
        {/* Expected columns */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Expected columns
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
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
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                          {column.key}
                        </code>
                      </td>
                      <td className="py-2 pr-4">
                        {column.required ? (
                          <span className="text-red-600">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {column.hint || "—"}
                      </td>
                      <td className="py-2 text-gray-600">{column.example}</td>
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isWorking ? "Reading…" : "Choose CSV file"}
              </Button>
              {fileName && (
                <span className="text-sm text-gray-600">{fileName}</span>
              )}
              {analysis && (
                <Button variant="ghost" onClick={reset} disabled={isWorking}>
                  Clear
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Up to {MAX_ROWS.toLocaleString()} rows per file. Nothing is saved
              until you confirm.
            </p>
          </CardContent>
        </Card>

        {/* Preview */}
        {analysis && (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {(
                [
                  ["create", analysis.summary.create, "To create"],
                  ["update", analysis.summary.update, "To update"],
                  ["duplicate", analysis.summary.duplicate, "Duplicates"],
                  ["invalid", analysis.summary.invalid, "Errors"],
                ] as const
              ).map(([key, count, label]) => (
                <Card key={key} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {count}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {analysis.unknownColumns.length > 0 && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  These columns aren&apos;t recognised and will be ignored:{" "}
                  <span className="font-medium">
                    {analysis.unknownColumns.join(", ")}
                  </span>
                </span>
              </div>
            )}

            <Card className="mb-6 border-0 shadow-sm overflow-hidden">
              <div className="border-b bg-gray-100 px-5 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Preview — {analysis.summary.total} row
                  {analysis.summary.total === 1 ? "" : "s"}
                </h2>
              </div>
              <div className="max-h-[480px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
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
                            row.status === "invalid" ? "bg-red-50/50" : undefined
                          }
                        >
                          <TableCell className="text-gray-500">
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
                                  ? "text-red-700"
                                  : undefined
                              }
                            >
                              {row.raw[column.key] || (
                                <span className="text-gray-300">—</span>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {(Object.keys(row.errors).length > 0 || row.note) && (
                          <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell
                              colSpan={analysis.columns.length + 1}
                              className="py-2 text-xs"
                            >
                              {Object.entries(row.errors).map(([key, message]) => (
                                <span
                                  key={key}
                                  className="mr-4 inline-block text-red-700"
                                >
                                  <span className="font-medium">
                                    {key === "_" ? "Row" : key}:
                                  </span>{" "}
                                  {message}
                                </span>
                              ))}
                              {row.note && (
                                <span className="text-gray-600">{row.note}</span>
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
              <p className="text-sm text-gray-600">
                {importableCount > 0 ? (
                  <>
                    <CheckCircle2 className="mr-1 inline h-4 w-4 text-green-600" />
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
                    <AlertCircle className="mr-1 inline h-4 w-4 text-red-600" />
                    Nothing can be imported — fix the errors and try again.
                  </>
                )}
              </p>
              <Button
                onClick={handleCommit}
                disabled={isWorking || importableCount === 0}
                className="bg-blue-600 hover:bg-blue-700"
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
      </div>
    </div>
  );
}

export default ImportPageContent;
