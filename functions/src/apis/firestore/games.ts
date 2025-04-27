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
