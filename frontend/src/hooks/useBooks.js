import { useEffect, useState, useCallback } from 'react'
import { api } from '@/services/api'

export function useBooks(currentPage = 1) {
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [availableCategories, setAvailableCategories] = useState([])
  const [availableYears, setAvailableYears] = useState([])
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/books?page=${currentPage}`)
      setBooks(res.data.books)
      setTotalPages(res.data.totalPages)
      setTotalBooks(res.data.totalBooks)
      setAvailableCategories(res.data.availableCategories)
      setAvailableYears(res.data.availableYears)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return { books, totalPages, totalBooks, loading, availableCategories, availableYears, fetchBooks }
}
