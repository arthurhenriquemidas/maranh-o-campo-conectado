import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './components/custom-menu/custom-menu.component';
import { OnboardingFooterComponent } from './components/onboarding-footer/onboarding-footer.component';

@NgModule({
  declarations: [
    CustomMenuComponent,
    OnboardingFooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomMenuComponent,
    OnboardingFooterComponent
  ]
})
export class SharedModule { }
