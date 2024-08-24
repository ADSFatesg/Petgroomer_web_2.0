import { TestBed } from '@angular/core/testing';

import { ErroInterceptorService } from './erro-interceptor.service';

describe('ErroInterceptorService', () => {
  let service: ErroInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErroInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
