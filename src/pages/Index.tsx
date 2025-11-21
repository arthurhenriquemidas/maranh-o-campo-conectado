import sigamaLogo from "@/assets/sigama-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Activity, Leaf, Sprout, TreeDeciduous } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Header */}
      <header className="border-b bg-card shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img src={sigamaLogo} alt="SIGAMA Logo" className="h-14 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-primary">SIGAMA</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Ambiental do Maranhão</p>
            </div>
          </div>
          <Button variant="outline">Entrar</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            <Sprout className="h-10 w-10 text-secondary" />
            <TreeDeciduous className="h-8 w-8 text-accent" />
          </div>
          <h2 className="mb-3 text-4xl font-bold text-foreground">Bem-vindo ao SIGAMA</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Sistema Integrado de Gestão Ambiental voltado para o desenvolvimento sustentável 
            das áreas rurais do Estado do Maranhão
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Licenciamento */}
          <Card className="group transition-all hover:shadow-nature hover:scale-[1.02]">
            <CardHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Licenciamento</CardTitle>
              <CardDescription className="text-base">
                Gerencie licenças ambientais para atividades rurais, desmatamento autorizado e uso de recursos naturais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/licenciamento")}
              >
                Acessar Módulo
              </Button>
            </CardContent>
          </Card>

          {/* Fiscalização */}
          <Card className="group transition-all hover:shadow-nature hover:scale-[1.02]">
            <CardHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-warning/10 transition-colors group-hover:bg-warning/20">
                <Shield className="h-8 w-8 text-warning" />
              </div>
              <CardTitle className="text-2xl">Fiscalização</CardTitle>
              <CardDescription className="text-base">
                Controle e documentação de fiscalizações em campo, registro de infrações e acompanhamento de processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/fiscalizacao")}
              >
                Acessar Módulo
              </Button>
            </CardContent>
          </Card>

          {/* Monitoramento */}
          <Card className="group transition-all hover:shadow-nature hover:scale-[1.02]">
            <CardHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-success/10 transition-colors group-hover:bg-success/20">
                <Activity className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Monitoramento</CardTitle>
              <CardDescription className="text-base">
                Acompanhamento em tempo real de áreas rurais, cobertura vegetal e indicadores ambientais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/monitoramento")}
              >
                Acessar Módulo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 text-center shadow-md">
            <div className="mb-2 text-3xl font-bold text-primary">1.200+</div>
            <p className="text-sm text-muted-foreground">Propriedades Cadastradas</p>
          </div>
          <div className="rounded-lg bg-card p-6 text-center shadow-md">
            <div className="mb-2 text-3xl font-bold text-success">85%</div>
            <p className="text-sm text-muted-foreground">Áreas com Cobertura Adequada</p>
          </div>
          <div className="rounded-lg bg-card p-6 text-center shadow-md">
            <div className="mb-2 text-3xl font-bold text-warning">350</div>
            <p className="text-sm text-muted-foreground">Fiscalizações Este Ano</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t bg-card py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 SIGAMA - Sistema de Gestão Ambiental do Maranhão</p>
          <p className="mt-1">Governo do Estado do Maranhão - Secretaria de Meio Ambiente</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
