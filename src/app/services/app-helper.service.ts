import { Injectable } from '@angular/core';
import { EditorContextService } from '@magnolia/angular-editor';

@Injectable({
  providedIn: 'root'
})
export class AppHelperService {

  constructor(private editorContextService: EditorContextService) { }

  encodeValue(val): string {
    if (typeof encodeURIComponent === 'undefined') {
      return val;
    }
    return encodeURIComponent(val);
  }
  
  decodeValue(val): string {
    if (typeof decodeURIComponent === 'undefined') {
      return val;
    }
    return decodeURIComponent(val);
  }
  
  isPreviewAsVisitor(searchQuery): boolean {
    const searchParams = new URLSearchParams(searchQuery);
    return Boolean(searchParams.get('mgnlPreviewAsVisitor') === 'true');
  };
  
  getPersonalizationParams(searchQuery): object {
    const params = {};
    if (!this.editorContextService.inIframe()) {
      // Not in Page Editor
      return params;
    }
    const searchParams = new URLSearchParams(searchQuery);
    searchParams.forEach((value, key) => {
      if (key.startsWith('preview')) {
        params[key] = this.decodeValue(value);
      }
    });
    if (this.isPreviewAsVisitor(searchQuery)) {
      Object.assign(params, { mgnlPreviewAsVisitor: 'true' });
    } else {
      Object.assign(params, { variants: 'all' });
    }
    return params;
  };
  
  toSearchQuery(params): string {
    const queryString = Object.keys(params)
      .map(key => `${key}=${this.encodeValue(params[key])}`)
      .join('&');
    return queryString ? `?${queryString}` : '';
  };
}
