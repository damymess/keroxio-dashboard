import { useState, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Download, RefreshCw, Check, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { imageApi, type Background, type ProcessResult } from '../lib/imageApi';

const BACKGROUND_LABELS: Record<string, string> = {
  studio_white: 'Studio Blanc',
  studio_grey: 'Studio Gris',
  studio_black: 'Studio Noir',
  showroom: 'Showroom',
  garage_modern: 'Garage Moderne',
  outdoor: 'Extérieur',
};

export function ImageProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [selectedBg, setSelectedBg] = useState<string>('studio_black');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Load backgrounds on mount
  useEffect(() => {
    imageApi.getBackgrounds()
      .then(data => setBackgrounds(data.backgrounds))
      .catch(err => console.error('Failed to load backgrounds:', err));
  }, []);

  // Handle file selection
  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image trop grande (max 10MB)');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  // Process image
  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const res = await imageApi.processImage(file, selectedBg);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de traitement');
    } finally {
      setProcessing(false);
    }
  };

  // Reset
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  // Download result
  const handleDownload = async () => {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result.final_url;
    link.download = `keroxio-${result.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Transformer une photo
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Uploadez une photo de véhicule et choisissez un arrière-plan professionnel
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Upload & Original */}
        <div className="space-y-4">
          {/* Upload Zone */}
          {!file ? (
            <Card
              className={cn(
                'border-2 border-dashed transition-colors cursor-pointer',
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CardContent className="p-12">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium">Glissez une image ici</p>
                  <p className="text-sm text-muted-foreground mt-1">ou cliquez pour parcourir</p>
                  <p className="text-xs text-muted-foreground mt-4">JPG, PNG, WebP • Max 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </label>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Image originale</p>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Changer
                  </Button>
                </div>
                <div className="aspect-video bg-accent rounded-lg overflow-hidden">
                  {preview && (
                    <img
                      src={preview}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {file.name} • {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </CardContent>
            </Card>
          )}

          {/* Background Selection */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-3">Choisir un arrière-plan</p>
              <div className="grid grid-cols-3 gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.name}
                    onClick={() => setSelectedBg(bg.name)}
                    className={cn(
                      'relative aspect-video rounded-lg overflow-hidden border-2 transition-all',
                      selectedBg === bg.name
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-primary/30'
                    )}
                  >
                    <img
                      src={imageApi.getBackgroundPreviewUrl(bg.name)}
                      alt={bg.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedBg === bg.name && (
                      <div className="absolute top-1 right-1 p-0.5 rounded-full bg-primary">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                      <p className="text-[10px] text-white font-medium truncate">
                        {BACKGROUND_LABELS[bg.name] || bg.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Process Button */}
          {file && (
            <Button
              className="w-full"
              size="lg"
              onClick={handleProcess}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Transformer la photo
                </>
              )}
            </Button>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Right: Result */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Résultat</p>
                {result && (
                  <span className="text-xs text-muted-foreground">
                    {result.processing_time}s
                  </span>
                )}
              </div>

              <div className="flex-1 aspect-video bg-accent rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                {result ? (
                  <img
                    src={result.final_url}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                ) : processing ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-4">
                      Suppression de l'arrière-plan...
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground mt-4">
                      Le résultat apparaîtra ici
                    </p>
                  </div>
                )}
              </div>

              {result && (
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setResult(null);
                    handleProcess();
                  }}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
