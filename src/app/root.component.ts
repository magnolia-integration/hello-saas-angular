import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { EditorContextService } from '@magnolia/angular-editor';
import { TextImageComponent } from './components/textImage.component';
import { TwoColumnsComponent } from './components/twoColumns.component';
import { AboutComponent } from './pages/about.component';

import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NavigationComponent } from './components/navigation.component';
import { CardComponent } from './components/card.component';
import { AlertComponent } from './components/alert.component';
import { Location } from '@angular/common';
import { AppHelperService } from './services/app-helper.service';

@Component({
  template: '<editable-page [content]="content"></editable-page>',
})
export class RootComponent {
  @Input() content: any;

  constructor(private http: HttpClient, private router: Router, private editorContext: EditorContextService, private location: Location, public appHelperService: AppHelperService) {
    this.editorContext.setComponentMapping({
      'angular-magnolia-int:pages/home': HomeComponent,
      'angular-magnolia-int:pages/about': AboutComponent,
      'angular-magnolia-int:components/textImage': TextImageComponent,
      'angular-magnolia-int:components/twoColumns': TwoColumnsComponent,
      'angular-magnolia-int:components/card': CardComponent,
      'angular-magnolia-int:components/alert': AlertComponent,
      'angular-magnolia-int:components/navigation': NavigationComponent,
    });

    // refresh the content on navigation event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const pos = event.url.indexOf('?');
        const search = pos != -1 ? event.url.substring(pos) : '';
        this.getContent(location.prepareExternalUrl(event.url), search);
      }
    });
  }

  private getContent(location: string, search: string): void {
    const version = this.getVersion(location);
    // strip context and everything after '.html' or question mark from window location to get the JCR path only
    location = location.replace(/(\.html|\?).*$/, '');
    const path = environment.serverPath ? location.substr(environment.serverPath.length) : location;
    // get personalization content
    const params = this.appHelperService.getPersonalizationParams(search);
    if (version) {
      Object.assign(params, { version });
    }
    const searchQuery = this.appHelperService.toSearchQuery(params);
    // request the template annotations
    this.http.get(environment.templateAnnotationsBase + path).subscribe(annotations => {
      this.editorContext.setTemplateAnnotations(annotations);
      console.log("got annotations")
    });
    // request the content itself
    this.http.get(`${version ? environment.restPreviewUrlBase : environment.restUrlBase}${path}${searchQuery}`)
        .subscribe(content => {
        this.content = content;
        //this.editorContext.refresh()
        console.log("got content")
    });
  }

  private getVersion(location: string): string {
    return new URLSearchParams(location).get('mgnlVersion');
  }
}
