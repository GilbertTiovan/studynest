import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COLLECTION = 'tasks'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addTask = (data) =>
    addDoc(collection(db, COLLECTION), {
      ...data,
      done: false,
      createdAt: serverTimestamp()
    })

  const toggleTask = (id, currentDone) =>
    updateDoc(doc(db, COLLECTION, id), { done: !currentDone })

  const deleteTask = (id) =>
    deleteDoc(doc(db, COLLECTION, id))

  const updateTask = (id, data) =>
    updateDoc(doc(db, COLLECTION, id), data)

  return { tasks, loading, addTask, toggleTask, deleteTask, updateTask }
}
