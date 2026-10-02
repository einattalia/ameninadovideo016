'use client';
import {createContext,useContext} from 'react';
import {defaultContent,type PortfolioContent} from '@/lib/cms-model';
const Context=createContext<PortfolioContent>(defaultContent);
export function PortfolioProvider({content,children}:{content:PortfolioContent;children:React.ReactNode}){return <Context.Provider value={content}>{children}</Context.Provider>}
export function usePortfolio(){return useContext(Context)}
