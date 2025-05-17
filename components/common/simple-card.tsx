import React from "react";
import { Card } from "../ui/card";

export default function SimpleCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <Card className="bg-white rounded-md p-5 flex flex-col gap-1 shadow-md">
      <h3 className="font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-medium tracking-tightest">{value}</p>
    </Card>
  );
}
