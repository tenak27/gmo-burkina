import React, { useState } from "react";
import { Download, FileText, Globe, Languages, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FORMATS = [
  { value: 'html', label: 'HTML', icon: FileText, description: 'Site web complet, prêt à publier' },
  { value: 'pdf', label: 'PDF', icon: FileText, description: 'Document imprimable, haute qualité' },
  { value: 'json', label: 'JSON', icon: FileText, description: 'Données structurées pour intégration' },
  { value: 'csv', label: 'CSV', icon: FileText, description: 'Tableur Excel/Google Sheets' },
];

const LANGUAGES = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function VitrineExportPanel() {
  const [format, setFormat] = useState('html');
  const [language, setLanguage] = useState('fr');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const response = await base44.functions.invoke('exportVitrineSite', {
        format,
        language,
      });

      // Créer le blob et télécharger
      const blob = new Blob([response.data], {
        type: format === 'html' ? 'text/html' : 
              format === 'pdf' ? 'application/pdf' : 
              format === 'json' ? 'application/json' : 'text/csv',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalogue_gmo_${language}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Export ${format.toUpperCase()} généré avec succès en ${language}`);
    } catch (error) {
      toast.error(`Erreur lors de l'export: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedFormat = FORMATS.find(f => f.value === format);
  const selectedLanguage = LANGUAGES.find(l => l.value === language);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-obsidian mb-2">
          Export Site Vitrine
        </h2>
        <p className="font-body text-sm text-obsidian/60">
          Générez votre catalogue produits dans plusieurs formats et langues
        </p>
      </div>

      {/* Alert */}
      <Alert className="bg-gmo-green/5 border-gmo-green/20">
        <Globe className="h-4 w-4 text-gmo-green" />
        <AlertDescription className="text-sm text-gmo-green/80 ml-2">
          L'export inclut tous les produits actifs avec <code>show_on_vitrine = true</code>
        </AlertDescription>
      </Alert>

      {/* Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Format d'export</CardTitle>
          <CardDescription>Choisissez le format de fichier souhaité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FORMATS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    format === f.value
                      ? 'border-gmo-green bg-gmo-green/5'
                      : 'border-gray-200 hover:border-gmo-green/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${format === f.value ? 'text-gmo-green' : 'text-gray-400'}`} />
                  <p className="font-heading font-bold text-sm mb-1">{f.label}</p>
                  <p className="font-body text-xs text-gray-500">{f.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. Langue</CardTitle>
          <CardDescription>Choisissez la langue du catalogue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  language === lang.value
                    ? 'border-gmo-green bg-gmo-green/5'
                    : 'border-gray-200 hover:border-gmo-green/50'
                }`}
              >
                <span className="text-2xl mr-2">{lang.flag}</span>
                <span className="font-heading font-bold text-sm">{lang.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview & Export */}
      <Card className="border-gmo-green/30 bg-gmo-green/5">
        <CardHeader>
          <CardTitle className="text-lg">3. Exporter</CardTitle>
          <CardDescription>
            Format: <strong>{selectedFormat?.label}</strong> | 
            Langue: <strong>{selectedLanguage?.flag} {selectedLanguage?.label}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExport}
            disabled={loading}
            className="bg-gmo-green hover:bg-gmo-green/90 text-white font-heading font-bold text-sm px-8 py-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Télécharger le catalogue
              </>
            )}
          </Button>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>✓ Produits: Tous les produits actifs avec show_on_vitrine</p>
            <p>✓ Entreprise: Informations depuis CompanySettings</p>
            <p>✓ Date: {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}