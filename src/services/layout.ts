import { Injectable, OnDestroy, signal } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService implements OnDestroy {
  
  private isMobileState = false;
  private destroy$ = new Subject<void>();

  constructor() {
    this.checkScreenSize();
    
    // Ouve o redimensionamento da tela
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkScreenSize();
      });
  }

  private checkScreenSize() {
    // 768px é o breakpoint padrão para tablets/mobile (Tailwind 'md')
    this.isMobileState = window.innerWidth < 768;
  }

  /**
   * Retorna true se estiver em dispositivo móvel
   */
  public isMobile(): boolean {
    this.checkScreenSize(); // Garante a checagem atual
    return this.isMobileState;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}