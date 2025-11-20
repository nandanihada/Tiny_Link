import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, MousePointer, Link2, Search, Zap, Shield, Globe } from "lucide-react";
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
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">TinyLink</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Features
              </Button>
              <Button onClick={() => document.getElementById('create-link')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 lg:pt-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
                    Shorten Links, <br />
                    <span className="bg-gradient-primary bg-clip-text text-transparent">Expand Reach</span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-muted-foreground lg:mx-0 lg:text-xl">
                    Transform your long URLs into powerful marketing tools. Track clicks, analyze audience data, and manage your links with our premium platform.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Button size="lg" className="h-12 px-8 text-base shadow-glow" onClick={() => document.getElementById('create-link')?.scrollIntoView({ behavior: 'smooth' })}>
                    Start Shortening
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    View Analytics
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-8 border-t border-border/50 pt-8 lg:justify-start">
                  <div className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-foreground">{links.length}+</p>
                    <p className="text-sm text-muted-foreground">Active Links</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Clicks</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-foreground">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative mx-auto max-w-[400px] lg:max-w-none">
                <div className="absolute -inset-4 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
                <img
                  src="https://i.postimg.cc/NfyDT9G8/GW-Generated-Image-4-9-2025-3-10-32-PM.png"
                  alt="Digital Marketing"
                  className="relative rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] duration-500 -translate-y-8 scale-90"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h3 className="mb-4 text-3xl font-bold text-foreground">Why Choose TinyLink?</h3>
              <p className="text-muted-foreground">Powerful features to help you grow your audience</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-xl font-semibold text-foreground">Lightning Fast</h4>
                <p className="text-muted-foreground">Instant redirects and real-time analytics updates ensure you never miss a beat.</p>
              </div>
              <div className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Shield className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-xl font-semibold text-foreground">Secure & Reliable</h4>
                <p className="text-muted-foreground">Enterprise-grade security keeps your data safe and your links working 24/7.</p>
              </div>
              <div className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Globe className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-xl font-semibold text-foreground">Global Reach</h4>
                <p className="text-muted-foreground">Track clicks from around the world and understand your global audience.</p>
              </div>
            </div>

            {/* Visual Features */}
            <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <img
                  src="https://i.postimg.cc/2jqmqGvm/ui-ux-representations-with-smartphone-23-2150201875.jpg"
                  alt="Analytics Dashboard"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="order-1 space-y-6 lg:order-2 lg:pl-12">
                <h3 className="text-3xl font-bold text-foreground">Deep Analytics Insights</h3>
                <p className="text-lg text-muted-foreground">
                  Get detailed insights into your link performance. Track clicks, geographic location, device types, and more in real-time.
                </p>
                <ul className="space-y-3">
                  {['Real-time click tracking', 'Geographic data', 'Device & browser stats'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6 lg:pr-12">
                <h3 className="text-3xl font-bold text-foreground">Team Collaboration</h3>
                <p className="text-lg text-muted-foreground">
                  Work together with your team to manage links and campaigns. Share insights and optimize your strategy.
                </p>
                <Button variant="outline" className="group">
                  Learn more
                  <Link2 className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div>
                <img
                  src="https://i.postimg.cc/VNj0c1fn/monetization.jpg"
                  alt="Team Collaboration"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Workspace Section */}
        <section id="create-link" className="bg-card/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">Your Workspace</h2>
              <p className="text-muted-foreground">Manage your links and track performance</p>
            </div>

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
            <div className="mb-12">
              <LinkForm onSubmit={handleCreateLink} loading={loading} />
            </div>

            {/* Links Display Section */}
            <div className="space-y-6">
              {fetchingLinks ? (
                <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-muted-foreground">Loading your links...</p>
                </div>
              ) : links.length > 0 ? (
                <>
                  {/* Search Bar */}
                  <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search by code or URL..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 border-none bg-transparent pl-12 text-base focus-visible:ring-0"
                      />
                    </div>
                    <div className="hidden text-sm text-muted-foreground sm:block">
                      {filteredLinks.length} results
                    </div>
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
                    <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
                      <p className="text-lg font-medium text-foreground">No links match your search</p>
                      <p className="text-muted-foreground">Try a different search term</p>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState onCreateClick={() => document.getElementById("url")?.focus()} />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">TinyLink</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TinyLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

