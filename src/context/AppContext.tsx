"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AnimalType = 'Vaca' | 'Toro' | 'Novillo' | 'Ternera' | 'Vaquillona' | 'Ternero';

export interface Animal {
    id: string;
    type: AnimalType;
    caravana: string; // New field
    vaccination: boolean;
    antiparasitic: boolean;
}

interface AppContextType {
    animals: Animal[];
    addAnimal: (type: AnimalType) => void;
    removeAnimal: (id: string) => void;
    toggleAttribute: (id: string, attribute: 'vaccination' | 'antiparasitic') => void;
    updateCaravana: (id: string, value: string) => void;
    clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [animals, setAnimals] = useState<Animal[]>([]);

    // Load from local storage on mount (optional, helps persistence during dev)
    useEffect(() => {
        const storedAnimals = localStorage.getItem('animals');
        if (storedAnimals) {
            setAnimals(JSON.parse(storedAnimals));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('animals', JSON.stringify(animals));
    }, [animals]);

    const addAnimal = (type: AnimalType) => {
        const newAnimal: Animal = {
            id: crypto.randomUUID(),
            type,
            caravana: '', // Initialize empty
            vaccination: false,
            antiparasitic: false,
        };
        setAnimals(prev => [...prev, newAnimal]);
    };

    const removeAnimal = (id: string) => {
        setAnimals(prev => prev.filter(a => a.id !== id));
    };

    const toggleAttribute = (id: string, attribute: 'vaccination' | 'antiparasitic') => {
        setAnimals(prev => prev.map(a =>
            a.id === id ? { ...a, [attribute]: !a[attribute] } : a
        ));
    };

    const updateCaravana = (id: string, value: string) => {
        setAnimals(prev => prev.map(a =>
            a.id === id ? { ...a, caravana: value } : a
        ));
    };

    const clearAll = () => setAnimals([]);

    return (
        <AppContext.Provider value={{ animals, addAnimal, removeAnimal, toggleAttribute, updateCaravana, clearAll }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
