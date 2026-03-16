import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useTasks() {
  const { user } = useAuth()
  const uid = user?.uid
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const col = collection(db, 'users', uid, 'tasks')
    const q = query(col, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [uid])

  const col = () => collection(db, 'users', uid, 'tasks')
  const docRef = (id) => doc(db, 'users', uid, 'tasks', id)

  const addTask = (data) =>
    addDoc(col(), { ...data, done: false, createdAt: serverTimestamp() })

  const toggleTask = (id, currentDone) =>
    updateDoc(docRef(id), { done: !currentDone })

  const deleteTask = (id) =>
    deleteDoc(docRef(id))

  const updateTask = (id, data) =>
    updateDoc(docRef(id), data)

  return { tasks, loading, addTask, toggleTask, deleteTask, updateTask }
}
