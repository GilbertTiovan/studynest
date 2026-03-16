import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function usePlanner() {
  const { user } = useAuth()
  const uid = user?.uid
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const col = collection(db, 'users', uid, 'planner')
    const q = query(col, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [uid])

  const col = () => collection(db, 'users', uid, 'planner')
  const docRef = (id) => doc(db, 'users', uid, 'planner', id)

  const addEntry = (data) =>
    addDoc(col(), { ...data, createdAt: serverTimestamp() })

  const deleteEntry = (id) =>
    deleteDoc(docRef(id))

  const updateEntry = (id, data) =>
    updateDoc(docRef(id), data)

  return { entries, loading, addEntry, deleteEntry, updateEntry }
}
