import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COLLECTION = 'planner'

export function usePlanner() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addEntry = (data) =>
    addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })

  const deleteEntry = (id) =>
    deleteDoc(doc(db, COLLECTION, id))

  const updateEntry = (id, data) =>
    updateDoc(doc(db, COLLECTION, id), data)

  return { entries, loading, addEntry, deleteEntry, updateEntry }
}
