import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Image as ImageIcon,
  Euro,
  FileText,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Loader2,
  Camera,
  Sparkles,
  Edit3,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { imageApi, type Background, type ProcessResult } from '../lib/imageApi';
import { vehicleApi } from '../lib/vehicleApi';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.keroxio.fr';

const steps = [
  { id: 1, icon: Car, label: 'Plaque', desc: 'Identification du véhicule' },
  { id: 2, icon: ImageIcon, label: 'Photos', desc: 'Traitement professionnel' },
  { id: 3, icon: Euro, label: 'Prix', desc: 'Estimation du marché' },
  { id: 4, icon: FileText, label: 'Annonce', desc: 'Texte optimisé' },
  { id: 5, icon: ExternalLink, label: 'Publier', desc: 'Diffusion' },
];

interface VehicleInfo {
  plaque: string;
  marque: string;
  modele: string;
  version?: string;
  annee?: number;
  carburant?: string;
  boite?: string;
  puissance?: string;
  couleur?: string;
}

interface PriceEstimate {
  prix_min: number;
  prix_moyen: number;
  prix_max: number;
  source?: string;
  comparables?: number;
}

export function NewVehiclePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Vehicle ID (created after step 1)
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  
  // Step 1: Plate
  const [plateImage, setPlateImage] = useState<File | null>(null);
  const [plateDetected, setPlateDetected] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  
  // Step 2: Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [selectedBg, setSelectedBg] = useState('showroom_led');
  const [processedPhotos, setProcessedPhotos] = useState<ProcessResult[]>([]);
  const [photosProcessed, setPhotosProcessed] = useState(false);
  
  // Step 3: Price
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [kilometrage, setKilometrage] = useState('45000');
  
  // Step 4: Ad
  const [generatedAd, setGeneratedAd] = useState<{ titre: string; description: string } | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  // Load backgrounds from API
  useEffect(() => {
    imageApi.getBackgrounds()
      .then(data => {
        setBackgrounds(data.backgrounds);
        if (data.backgrounds.length > 0) {
          setSelectedBg(data.backgrounds[0].name);
        }
      })
      .catch(err => console.error('Failed to load backgrounds:', err));
  }, []);

  // Handle plate image - call OCR API
  const handlePlateUpload = useCallback(async (file: File) => {
    setPlateImage(file);
    setLoading(true);
    
    try {
      // Call OCR API to read plate from image
      const formData = new FormData();
      formData.append('file', file);
      
      const ocrResponse = await fetch(`${API_URL}/immat/ocr/full`, {
        method: 'POST',
        body: formData,
      });
      
      if (ocrResponse.ok) {
        const data = await ocrResponse.json();
        
        if (data.success && data.vehicle) {
          setVehicleInfo({
            plaque: data.vehicle.plaque,
            marque: data.vehicle.marque || 'À compléter',
            modele: data.vehicle.modele || 'À compléter',
            version: data.vehicle.version,
            annee: data.vehicle.premiere_immat_year,
            carburant: data.vehicle.type_carburant,
          });
          setPlateDetected(true);
        } else {
          // OCR failed, ask for manual input
          const plaque = prompt('Plaque non détectée. Entrez manuellement:', 'AB-123-CD');
          if (plaque) {
            setVehicleInfo({
              plaque: plaque.toUpperCase(),
              marque: 'À compléter',
              modele: 'À compléter',
            });
            setPlateDetected(true);
          }
        }
      } else {
        // API error, fallback to manual
        const plaque = prompt('Erreur OCR. Entrez la plaque manuellement:', 'AB-123-CD');
        if (plaque) {
          setVehicleInfo({
            plaque: plaque.toUpperCase(),
            marque: 'À compléter',
            modele: 'À compléter',
          });
          setPlateDetected(true);
        }
      }
    } catch (err) {
      console.error('OCR failed:', err);
      // Fallback to manual entry
      const plaque = prompt('Erreur. Entrez la plaque manuellement:', 'AB-123-CD');
      if (plaque) {
        setVehicleInfo({
          plaque: plaque.toUpperCase(),
          marque: 'À compléter',
          modele: 'À compléter',
        });
        setPlateDetected(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle photos
  const handlePhotosUpload = useCallback((files: FileList) => {
    setPhotos(Array.from(files));
  }, []);

  // Process photos using real API
  const processPhotos = async () => {
    if (photos.length === 0) return;
    
    setLoading(true);
    const results: ProcessResult[] = [];
    
    try {
      for (const photo of photos) {
        const result = await imageApi.processImage(photo, selectedBg);
        results.push(result);
      }
      setProcessedPhotos(results);
      setPhotosProcessed(true);
    } catch (err) {
      console.error('Photo processing failed:', err);
      alert('Erreur lors du traitement des photos');
    } finally {
      setLoading(false);
    }
  };

  // Get price estimate from pricing API
  const getEstimate = async () => {
    if (!vehicleInfo) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pricing/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marque: vehicleInfo.marque,
          modele: vehicleInfo.modele,
          annee: vehicleInfo.annee || new Date().getFullYear(),
          kilometrage: parseInt(kilometrage) || 50000,
          carburant: vehicleInfo.carburant || 'essence',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const estimate: PriceEstimate = {
          prix_min: data.prix_min || data.prix * 0.9,
          prix_moyen: data.prix || data.prix_moyen,
          prix_max: data.prix_max || data.prix * 1.1,
          source: 'Argus + Marché',
          comparables: data.comparables || 0,
        };
        setPriceEstimate(estimate);
        setSelectedPrice(estimate.prix_moyen);
      } else {
        // Fallback estimation
        setPriceEstimate({
          prix_min: 10000,
          prix_moyen: 12000,
          prix_max: 14000,
          source: 'Estimation',
        });
        setSelectedPrice(12000);
      }
    } catch (err) {
      console.error('Price estimation failed:', err);
      setPriceEstimate({
        prix_min: 10000,
        prix_moyen: 12000,
        prix_max: 14000,
        source: 'Estimation',
      });
      setSelectedPrice(12000);
    } finally {
      setLoading(false);
    }
  };

  // Generate ad using annonce API
  const generateAd = async () => {
    if (!vehicleInfo || !selectedPrice) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://annonce.keroxio.fr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marque: vehicleInfo.marque,
          modele: vehicleInfo.modele,
          version: vehicleInfo.version,
          annee: vehicleInfo.annee,
          kilometrage: parseInt(kilometrage),
          carburant: vehicleInfo.carburant,
          boite: vehicleInfo.boite,
          prix: selectedPrice,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedAd({
          titre: data.titre || `${vehicleInfo.marque} ${vehicleInfo.modele} - ${vehicleInfo.annee}`,
          description: data.description || data.texte || '',
        });
        setEditedTitle(data.titre || `${vehicleInfo.marque} ${vehicleInfo.modele} - ${vehicleInfo.annee}`);
        setEditedDesc(data.description || data.texte || '');
      } else {
        // Fallback: generate simple ad
        const titre = `${vehicleInfo.marque} ${vehicleInfo.modele}${vehicleInfo.version ? ' ' + vehicleInfo.version : ''} - ${vehicleInfo.annee || 'Année NC'}`;
        const desc = `🚗 ${vehicleInfo.marque} ${vehicleInfo.modele} à vendre !

📋 Caractéristiques :
• Année : ${vehicleInfo.annee || 'NC'}
• Kilométrage : ${parseInt(kilometrage).toLocaleString('fr-FR')} km
• Carburant : ${vehicleInfo.carburant || 'NC'}
• Boîte : ${vehicleInfo.boite || 'NC'}

💰 Prix : ${selectedPrice.toLocaleString('fr-FR')} €

📞 Contactez-moi pour plus d'informations !`;
        
        setGeneratedAd({ titre, description: desc });
        setEditedTitle(titre);
        setEditedDesc(desc);
      }
    } catch (err) {
      console.error('Ad generation failed:', err);
      // Fallback
      const titre = `${vehicleInfo.marque} ${vehicleInfo.modele} - ${vehicleInfo.annee || ''}`;
      const desc = `${vehicleInfo.marque} ${vehicleInfo.modele} à vendre. Prix: ${selectedPrice?.toLocaleString('fr-FR')} €`;
      setGeneratedAd({ titre, description: desc });
      setEditedTitle(titre);
      setEditedDesc(desc);
    } finally {
      setLoading(false);
    }
  };

  // Save to API when moving between steps
  const nextStep = async () => {
    if (currentStep >= 5) return;
    
    try {
      // Step 1 → 2: Create vehicle
      if (currentStep === 1 && vehicleInfo && !vehicleId) {
        const created = await vehicleApi.create({
          plaque: vehicleInfo.plaque,
          marque: vehicleInfo.marque,
          modele: vehicleInfo.modele,
          version: vehicleInfo.version,
          annee: vehicleInfo.annee,
          carburant: vehicleInfo.carburant,
          boite: vehicleInfo.boite,
        });
        setVehicleId(created.id);
      }
      
      // Step 2 → 3: Update with photos
      if (currentStep === 2 && vehicleId && processedPhotos.length > 0) {
        await vehicleApi.update(vehicleId, {
          photos_traitees: processedPhotos.map(p => p.final_url),
          background_utilise: selectedBg,
        });
      }
      
      // Step 3 → 4: Update with price
      if (currentStep === 3 && vehicleId && priceEstimate && selectedPrice) {
        await vehicleApi.update(vehicleId, {
          kilometrage: parseInt(kilometrage) || undefined,
          prix_estime_min: priceEstimate.prix_min,
          prix_estime_moyen: priceEstimate.prix_moyen,
          prix_estime_max: priceEstimate.prix_max,
          prix_choisi: selectedPrice,
        });
      }
      
      // Step 4 → 5: Update with ad
      if (currentStep === 4 && vehicleId && editedTitle && editedDesc) {
        await vehicleApi.update(vehicleId, {
          annonce_titre: editedTitle,
          annonce_description: editedDesc,
          status: 'ready',
        });
      }
      
      setCurrentStep(currentStep + 1);
    } catch (err) {
      console.error('Failed to save vehicle:', err);
      // Continue anyway, don't block the flow
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return plateDetected && vehicleInfo;
      case 2: return photosProcessed;
      case 3: return selectedPrice !== null;
      case 4: return editedTitle && editedDesc;
      default: return true;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nouveau véhicule</h1>
          <p className="text-muted-foreground">Étape {currentStep} sur 5</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                'flex flex-col items-center',
                currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center mb-1 transition-colors',
                  currentStep > step.id
                    ? 'bg-primary text-primary-foreground'
                    : currentStep === step.id
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-muted'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'h-1 w-8 sm:w-16 mx-2 rounded-full transition-colors',
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Plate */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Identification du véhicule</h2>
                <p className="text-muted-foreground">
                  Prenez une photo de la plaque d'immatriculation
                </p>
              </div>

              {!plateDetected ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
                    {loading ? (
                      <div className="space-y-4">
                        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                        <p>Lecture de la plaque...</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="font-medium">Cliquez ou glissez une photo</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          La plaque sera lue automatiquement
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handlePlateUpload(e.target.files[0])}
                  />
                </label>
              ) : vehicleInfo && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Véhicule identifié</span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-accent">
                    <div className="text-center mb-4">
                      <Badge className="text-lg px-4 py-1 bg-blue-600">
                        {vehicleInfo.plaque}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Marque:</span> <strong>{vehicleInfo.marque}</strong></div>
                      <div><span className="text-muted-foreground">Modèle:</span> <strong>{vehicleInfo.modele}</strong></div>
                      <div><span className="text-muted-foreground">Version:</span> <strong>{vehicleInfo.version}</strong></div>
                      <div><span className="text-muted-foreground">Année:</span> <strong>{vehicleInfo.annee}</strong></div>
                      <div><span className="text-muted-foreground">Carburant:</span> <strong>{vehicleInfo.carburant}</strong></div>
                      <div><span className="text-muted-foreground">Boîte:</span> <strong>{vehicleInfo.boite}</strong></div>
                      <div><span className="text-muted-foreground">Puissance:</span> <strong>{vehicleInfo.puissance}</strong></div>
                      <div><span className="text-muted-foreground">Couleur:</span> <strong>{vehicleInfo.couleur}</strong></div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => { setPlateDetected(false); setVehicleInfo(null); }}>
                    Changer de véhicule
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Photos */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Photos du véhicule</h2>
                <p className="text-muted-foreground">
                  Ajoutez jusqu'à 10 photos, nous les transformons en images pro
                </p>
              </div>

              {/* Upload zone */}
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium">Ajouter des photos</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG • Max 10 photos</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handlePhotosUpload(e.target.files)}
                />
              </label>

              {/* Photos preview */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {photos.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-accent flex items-center justify-center overflow-hidden">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Background selection */}
              {photos.length > 0 && !photosProcessed && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Choisir un arrière-plan</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.name}
                        onClick={() => setSelectedBg(bg.name)}
                        className={cn(
                          'relative aspect-video rounded-lg border-2 overflow-hidden transition-all',
                          selectedBg === bg.name
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
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
                            {bg.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Process button */}
              {photos.length > 0 && !photosProcessed && (
                <Button className="w-full" size="lg" onClick={processPhotos} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Traiter les {photos.length} photos
                    </>
                  )}
                </Button>
              )}

              {photosProcessed && (
                <div className="flex items-center justify-center gap-2 text-green-600 py-4">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">{photos.length} photos traitées avec succès</span>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Price */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Estimation du prix</h2>
                <p className="text-muted-foreground">
                  Prix suggéré basé sur le marché actuel
                </p>
              </div>

              {!priceEstimate ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Kilométrage</label>
                    <input
                      type="number"
                      value={kilometrage}
                      onChange={(e) => setKilometrage(e.target.value)}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-accent border-0 text-lg"
                      placeholder="45000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">en kilomètres</p>
                  </div>
                  
                  <Button className="w-full" size="lg" onClick={getEstimate} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Calcul en cours...
                      </>
                    ) : (
                      <>
                        <Euro className="h-4 w-4 mr-2" />
                        Estimer le prix
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Prix bas', value: priceEstimate.prix_min, color: 'text-orange-500' },
                      { label: 'Prix moyen', value: priceEstimate.prix_moyen, color: 'text-green-500', recommended: true },
                      { label: 'Prix haut', value: priceEstimate.prix_max, color: 'text-blue-500' },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => setSelectedPrice(option.value)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-center',
                          selectedPrice === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <p className="text-xs text-muted-foreground">{option.label}</p>
                        <p className={cn('text-2xl font-bold', option.color)}>
                          {option.value.toLocaleString('fr-FR')} €
                        </p>
                        {option.recommended && (
                          <Badge className="mt-2 text-xs">Recommandé</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Basé sur {priceEstimate.comparables} annonces similaires • Source: {priceEstimate.source}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ou entrez votre prix</label>
                    <input
                      type="number"
                      value={selectedPrice || ''}
                      onChange={(e) => setSelectedPrice(Number(e.target.value))}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-accent border-0 text-lg text-center font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Ad */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Votre annonce</h2>
                <p className="text-muted-foreground">
                  Texte généré automatiquement, modifiez si besoin
                </p>
              </div>

              {!generatedAd ? (
                <Button className="w-full" size="lg" onClick={generateAd} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer l'annonce
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Titre
                      <Edit3 className="h-3 w-3 text-muted-foreground" />
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-accent border-0 font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Description
                      <Edit3 className="h-3 w-3 text-muted-foreground" />
                    </label>
                    <textarea
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                      rows={12}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-accent border-0 resize-none text-sm"
                    />
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(`${editedTitle}\n\n${editedDesc}`)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier le texte
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Publier l'annonce</h2>
                <p className="text-muted-foreground">
                  Choisissez où diffuser votre annonce
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { name: 'LeBonCoin', id: 'leboncoin', url: 'https://www.leboncoin.fr/deposer-une-annonce', color: 'bg-orange-500' },
                  { name: 'La Centrale', id: 'lacentrale', url: 'https://www.lacentrale.fr/deposer-annonce.html', color: 'bg-red-500' },
                  { name: 'ParuVendu', id: 'paruvendu', url: 'https://www.paruvendu.fr/deposer-annonce', color: 'bg-blue-500' },
                ].map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Mark as published on this platform
                      if (vehicleId) {
                        vehicleApi.markPublished(vehicleId, platform.id).catch(console.error);
                      }
                      // Copy ad text to clipboard
                      navigator.clipboard.writeText(`${editedTitle}\n\n${editedDesc}`);
                    }}
                    className="flex items-center justify-between p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold', platform.color)}>
                        {platform.name[0]}
                      </div>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </a>
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Cliquez sur une plateforme pour copier le texte et ouvrir le site
              </div>

              <Button className="w-full" size="lg" onClick={() => navigate('/vehicles')}>
                <Check className="h-4 w-4 mr-2" />
                Terminer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>
        
        {currentStep < 5 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Suivant
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
