import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Wind, 
  Thermometer,
  Trees,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Monitoramento = () => {
  const navigate = useNavigate();

  const areas = [
    { 
      id: 1, 
      nome: "Área de Preservação Norte", 
      municipio: "Imperatriz",
      cobertura: 85, 
      status: "Boa", 
      alerta: false,
      dados: { temperatura: "28°C", umidade: "65%", qualidadeAr: "Boa" }
    },
    { 
      id: 2, 
      nome: "Reserva Florestal Sul", 
      municipio: "São Luís",
      cobertura: 62, 
      status: "Atenção", 
      alerta: true,
      dados: { temperatura: "31°C", umidade: "52%", qualidadeAr: "Moderada" }
    },
    { 
      id: 3, 
      nome: "Mata Ciliar Rio Parnaíba", 
      municipio: "Caxias",
      cobertura: 78, 
      status: "Boa", 
      alerta: false,
      dados: { temperatura: "27°C", umidade: "70%", qualidadeAr: "Boa" }
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Boa": return "success";
      case "Atenção": return "warning";
      case "Crítica": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <header className="border-b bg-card shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success text-success-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Monitoramento Ambiental</h1>
              <p className="text-sm text-muted-foreground">Acompanhamento em tempo real de áreas rurais</p>
            </div>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">Voltar</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        {/* Overview Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Trees className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">75%</p>
                <p className="text-sm text-muted-foreground">Cobertura Média</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  +5% este mês
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">62%</p>
                <p className="text-sm text-muted-foreground">Umidade</p>
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  -3% esta semana
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Thermometer className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">29°C</p>
                <p className="text-sm text-muted-foreground">Temperatura</p>
                <div className="flex items-center gap-1 text-xs text-warning">
                  <TrendingUp className="h-3 w-3" />
                  +2°C hoje
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Wind className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">Boa</p>
                <p className="text-sm text-muted-foreground">Qualidade do Ar</p>
                <p className="text-xs text-muted-foreground">
                  Índice: 45
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="areas" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="areas">Áreas Monitoradas</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="areas" className="space-y-4">
            {areas.map((area) => (
              <Card key={area.id} className="transition-all hover:shadow-nature">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <Trees className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{area.nome}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {area.municipio}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {area.alerta && (
                        <Badge variant="destructive">
                          Alerta
                        </Badge>
                      )}
                      <Badge variant={getStatusColor(area.status) as any}>
                        {area.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cobertura Vegetal</span>
                      <span className="font-medium">{area.cobertura}%</span>
                    </div>
                    <Progress value={area.cobertura} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                    <div className="text-center">
                      <Thermometer className="mx-auto mb-1 h-4 w-4 text-warning" />
                      <p className="text-xs text-muted-foreground">Temperatura</p>
                      <p className="font-medium">{area.dados.temperatura}</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="mx-auto mb-1 h-4 w-4 text-primary" />
                      <p className="text-xs text-muted-foreground">Umidade</p>
                      <p className="font-medium">{area.dados.umidade}</p>
                    </div>
                    <div className="text-center">
                      <Wind className="mx-auto mb-1 h-4 w-4 text-accent" />
                      <p className="text-xs text-muted-foreground">Qualidade</p>
                      <p className="font-medium">{area.dados.qualidadeAr}</p>
                    </div>
                  </div>

                  <Button size="sm" className="w-full">Ver Detalhes Completos</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card className="border-warning shadow-nature">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <TrendingDown className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Redução de Cobertura</CardTitle>
                    <CardDescription>Reserva Florestal Sul - São Luís</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detectada redução de 8% na cobertura vegetal nos últimos 30 dias. Recomenda-se vistoria presencial.
                </p>
                <Button size="sm" variant="outline" className="mt-4">
                  Agendar Vistoria
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive shadow-nature">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <Thermometer className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Temperatura Elevada</CardTitle>
                    <CardDescription>Área de Preservação Norte - Imperatriz</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Temperatura acima de 35°C detectada. Risco elevado de incêndio florestal.
                </p>
                <Button size="sm" variant="destructive" className="mt-4">
                  Ativar Protocolo de Emergência
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Monitoramento;
