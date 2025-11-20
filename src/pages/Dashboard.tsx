import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, MousePointer, Link2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkCard } from "@/components/LinkCard";
import { LinkForm } from "@/components/LinkForm";
import { StatsCard } from "@/components/StatsCard";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { api, Link as ApiLink } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<ApiLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(true);

  // Fetch links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setFetchingLinks(true);
      const response = await api.getLinks({ limit: 100, sort: 'recent' });
      setLinks(response.links);
    } catch (error) {
      console.error('Failed to fetch links:', error);
      toast.error("Failed to load links", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setFetchingLinks(false);
    }
  };

  const handleCreateLink = async (url: string, customCode?: string) => {
    setLoading(true);
    try {
      const newLink = await api.createLink({
        originalUrl: url,
        customCode: customCode || undefined
      });

      setLinks([newLink, ...links]);

      toast.success("Link created!", {
        description: newLink.shortUrl,
        action: {
          label: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(newLink.shortUrl);
            toast.success("Copied to clipboard!");
          },
        },
      });
    } catch (error) {
      console.error('Failed to create link:', error);
      toast.error("Failed to create link", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (code: string) => {
    try {
      await api.deleteLink(code);
      setLinks(links.filter((link) => link.code !== code));
      toast.success("Link deleted");
    } catch (error) {
      console.error('Failed to delete link:', error);
      toast.error("Failed to delete link", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <Link2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TinyLink</h1>
                <p className="text-sm text-muted-foreground">Your smart link shortener</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 rounded-2xl bg-gradient-hero p-8 md:p-12">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <h2 className="bg-gradient-primary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Your Links, Your Story
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Shorten links, track clicks, own your connections
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-card/50 px-4 py-2 backdrop-blur-sm">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{links.length} Active Links</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card/50 px-4 py-2 backdrop-blur-sm">
                <MousePointer className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-foreground">{totalClicks.toLocaleString()} Clicks Total</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card/50 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">Live Data</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={BarChart3}
            label="Total Links"
            value={links.length}
            color="emerald"
          />
          <StatsCard
            icon={MousePointer}
            label="Total Clicks"
            value={totalClicks.toLocaleString()}
            color="emerald"
          />
          <StatsCard
            icon={TrendingUp}
            label="Avg Clicks/Link"
            value={links.length > 0 ? Math.round(totalClicks / links.length) : 0}
            color="coral"
          />
          <StatsCard
            icon={Link2}
            label="Active Today"
            value={links.filter((l) => l.lastClickedAt && Date.now() - new Date(l.lastClickedAt).getTime() < 24 * 60 * 60 * 1000).length}
            color="golden"
          />
        </div>

        {/* Link Creation Form */}
        <section className="mb-8">
          <LinkForm onSubmit={handleCreateLink} loading={loading} />
        </section>

        {/* Links Display Section */}
        <section>
          {fetchingLinks ? (
            <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-muted-foreground">Loading links...</p>
            </div>
          ) : links.length > 0 ? (
            <>
              {/* Search Bar */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by code or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 border-2 border-input bg-card pl-12 text-base focus:border-primary"
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {filteredLinks.length} of {links.length} links
                </span>
              </div>

              {/* Links Grid */}
              {filteredLinks.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      shortCode={link.code}
                      targetUrl={link.originalUrl}
                      clicks={link.clickCount}
                      lastClicked={link.lastClickedAt ? new Date(link.lastClickedAt) : null}
                      createdAt={new Date(link.createdAt)}
                      onDelete={() => handleDeleteLink(link.code)}
                      onViewStats={() => navigate(`/stats/${link.code}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
                  <p className="text-muted-foreground">No links match your search</p>
                </div>
              )}
            </>
          ) : (
            <EmptyState onCreateClick={() => document.getElementById("url")?.focus()} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
