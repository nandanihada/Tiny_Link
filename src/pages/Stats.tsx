import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, BarChart3, Clock, Calendar, Activity, Copy, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow, format, subDays } from "date-fns";
import { api, Link as ApiLink } from "@/lib/api";

// Mock data for charts (will be replaced with real data later)
const generateChartData = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, "MMM dd"),
      clicks: Math.floor(Math.random() * 20) + 5,
    };
  });
};

const Stats = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [linkData, setLinkData] = useState<ApiLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData] = useState(generateChartData());

  useEffect(() => {
    if (code) {
      fetchLinkStats();
    }
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const data = await api.getLinkStats(code!);
      setLinkData(data);
    } catch (error) {
      console.error('Failed to fetch link stats:', error);
      toast.error("Failed to load link statistics", {
        description: error instanceof Error ? error.message : "Please try again"
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const copyShortLink = () => {
    if (linkData) {
      navigator.clipboard.writeText(linkData.shortUrl);
      toast.success("Link copied!", {
        description: linkData.shortUrl,
      });
    }
  };

  const handleDelete = async () => {
    if (!code) return;

    try {
      await api.deleteLink(code);
      toast.success("Link deleted");
      navigate("/");
    } catch (error) {
      console.error('Failed to delete link:', error);
      toast.error("Failed to delete link", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Link not found</p>
      </div>
    );
  }

  const avgClicksPerDay = linkData.clickCount > 0
    ? Math.round(linkData.clickCount / Math.max(1, Math.ceil((Date.now() - new Date(linkData.createdAt).getTime()) / (1000 * 60 * 60 * 24))))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <code className="text-3xl font-bold text-primary">{linkData.code}</code>
                <Button variant="ghost" size="icon" onClick={copyShortLink}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <a
                  href={linkData.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {linkData.originalUrl}
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={copyShortLink}>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={BarChart3}
            label="Total Clicks"
            value={linkData.clickCount.toLocaleString()}
            color="emerald"
          />
          <StatsCard
            icon={Clock}
            label="Last Clicked"
            value={linkData.lastClickedAt ? formatDistanceToNow(new Date(linkData.lastClickedAt), { addSuffix: true }) : "Never"}
            color="coral"
          />
          <StatsCard
            icon={Calendar}
            label="Created"
            value={format(new Date(linkData.createdAt), "MMM dd, yyyy")}
            color="golden"
          />
          <StatsCard
            icon={Activity}
            label="Status"
            value="Active"
            color="emerald"
          />
        </div>

        {/* Analytics Summary */}
        <Card className="mb-8 border-2 border-border bg-card p-6 shadow-card">
          <div className="mb-6">
            <h3 className="mb-2 text-2xl font-bold text-foreground">Analytics Overview</h3>
            <p className="text-muted-foreground">Real-time performance metrics</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Average Performance</p>
              </div>
              <p className="text-3xl font-bold text-primary">{avgClicksPerDay}</p>
              <p className="text-sm text-muted-foreground">clicks per day</p>
            </div>

            <div className="rounded-lg bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Total Engagement</p>
              </div>
              <p className="text-3xl font-bold text-primary">
                {linkData.clickCount}
              </p>
              <p className="text-sm text-muted-foreground">total clicks all time</p>
            </div>
          </div>
        </Card>

        {/* Target URL Card */}
        <Card className="border-2 border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-xl font-bold text-foreground">Target URL</h3>
          <div className="flex items-center justify-between rounded-lg bg-background p-4">
            <a
              href={linkData.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="break-all">{linkData.originalUrl}</span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(linkData.originalUrl);
                toast.success("Target URL copied!");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Stats;
