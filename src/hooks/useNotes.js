import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useNotes() {
  const { user } = useAuth()
  const uid = user?.uid
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const col = collection(db, 'users', uid, 'notes')
    const q = query(col, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [uid])

  const col = () => collection(db, 'users', uid, 'notes')
  const docRef = (id) => doc(db, 'users', uid, 'notes', id)

  const addNote = (data) =>
    addDoc(col(), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })

  const updateNote = (id, data) =>
    updateDoc(docRef(id), { ...data, updatedAt: serverTimestamp() })

  const deleteNote = (id) =>
    deleteDoc(docRef(id))

  return { notes, loading, addNote, updateNote, deleteNote }
}
