-- PIXELLAB base schema
CREATE TABLE IF NOT EXISTS medicamentos_mestres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo varchar(120) NOT NULL,
  nome text NOT NULL,
  apresentacao text NOT NULL,
  classe_terapeutica text NOT NULL,
  status_regulatorio varchar(64) NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS unidades_saude (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo varchar(64) NOT NULL DEFAULT 'unidade',
  cidade varchar(120),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS estoque (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicamento_id uuid NOT NULL REFERENCES medicamentos_mestres(id),
  unidade_id uuid NOT NULL REFERENCES unidades_saude(id),
  lote varchar(80) NOT NULL,
  validade date NOT NULL,
  quantidade integer NOT NULL,
  suficiencia_dias integer,
  curva_abc varchar(2) DEFAULT 'C',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estoque_id uuid NOT NULL REFERENCES estoque(id),
  tipo varchar(24) NOT NULL,
  quantidade integer NOT NULL,
  motivo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pms_pacientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  documento varchar(32) NOT NULL,
  data_nascimento date,
  unidade_id uuid REFERENCES unidades_saude(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pms_pareceres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES pms_pacientes(id),
  profissional text,
  parecer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pms_evolucoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES pms_pacientes(id),
  observacao text NOT NULL,
  profissional text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pms_dispensacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL REFERENCES pms_pacientes(id),
  estoque_id uuid REFERENCES estoque(id),
  medicamento_id uuid NOT NULL REFERENCES medicamentos_mestres(id),
  quantidade integer NOT NULL,
  comprovante_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
