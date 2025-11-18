export interface ModuleTag {
  name: string;
  label: string;
  severity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
  class?: string;
  icon?: string;
}

export const MODULE_TAGS: ModuleTag[] = [
  { name: 'GESTÃO', label: 'Gestão', severity: 'info', class: 'module-gestao', icon: 'pi pi-briefcase' },
  { name: 'SEGURANÇA', label: 'Segurança', severity: 'danger', class: 'module-seguranca', icon: 'pi pi-shield' },
  { name: 'MEIO AMBIENTE', label: 'Meio Ambiente', severity: 'success', class: 'module-meio-ambiente', icon: 'pi pi-globe' },
  { name: 'OPERAÇÃO', label: 'Operação', severity: 'info', class: 'module-operacao', icon: 'pi pi-cog' },
  { name: 'EQUIPAMENTOS ROTATIVOS', label: 'Equip. Rotativos', severity: 'warn', class: 'module-rotativos', icon: 'pi pi-refresh' },
  { name: 'INSPEÇÃO INTEGRIDADE', label: 'Inspeção e Integridade', severity: 'secondary', class: 'module-inspecao', icon: 'pi pi-search' },
  { name: 'EQUIPAMENTOS ESTÁTICOS', label: 'Equip. Estáticos', severity: 'contrast', class: 'module-estaticos', icon: 'pi pi-box' },
  { name: 'FABRICAÇÃO', label: 'Fabricação', severity: 'info', class: 'module-fabricacao', icon: 'pi pi-hammer' },
  { name: 'ELÉTRICA', label: 'Elétrica', severity: 'warn', class: 'module-eletrica', icon: 'pi pi-bolt' },
  { name: 'AUTOMAÇÃO', label: 'Automação', severity: 'success', class: 'module-automacao', icon: 'pi pi-sliders-h' },
  { name: 'INSTRUMENTAÇÃO', label: 'Instrumentação', severity: 'info', class: 'module-instrumentacao', icon: 'pi pi-slack' },
  { name: 'TUBULAÇÕES E ESTRUTURAS', label: 'Tubulações e Estruturas', severity: 'secondary', class: 'module-tubulacoes', icon: 'pi pi-sitemap' },
  { name: 'CONDICIONAMENTO', label: 'Condicionamento', severity: 'warn', class: 'module-condicionamento', icon: 'pi pi-filter' },
  { name: 'ARMAZENAMENTO', label: 'Armazenamento', severity: 'info', class: 'module-armazenamento', icon: 'pi pi-inbox' },
  { name: 'COMISSIONAMENTO', label: 'Comissionamento', severity: 'success', class: 'module-comissionamento', icon: 'pi pi-check-square' },
  { name: 'SGQP', label: 'SGQP', severity: 'contrast', class: 'module-sgqp', icon: 'pi pi-verified' },
];
