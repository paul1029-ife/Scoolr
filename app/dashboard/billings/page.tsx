"use client";

import React, { useState } from "react";
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
  Wallet,
  TrendingUp,
  BellRing,
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

// Types
interface Payment {
  id: string;
  studentName: string;
  class: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}

interface FeeStructure {
  class: string;
  termlyFee: number;
  totalStudents: number;
  expectedAmount: number;
  collectedAmount: number;
}

// Sample data
const recentPayments: Payment[] = [
  {
    id: "PAY-001",
    studentName: "Adebayo Johnson",
    class: "SSS 3",
    amount: 150000,
    type: "School Fees",
    status: "paid",
    date: "2024-01-05",
  },
  {
    id: "PAY-002",
    studentName: "Chioma Ezekwesili",
    class: "JSS 1",
    amount: 125000,
    type: "School Fees",
    status: "pending",
    date: "2024-01-04",
  },
  {
    id: "PAY-003",
    studentName: "Ibrahim Mohammed",
    class: "SSS 1",
    amount: 135000,
    type: "School Fees",
    status: "paid",
    date: "2024-01-03",
  },
  // Add more payment records...
];

const feeStructure: FeeStructure[] = [
  {
    class: "JSS 1",
    termlyFee: 125000,
    totalStudents: 120,
    expectedAmount: 15000000,
    collectedAmount: 13750000,
  },
  {
    class: "JSS 2",
    termlyFee: 125000,
    totalStudents: 115,
    expectedAmount: 14375000,
    collectedAmount: 13125000,
  },
  // Add more classes...
];

export default function BillingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("1st Term");

  const totalExpected = feeStructure.reduce(
    (sum, fee) => sum + fee.expectedAmount,
    0
  );
  const totalCollected = feeStructure.reduce(
    (sum, fee) => sum + fee.collectedAmount,
    0
  );
  const collectionRate = (totalCollected / totalExpected) * 100;

  const filteredPayments = recentPayments.filter(
    (payment) =>
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage school fees and payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold">
                ₦{(totalCollected / 1000000).toFixed(1)}M
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-yellow-100 rounded-full">
              <BellRing className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold">
                ₦{((totalExpected - totalCollected) / 1000000).toFixed(1)}M
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <h2 className="text-xl font-semibold">Recent Payments</h2>
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
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1st Term">1st Term</SelectItem>
                        <SelectItem value="2nd Term">2nd Term</SelectItem>
                        <SelectItem value="3rd Term">3rd Term</SelectItem>
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
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                          {payment.id}
                        </div>
                      </TableCell>
                      <TableCell>{payment.studentName}</TableCell>
                      <TableCell>{payment.class}</TableCell>
                      <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payment.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {payment.status === "paid" ? (
                            <ChevronUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ChevronDown className="h-3 w-3 mr-1" />
                          )}
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
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
              <h2 className="text-xl font-semibold">Fee Structure</h2>
              <Select defaultValue="2023/2024">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                    <SelectItem value="2022/2023">2022/2023</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {feeStructure.map((fee) => (
                <div
                  key={fee.class}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{fee.class}</h3>
                    <Badge variant="outline">
                      {fee.totalStudents} students
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Termly Fee: ₦{fee.termlyFee.toLocaleString()}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Collection Rate</span>
                    <span className="font-medium">
                      {(
                        (fee.collectedAmount / fee.expectedAmount) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${
                          (fee.collectedAmount / fee.expectedAmount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
