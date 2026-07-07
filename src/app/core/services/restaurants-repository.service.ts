import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant.models';
import { DatasetStorageService } from './dataset-storage.service';

const RESTAURANTS_STORAGE_KEY = 'jp_restaurants_dataset';

const DEFAULT_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Restaurant Le Djolof', address: 'Mermoz', totalTransactions: 123, totalVolume: 892_998, registrationDate: '2026-04-15', status: 'Actif' },
  { id: '2', name: 'Le Plat', address: 'Karak', totalTransactions: 98, totalVolume: 450_000, registrationDate: '2026-04-10', status: 'Actif' },
  { id: '3', name: 'La Téranga', address: 'Fann', totalTransactions: 75, totalVolume: 320_500, registrationDate: '2026-03-22', status: 'Inactif' },
  { id: '4', name: 'Thiébou Ndar', address: 'Keur Gorgui', totalTransactions: 60, totalVolume: 215_300, registrationDate: '2026-03-15', status: 'Actif' },
  { id: '5', name: 'FoodGood', address: 'Medina', totalTransactions: 112, totalVolume: 610_000, registrationDate: '2026-03-01', status: 'Actif' },
  { id: '6', name: 'Dakar Bistro', address: 'Point E', totalTransactions: 44, totalVolume: 180_750, registrationDate: '2026-02-18', status: 'Inactif' },
  { id: '7', name: 'Chez Lamine', address: 'Ouakam', totalTransactions: 87, totalVolume: 390_000, registrationDate: '2026-02-05', status: 'Actif' },
  { id: '8', name: "Saveur d'Afrique", address: 'Plateau', totalTransactions: 55, totalVolume: 200_200, registrationDate: '2026-01-20', status: 'Actif' },
  { id: '9', name: 'Terranga Palace', address: 'Almadies', totalTransactions: 32, totalVolume: 130_100, registrationDate: '2026-01-12', status: 'Inactif' },
  { id: '10', name: "N'Gor Beach", address: "N'Gor", totalTransactions: 70, totalVolume: 160_000, registrationDate: '2025-12-10', status: 'Actif' },
];

@Injectable({ providedIn: 'root' })
export class RestaurantsRepositoryService {
  constructor(private readonly datasetStorage: DatasetStorageService) {}

  readAll(): Restaurant[] {
    return this.datasetStorage.readArray(RESTAURANTS_STORAGE_KEY, DEFAULT_RESTAURANTS);
  }

  saveAll(restaurants: Restaurant[]): void {
    this.datasetStorage.writeArray(RESTAURANTS_STORAGE_KEY, restaurants);
  }

  upsert(restaurant: Restaurant): void {
    const restaurantsById = new Map(this.readAll().map(current => [current.id, current]));
    restaurantsById.set(restaurant.id, restaurant);
    this.saveAll(Array.from(restaurantsById.values()));
  }
}
