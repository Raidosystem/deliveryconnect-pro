import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Estado para armazenar nosso valor
  // Passa a função inicial para useState para que a lógica seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // Obtém do local storage pela chave
      const item = window.localStorage.getItem(key)
      // Parse do JSON armazenado ou retorna initialValue se não houver
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se erro também retorna initialValue
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // Retorna uma versão envolvida da função setValue do useState que...
  // ... persiste o novo valor no localStorage.
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Permite que o valor seja uma função para que tenhamos a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salva o estado
      setStoredValue(valueToStore)
      // Salva no local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // Uma implementação mais avançada lidaria com o erro de caso
      // o armazenamento esteja cheio
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  // Sincronizar com outras abas/janelas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing storage event for ${key}:`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
