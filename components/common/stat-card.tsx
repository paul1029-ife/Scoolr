/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function RevenueCard({
  title = "Total Students",
  amount = "45,678",
  percentageChange = "+12.5%",
  trending = true,
  text = "Increased student amount",
  extra = "Engagement exceeds target",
}) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {amount}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            {trending ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {percentageChange}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {text}
          {/* <TrendingUp className="size-4" /> */}
        </div>
        <div className="text-muted-foreground">{extra}</div>
      </CardContent>
    </Card>
  );
}
