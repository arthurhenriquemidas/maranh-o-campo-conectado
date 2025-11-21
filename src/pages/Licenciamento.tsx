import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Plus, Leaf, Tractor, Trees } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Licenciamento = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const licenses = [
    { id: 1, proprietario: "João Silva", propriedade: "Fazenda Esperança", tipo: "Desmatamento", status: "Aprovada", area: "50 ha" },
    { id: 2, proprietario: "Maria Santos", propriedade: "Sítio Palmeiras", tipo: "Irrigação", status: "Em análise", area: "25 ha" },
    { id: 3, proprietario: "Pedro Costa", propriedade: "Chácara Verde", tipo: "Extração", status: "Pendente", area: "15 ha" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada": return "success";
      case "Em análise": return "warning";
      case "Pendente": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <header className="border-b bg-card shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Licenciamento Ambiental</h1>
              <p className="text-sm text-muted-foreground">Gestão de licenças para atividades rurais</p>
            </div>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">Voltar</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Licenças</TabsTrigger>
            <TabsTrigger value="new">Nova Licença</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Search */}
            <Card className="shadow-nature">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Buscar Licenças
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por proprietário, propriedade ou tipo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button>Buscar</Button>
                </div>
              </CardContent>
            </Card>

            {/* Licenses List */}
            <div className="grid gap-4">
              {licenses.map((license) => (
                <Card key={license.id} className="transition-all hover:shadow-nature">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                          <Tractor className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{license.propriedade}</CardTitle>
                          <CardDescription>{license.proprietario}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(license.status) as any}>
                        {license.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">Tipo</p>
                        <p className="font-medium">{license.tipo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Área</p>
                        <p className="font-medium">{license.area}</p>
                      </div>
                      <div className="col-span-2">
                        <Button size="sm" className="w-full">Ver Detalhes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <Card className="shadow-nature">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <Plus className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <CardTitle>Nova Solicitação de Licença</CardTitle>
                    <CardDescription>Preencha os dados para solicitar uma licença ambiental</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="proprietario">Nome do Proprietário</Label>
                    <Input id="proprietario" placeholder="Nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propriedade">Nome da Propriedade</Label>
                    <Input id="propriedade" placeholder="Nome da fazenda/sítio" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Área (hectares)</Label>
                    <Input id="area" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipio">Município</Label>
                    <Input id="municipio" placeholder="Cidade" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Licença</Label>
                    <Input id="tipo" placeholder="Ex: Desmatamento, Irrigação" />
                  </div>
                </div>
                
                <div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-6 text-center">
                  <Leaf className="mx-auto h-12 w-12 text-primary/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Arraste documentos ou clique para fazer upload
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    CAR, escritura, planta da área, etc.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" size="lg">Solicitar Licença</Button>
                  <Button variant="outline" size="lg">Limpar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Licenciamento;
