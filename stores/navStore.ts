import { atom } from 'jotai';
import { Web3Auth } from '@web3auth/modal';
import { IProvider } from '@web3auth/base';

// Create atoms for the Nav component state
export const scrolledAtom = atom<boolean>(false);
export const providerAtom = atom<IProvider | null>(null);
export const loggedInAtom = atom<boolean>(false);
export const web3authAtom = atom<Web3Auth | null>(null);
export const isWeb3AuthInitializedAtom = atom<boolean>(false); 