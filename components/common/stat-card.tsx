import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title?: string;
  amount?: string;
  /**
   * Period-over-period change. Omit it when there is no comparison to make —
   * the badge is then hidden rather than showing an invented figure.
   */
  percentageChange?: string;
  trending?: boolean;
  text?: string;
  extra?: string;
}

export default function StatCard({
  title = "Total Students",
  amount = "0",
  percentageChange,
  trending = true,
  text,
  extra,
}: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {amount}
        </CardTitle>
        {percentageChange && (
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
        )}
      </CardHeader>
      <CardContent className="flex-col items-start gap-1 text-sm">
        {text && (
          <div className="line-clamp-1 flex gap-2 font-medium">{text}</div>
        )}
        {extra && <div className="text-muted-foreground">{extra}</div>}
      </CardContent>
    </Card>
  );
}
