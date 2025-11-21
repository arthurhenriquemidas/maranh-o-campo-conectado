import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, MapPin, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Fiscalizacao = () => {
  const navigate = useNavigate();

  const fiscalizacoes = [
    { 
      id: 1, 
      local: "Fazenda Esperança", 
      municipio: "Imperatriz", 
      tipo: "Desmatamento irregular", 
      status: "Concluída", 
      data: "15/11/2024",
      gravidade: "Alta"
    },
    { 
      id: 2, 
      local: "Sítio das Palmeiras", 
      municipio: "São Luís", 
      tipo: "Uso irregular de água", 
      status: "Em andamento", 
      data: "18/11/2024",
      gravidade: "Média"
    },
    { 
      id: 3, 
      local: "Chácara Verde", 
      municipio: "Caxias", 
      tipo: "Extração irregular", 
      status: "Pendente", 
      data: "20/11/2024",
      gravidade: "Baixa"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída": return "success";
      case "Em andamento": return "warning";
      case "Pendente": return "destructive";
      default: return "secondary";
    }
  };

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case "Alta": return "destructive";
      case "Média": return "warning";
      case "Baixa": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <header className="border-b bg-card shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning text-warning-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Fiscalização Ambiental</h1>
              <p className="text-sm text-muted-foreground">Monitoramento e controle de atividades rurais</p>
            </div>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">Voltar</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-nature">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Fiscalizações</TabsTrigger>
            <TabsTrigger value="new">Nova Fiscalização</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {fiscalizacoes.map((fisc) => (
              <Card key={fisc.id} className="transition-all hover:shadow-nature">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                        <Shield className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{fisc.local}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {fisc.municipio}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getGravidadeColor(fisc.gravidade) as any}>
                        {fisc.gravidade}
                      </Badge>
                      <Badge variant={getStatusColor(fisc.status) as any}>
                        {fisc.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p className="font-medium">{fisc.tipo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data</p>
                      <p className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3 w-3" />
                        {fisc.data}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Button size="sm" className="w-full">Ver Relatório</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <Card className="shadow-nature">
              <CardHeader>
                <CardTitle>Registrar Nova Fiscalização</CardTitle>
                <CardDescription>Documente a fiscalização realizada em campo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="local">Local da Fiscalização</Label>
                    <Input id="local" placeholder="Nome do local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipio">Município</Label>
                    <Input id="municipio" placeholder="Cidade" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordenadas">Coordenadas GPS</Label>
                    <Input id="coordenadas" placeholder="Latitude, Longitude" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-fisc">Data da Fiscalização</Label>
                    <Input id="data-fisc" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo-fisc">Tipo de Fiscalização</Label>
                    <Input id="tipo-fisc" placeholder="Ex: Desmatamento, Poluição" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gravidade">Gravidade</Label>
                    <Input id="gravidade" placeholder="Alta, Média, Baixa" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Descreva os detalhes da fiscalização..."
                    rows={5}
                  />
                </div>

                <div className="rounded-lg border-2 border-dashed border-warning/20 bg-warning/5 p-6 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-warning/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Adicionar fotos da fiscalização
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Evidências fotográficas são importantes para o relatório
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" size="lg">Salvar Fiscalização</Button>
                  <Button variant="outline" size="lg">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Fiscalizacao;
