import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getFirestore } from './getFirestore.js';
import { memoize } from '../../utils';
import { HttpError } from '../../classes';
import { Game } from '../../interfaces/game.js';

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
