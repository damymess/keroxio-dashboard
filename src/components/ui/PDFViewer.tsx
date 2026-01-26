import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  Loader2,
  FileWarning
} from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title?: string;
  className?: string;
  onClose?: () => void;
  showToolbar?: boolean;
  allowDownload?: boolean;
  allowPrint?: boolean;
}

export function PDFViewer({
  url,
  title,
  className,
  onClose,
  showToolbar = true,
  allowDownload = true,
  allowPrint = true,
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const containerClasses = cn(
    'flex flex-col bg-card rounded-xl border border-border overflow-hidden',
    isFullscreen && 'fixed inset-4 z-50 shadow-2xl',
    className
  );

  return (
    <div className={containerClasses}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-3 border-b bg-accent/50">
          <div className="flex items-center gap-2">
            {title && (
              <span className="font-medium text-sm truncate max-w-[200px]">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Zoom controls */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={scale <= 50}
              title="Zoom arrière"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {scale}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= 200}
              title="Zoom avant"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Actions */}
            {allowPrint && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrint}
                title="Imprimer"
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
            {allowDownload && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                title="Télécharger"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Réduire' : 'Plein écran'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>

            {onClose && (
              <>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  title="Fermer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div className="relative flex-1 min-h-[400px] bg-gray-100 dark:bg-gray-900">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Chargement du PDF...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <FileWarning className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Impossible de charger le PDF</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vérifiez votre connexion ou réessayez plus tard
                </p>
              </div>
              <Button variant="outline" onClick={() => window.open(url, '_blank')}>
                Ouvrir dans un nouvel onglet
              </Button>
            </div>
          </div>
        )}

        {/* PDF iframe */}
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=1&zoom=${scale}`}
          className="w-full h-full border-0"
          title={title || 'Document PDF'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            transform: `scale(${scale / 100})`,
            transformOrigin: 'top left',
            width: `${10000 / scale}%`,
            height: `${10000 / scale}%`,
          }}
        />
      </div>

      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
}

// Simple PDF preview thumbnail
interface PDFThumbnailProps {
  url: string;
  className?: string;
  onClick?: () => void;
}

export function PDFThumbnail({ url, className, onClick }: PDFThumbnailProps) {
  return (
    <div
      className={cn(
        'relative w-24 h-32 bg-white rounded-lg border border-border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=0&zoom=25`}
        className="w-full h-full border-0 pointer-events-none"
        title="PDF preview"
      />
      <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors" />
    </div>
  );
}
