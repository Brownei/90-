import { atom } from 'jotai';
import { Web3Auth } from '@web3auth/modal';
import { IProvider, } from '@web3auth/base';

type AuthUserInfo = {
  profileImage?: string
  name?: string
  email?: string
  idToken?: string
}

// Create atoms for the Nav component state
export const userAtom = atom<AuthUserInfo | null>(null)
export const scrolledAtom = atom<boolean>(false);
export const providerAtom = atom<IProvider | null>(null);
export const loggedInAtom = atom<boolean>(false);
export const web3authAtom = atom<Web3Auth | null>(null);
export const isWeb3AuthInitializedAtom = atom<boolean>(false); 
