import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BffApiClient } from '../../../core/http/bff-api.client';
import { RestaurantsRepository } from '../application/restaurants.repository';
import { Restaurant } from '../domain/restaurant.model';

interface RestaurantDto {
  id: string;
  name: string;
  address: string;
  phone?: string;
  totalTransactions: number;
  totalVolume: number;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

@Injectable({ providedIn: 'root' })
export class BffRestaurantsRepository implements RestaurantsRepository {
  private readonly api = inject(BffApiClient);

  list(): Observable<Restaurant[]> {
    return this.api.get<RestaurantDto[]>('restaurants').pipe(
      map(restaurants => restaurants.map(restaurant => this.toDomain(restaurant))),
    );
  }

  saveAll(restaurants: readonly Restaurant[]): Observable<void> {
    return this.api.put<void, RestaurantDto[]>('restaurants/bulk', restaurants.map(restaurant => this.toDto(restaurant)));
  }

  upsert(restaurant: Restaurant): Observable<Restaurant> {
    return this.api.put<RestaurantDto, RestaurantDto>(
      `restaurants/${encodeURIComponent(restaurant.id)}`,
      this.toDto(restaurant),
    ).pipe(map(response => this.toDomain(response)));
  }

  private toDomain(dto: RestaurantDto): Restaurant {
    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      totalTransactions: dto.totalTransactions,
      totalVolume: dto.totalVolume,
      registrationDate: dto.registrationDate,
      status: dto.status === 'ACTIVE' ? 'Actif' : 'Inactif',
    };
  }

  private toDto(restaurant: Restaurant): RestaurantDto {
    return {
      ...restaurant,
      status: restaurant.status === 'Actif' ? 'ACTIVE' : 'INACTIVE',
    };
  }
}
