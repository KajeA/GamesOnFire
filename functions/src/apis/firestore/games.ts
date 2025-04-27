import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getFirestore } from './getFirestore.js';
import { memoize } from '../../utils';
import { HttpError } from '../../classes';
import { Game } from '../../interfaces/game.js';
import * as fs from 'fs';
import * as path from 'path';

const getCollection = memoize(() =>
  getFirestore().collection('games'),
);

// Get all games
export async function getGames(): Promise<Game[]> {
  try {
    const result = await getCollection().get();
    return result.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({
      id: snap.id,
      ...snap.data()
    })) as Game[];
  } catch (error) {
    console.error('Error fetching games:', error);
    throw new HttpError('Error while fetching games', 500);
  }
}

// Get one game by ID
export async function getGame(id: string): Promise<Game> {
  try {
    const doc = await getCollection().doc(id).get();

    if (!doc.exists) {
      throw new HttpError('Game not found', 404);
    }

    return { id: doc.id, ...doc.data() } as Game;
  } catch (error) {
    console.error('Error fetching game:', error);
    throw new HttpError('Error while fetching game', 500);
  }
}

// Add a game
export async function addGame(gameData: Omit<Game, 'id'>): Promise<Game> {
  try {
    const docRef = await getCollection().add(gameData);
    return { id: docRef.id, ...gameData };
  } catch (error) {
    console.error('Error adding game:', error);
    throw new HttpError('Error while adding game', 500);
  }
}

// Update a game
export async function updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
  try {
    const docRef = getCollection().doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new HttpError('Game not found', 404);
    }

    await docRef.update(gameData);
    const updatedDoc = await docRef.get();

    return { id, ...updatedDoc.data() } as Game;
  } catch (error) {
    console.error('Error updating game:', error);
    throw new HttpError('Error while updating game', 500);
  }
}

// Delete a game
export async function deleteGame(id: string): Promise<void> {
  try {
    const docRef = getCollection().doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new HttpError('Game not found', 404);
    }

    await docRef.delete();
  } catch (error) {
    console.error('Error deleting game:', error);
    throw new HttpError('Error while deleting game', 500);
  }
}

// Seed the database with initial data
export async function seedDatabase(): Promise<{ count: number }> {
  try {
    const gamesPath = path.join(process.cwd(), '..', 'games.json');
    const gamesData: Game[] = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

    const batch = getFirestore().batch();

    const existingGames = await getCollection().get();
    existingGames.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    for (const game of gamesData) {
      const docRef = getCollection().doc(game.id);
      batch.set(docRef, game);
    }

    await batch.commit();

    return { count: gamesData.length };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw new HttpError('Error while seeding database', 500);
  }
}
