import { Component, Input } from '@angular/core';

interface StaticArea {
  text: string;
}

@Component({
  template: `
    <div class="content-background">
      <div editable-area [content]="header"></div>
      <main class="container">
        <h1>{{title}}</h1>
        <div class="col-12">
          <h2>Standard area:</h2>
          <div editable-area [content]="mainArea"></div>
        </div>

        <div class="col-12">
          <h2>Flex-box area</h2>
          <div editable-area [content]="mainArea" [customView]="templateScript">
          </div>
        </div>

        <ng-template #templateScript let-content let-components="components">
          <div>
            <div class="flex-box">
              <ng-container *ngFor="let childContent of components">
                <editable-component [content]="childContent"></editable-component>
              </ng-container>
            </div>
          </div>
        </ng-template>

        <div class="col-12">
          <h2>Custom area:</h2>
          <div custom-area [content]="customArea"></div>
        </div>

        <div class="col-12">
          <h2>NoComponent area:</h2>
          <div editable-area [content]="staticArea">
            <div class="alert alert-primary" role="alert">{{ staticArea.text }}</div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    '.flex-box { display: flex;}',
    '.flex-box > * { width: 30%}'
  ]
})
export class HomeComponent {
  // properties
  @Input() title: string;
  // areas
  @Input() header: object;
  @Input() mainArea: object;
  @Input() staticArea: StaticArea;
  @Input() customArea: object;
}
