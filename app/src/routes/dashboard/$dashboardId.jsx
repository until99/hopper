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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
          <h2 className="text-md text-gray-500">
            {dashboardDescription || "No description available"}
          </h2>
        </div>
        <Link
          to="/dashboard/list-dashboards"
          className="flex items-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-slate-200"
        >
          <ArrowLeftIcon weight="bold" size={16} />
          <p className="pb-1 text-sm font-semibold">Back to Dashboards</p>
        </Link>
      </div>
      <div className="relative mt-6 flex h-screen flex-1 flex-col bg-white shadow">
        {/* Toggle Controls Button */}
        {iframeLoaded && (
          <button
            className="absolute top-7 left-4 z-30 rounded-full bg-white p-2 shadow hover:bg-slate-100"
            onClick={() => setShowControls((v) => !v)}
            type="button"
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        )}

        {/* Controls Overlay */}
        {iframeLoaded && showControls && (
          <div className="absolute top-4 left-16 z-20 flex items-center gap-4 rounded-lg bg-white/80 p-2 shadow">
            {controls.map((control) => (
              <button
                key={control.label}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 hover:cursor-pointer hover:bg-slate-100"
                onClick={control.onClick}
                type="button"
              >
                {control.icon}
                <p className="pb-1 text-sm font-semibold">{control.label}</p>
              </button>
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
