import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { useDiagnosticStore } from '@/store/diagnosticStore';
import { ScoreDisplay } from '@/components/results/ScoreDisplay';
import { CategoryBreakdown } from '@/components/results/CategoryBreakdown';
import { GapReport } from '@/components/results/GapReport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RotateCcw, Share2, CheckCircle2, Lightbulb, Target } from 'lucide-react';
import { generatePDF } from '@/lib/pdfGenerator';

export function ResultsPage() {
  const navigate = useNavigate();
  const { result, reset } = useDiagnosticStore();

  useEffect(() => {
    if (!result) {
      navigate('/diagnostic');
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const handleDownloadPDF = async () => {
    await generatePDF(result);
  };

  const handleNewDiagnostic = () => {
    reset();
    navigate('/diagnostic');
  };

  const handleShare = async () => {
    const text = `Mi empresa obtuvo ${Math.round(result.totalScore)}/100 en el diagnóstico de Export Readiness de ExportaListo. ¿Estás listo para exportar? Descúbrelo en: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Diagnóstico Export Readiness',
          text,
          url: window.location.origin,
        });
      } catch (error) {
        // Solo mostrar error si no fue cancelación del usuario
        if ((error as Error).name !== 'AbortError') {
          toast.error('No se pudo compartir');
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Enlace copiado al portapapeles');
      } catch {
        toast.error('No se pudo copiar al portapapeles');
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header mejorado */}
        <div className="mb-12 text-center fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Diagnóstico Completado
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 gradient-text">
            Tu Diagnóstico de Export Readiness
          </h1>
          {result.companyInfo.name && (
            <p className="text-lg text-muted-foreground font-medium">
              {result.companyInfo.name}
            </p>
          )}
        </div>

        {/* Score principal */}
        <div className="mb-12 fade-in" style={{ animationDelay: '100ms' }}>
          <ScoreDisplay result={result} />
        </div>

        {/* Acciones con efectos mejorados */}
        <div className="mb-12 flex flex-wrap justify-center gap-4 fade-in" style={{ animationDelay: '200ms' }}>
          <Button
            onClick={handleDownloadPDF}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Download className="h-5 w-5" />
            <span className="font-semibold">Descargar PDF</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            size="lg"
            className="gap-2 hover-lift border-2"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-semibold">Compartir</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleNewDiagnostic}
            size="lg"
            className="gap-2 hover-lift border-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span className="font-semibold">Nuevo Diagnóstico</span>
          </Button>
        </div>

        {/* Desglose por categoría */}
        <div className="mb-12 fade-in" style={{ animationDelay: '300ms' }}>
          <Card className="shadow-xl hover-lift border-2 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-warning to-success" />
            <CardHeader className="bg-gradient-to-br from-white to-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Desglose por Categoría</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <CategoryBreakdown categoryScores={result.categoryScores} />
            </CardContent>
          </Card>
        </div>

        {/* Brechas con diseño mejorado */}
        {result.gaps.length > 0 && (
          <div className="mb-12 fade-in" style={{ animationDelay: '400ms' }}>
            <Card className="shadow-xl hover-lift border-2 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
              <CardHeader className="bg-gradient-to-br from-white to-red-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <Target className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Brechas Prioritarias</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.gaps.length} {result.gaps.length === 1 ? 'brecha identificada' : 'brechas identificadas'}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-lg">
                    {result.gaps.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <GapReport gaps={result.gaps} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Siguientes pasos con diseño premium */}
        <div className="mb-8 fade-in" style={{ animationDelay: '500ms' }}>
          <Card className="shadow-xl border-2 overflow-hidden relative">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-success" />

            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">¿Qué sigue?</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pasos recomendados para tu camino exportador
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <p className="text-muted-foreground leading-relaxed">
                Este diagnóstico es el primer paso de tu camino exportador. Te recomendamos:
              </p>
              <div className="grid gap-3">
                {[
                  'Descarga el PDF y compártelo con tu equipo',
                  'Prioriza las brechas críticas identificadas',
                  'Contacta a PROMPERÚ para asesoría gratuita',
                  'Revisa los recursos sugeridos en cada brecha',
                  'Vuelve a hacer el diagnóstico en 3 meses para medir tu progreso'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 hover-lift">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium text-foreground pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <a
                  href="https://www.promperu.gob.pe/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="default"
                    size="lg"
                    className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Visitar PROMPERÚ</span>
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
