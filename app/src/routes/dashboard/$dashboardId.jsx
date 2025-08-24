import { useState, useRef } from "react";
import {
  ArrowLeftIcon,
  ArrowsCounterClockwiseIcon,
  ArrowsOutIcon,
  ExportIcon,
  EyeClosedIcon,
  EyeIcon,
  ShareIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, PageHeader } from "../../components/ui";

export const Route = createFileRoute("/dashboard/$dashboardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { dashboardId } = Route.useParams();
  const { dashboardTitle, dashboardDescription } = Route.useSearch();

  const iframeRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const controls = [
    {
      label: "Refresh",
      icon: (
        <span
          className={isRefreshing ? "animate-spin" : ""}
          style={{ display: "inline-flex" }}
        >
          <ArrowsCounterClockwiseIcon size={16} />
        </span>
      ),
      onClick: () => {
        window.location.reload();
      },
    },
    {
      label: "Export",
      icon: <ExportIcon size={16} />,
      onClick: () => {
        /* lógica de exportação */
      },
    },
    {
      label: "Fullscreen",
      icon: <ArrowsOutIcon size={16} />,
      onClick: () => {
        if (iframeRef.current) {
          if (iframeRef.current.requestFullscreen) {
            iframeRef.current.requestFullscreen();
          } else if (iframeRef.current.webkitRequestFullscreen) {
            iframeRef.current.webkitRequestFullscreen();
          } else if (iframeRef.current.mozRequestFullScreen) {
            iframeRef.current.mozRequestFullScreen();
          } else if (iframeRef.current.msRequestFullscreen) {
            iframeRef.current.msRequestFullscreen();
          }
        }
      },
    },
    {
      label: "Share",
      icon: <ShareIcon size={16} />,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href);
      },
    },
  ];

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);

  return (
    <section className="flex h-[calc(100vh-4.5rem)] flex-col overflow-hidden p-4">
      <PageHeader
        title={dashboardTitle || "Dashboard"}
        subtitle={dashboardDescription || "No description available"}
      >
        <Button variant="outline" as={Link} to="/dashboard/list-dashboards">
          <ArrowLeftIcon size={16} />
          Back to Dashboards
        </Button>
      </PageHeader>

      <div className="relative mt-6 flex h-screen flex-1 flex-col bg-white shadow">
        {/* Toggle Controls Button */}
        {iframeLoaded && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 z-30 rounded-full p-2 shadow"
            onClick={() => setShowControls((v) => !v)}
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? <EyeIcon /> : <EyeClosedIcon />}
          </Button>
        )}

        {/* Controls Overlay */}
        {iframeLoaded && showControls && (
          <div className="absolute top-4 left-16 z-20 flex items-center gap-2 rounded-lg bg-white/80 p-2 shadow">
            {controls.map((control) => (
              <Button
                key={control.label}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={control.onClick}
              >
                {control.icon}
                <span className="text-sm font-medium">{control.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Iframe fills the container */}
        <iframe
          ref={iframeRef}
          title={dashboardTitle}
          src={`https://app.powerbi.com/reportEmbed?reportId=${dashboardId}&autoAuth=true&ctid=a5504f25-7802-4f62-9940-f4a2f7eba746`}
          allowFullScreen
          className="h-full min-h-[400px] w-full flex-1"
          style={{ border: "none" }}
          onLoad={() => setIframeLoaded(true)}
        ></iframe>
      </div>
    </section>
  );
}
