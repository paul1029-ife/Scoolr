"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  Receipt,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Metric, MetricGroup } from "@/components/common/metric";
import { PageBody, PageHeader } from "@/components/common/page-header";

import { PaymentModal, type StudentOption } from "./PaymentModal";
import { useCan } from "@/components/auth/permissions-provider";
import {
  PaymentStatus,
  collectionRate,
  formatNaira,
  formatNairaCompact,
  paymentStatusLabel,
  type BillingOverview,
} from "@/types/billing";

export function BillingsPageContent({
  overview,
  students,
}: {
  overview: BillingOverview;
  students: StudentOption[];
}) {
  const router = useRouter();
  const canManage = useCan("billing:manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    payments,
    feeStructure,
    totalExpected,
    totalCollected,
    terms,
    selectedTermId,
  } = overview;

  const rate = collectionRate(totalCollected, totalExpected);
  const outstanding = Math.max(totalExpected - totalCollected, 0);

  const query = searchTerm.toLowerCase();
  const filteredPayments = payments.filter(
    (payment) =>
      payment.studentName.toLowerCase().includes(query) ||
      (payment.className ?? "").toLowerCase().includes(query) ||
      payment.reference.toLowerCase().includes(query)
  );

  // The term lives in the URL so the server can scope the query to it.
  const handleTermChange = (termId: string) => {
    startTransition(() => {
      router.push(`/dashboard/billings?term=${termId}`);
    });
  };

  const classRooms = feeStructure.map((fee) => ({
    id: fee.classRoomId,
    name: fee.className,
  }));

  return (
    <>
      <PageHeader
        title="Billing"
        description="Fees expected, collected and outstanding"
        actions={
          <>
            <Button variant="outline">
              <Download />
              <span className="max-sm:sr-only">Export report</span>
            </Button>
            {canManage && (
              <Button onClick={() => setIsPaymentModalOpen(true)}>
                <PlusCircle />
                Record payment
              </Button>
            )}
          </>
        }
      />
      <PageBody>
        <MetricGroup columns={3} className="mb-5">
          <Metric
            label="Total collected"
            value={formatNairaCompact(totalCollected)}
          />
          <Metric
            label="Collection rate"
            value={rate === null ? "—" : `${rate.toFixed(1)}%`}
          />
          <Metric
            label="Outstanding"
            value={formatNairaCompact(outstanding)}
          />
        </MetricGroup>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">Recent Payments</h2>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search payments..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={selectedTermId ?? undefined}
                      onValueChange={handleTermChange}
                      disabled={terms.length === 0 || isPending}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {terms.map((term) => (
                            <SelectItem key={term.id} value={term.id}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-10"
                        >
                          {payments.length === 0
                            ? "No payments recorded for this term yet."
                            : "No payments match your search."}
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            {payment.reference}
                          </div>
                        </TableCell>
                        <TableCell>{payment.studentName}</TableCell>
                        <TableCell>{payment.className ?? "—"}</TableCell>
                        <TableCell>{formatNaira(payment.amount)}</TableCell>
                        <TableCell>
                          {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              payment.status === PaymentStatus.PAID
                                ? "border-success/20 bg-success-subtle text-success"
                                : "border-warning/20 bg-warning-subtle text-warning"
                            }
                          >
                            {payment.status === PaymentStatus.PAID ? (
                              <ChevronUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            )}
                            {paymentStatusLabel[payment.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Fee Structure</h2>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {feeStructure.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No classes set up yet.
                  </p>
                )}
                {feeStructure.map((fee) => {
                  const classRate = collectionRate(fee.collected, fee.expected);

                  return (
                    <div
                      key={fee.classRoomId}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3>{fee.className}</h3>
                        <Badge variant="outline">
                          {fee.totalStudents}{" "}
                          {fee.totalStudents === 1 ? "student" : "students"}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Termly Fee:{" "}
                        {fee.termlyFee > 0 ? formatNaira(fee.termlyFee) : "Not set"}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Collection Rate</span>
                        <span className="font-medium">
                          {classRate === null
                            ? "—"
                            : `${classRate.toFixed(1)}%`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          // Clamped: over-payment must not overflow the track.
                          style={{
                            width: `${Math.min(classRate ?? 0, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          students={students}
          classRooms={classRooms}
          termId={selectedTermId}
        />
      </PageBody>
    </>
  );
}

export default BillingsPageContent;
