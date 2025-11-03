import { Injectable } from '@angular/core';
import { MODULE_TAGS, ModuleTag } from '../constants/modulo-tags';

@Injectable({
  providedIn: 'root'
})
export class ModuleTagService {

  /** Busca o módulo pelo nome (case insensitive) */
  getByName(name: string): ModuleTag | undefined {
    if (!name) return undefined;
    return MODULE_TAGS.find(
      tag => tag.name.toLowerCase() === name.toLowerCase()
    );
  }

  /** Retorna o ícone associado ao módulo */
  getIcon(name: string): string | undefined {
    return this.getByName(name)?.icon;
  }

  /** Retorna a classe CSS associada ao módulo */
  getClass(name: string): string | undefined {
    return this.getByName(name)?.class;
  }

  /** Retorna o label amigável do módulo */
  getLabel(name: string): string | undefined {
    return this.getByName(name)?.label;
  }

  /** Retorna a severity do módulo (opcional, caso use p-tag severity) */
  getSeverity(name: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    return this.getByName(name)?.severity;
  }
}