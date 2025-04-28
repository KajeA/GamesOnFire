import type { Firestore } from 'firebase-admin/firestore';
import { getFirestore as createFirestore } from 'firebase-admin/firestore';
import { getApp } from '../firebase-admin';
import { memoize } from '../../utils';

export const getFirestore = memoize((): Firestore => createFirestore(getApp()));
