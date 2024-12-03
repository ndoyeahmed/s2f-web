import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDTO } from '../../shared/models/client-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private readonly http: HttpClient) { }

  addClient(client: any) {
    return this.http.post(`/api/v1/clients`, client);
  }

  getAllClientNotArchived() {
    return this.http.get<ClientDTO[]>(`/api/v1/clients`);
  }
}
