import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { brandPalette } from "@/design/tokens";

const presetCredentials = {
  username: "nilson.junior",
  password: "17Jrloopes!",
};

export function LoginPage() {
  const maskedPassword = useMemo(() => "●".repeat(presetCredentials.password.length), []);

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-4">
        <p className="text-eyebrow text-muted-foreground">PIXELLAB CAF</p>
        <h1 className="text-hero">Acesso inicial</h1>
        <p className="text-muted-foreground max-w-xl">
          Esta tela de login simula a entrada via provedor OAuth genérico (OIDC). Use as
          credenciais de demonstração abaixo ou configure o provedor real via variáveis de ambiente.
        </p>

        <Card title="Credenciais padrão" subtitle="Pré-configuradas para validação visual">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Login</span>
              <code className="px-3 py-1 rounded-md bg-[color:var(--muted)] text-card-foreground border border-border/60">
                {presetCredentials.username}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Senha</span>
              <code className="px-3 py-1 rounded-md bg-[color:var(--muted)] text-card-foreground border border-border/60">
                {presetCredentials.password}
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              Estas credenciais são ilustrativas e não executam autenticação real neste estágio inicial.
            </p>
          </div>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-8 space-y-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 20% 20%, ${brandPalette.techPurple}0a, transparent 45%)` }}
        />
        <div className="relative space-y-2">
          <h2 className="text-title-section">Entrar</h2>
          <p className="text-muted-foreground text-sm">Preencha para simular o fluxo de autenticação.</p>
        </div>
        <div className="relative space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Usuário</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
              defaultValue={presetCredentials.username}
              autoComplete="username"
              data-testid="auth-username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Senha</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
              type="password"
              defaultValue={presetCredentials.password}
              autoComplete="current-password"
              data-testid="auth-password"
            />
          </div>
          <button
            className="w-full py-3 rounded-lg bg-[color:var(--primary)] text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition"
            data-testid="auth-submit"
          >
            Entrar com OAuth genérico
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Senha mascarada: {maskedPassword}. O fluxo real deve redirecionar para o provedor configurado
            e retornar para `/auth/callback` com o código de autorização.
          </p>
        </div>
      </div>
    </div>
  );
}
