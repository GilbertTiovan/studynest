import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COLLECTION = 'notes'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addNote = (data) =>
    addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })

  const updateNote = (id, data) =>
    updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() })

  const deleteNote = (id) =>
    deleteDoc(doc(db, COLLECTION, id))

  return { notes, loading, addNote, updateNote, deleteNote }
}
