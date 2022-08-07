import Service from '@ember/service';

declare module '@ember/service' {
  interface Registry {
    [name: string]: Service;
  }
}
