import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const router = useRouter();
  const tasksCollectionRef = collection(db, "tasks");

  const fetchTasks = async () => {
    try {
      if (!auth.currentUser) return;

      const q = query(
        tasksCollectionRef,
        where("userId", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const allTasks = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      setTasks(allTasks);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchTasks();
    }
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;

    try {
      if (!auth.currentUser) return;

      await addDoc(tasksCollectionRef, {
        text: task.trim(),
        done: false,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid
      });

      setTask('');
      fetchTasks();
    } catch (err) {
      console.log("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      fetchTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  const editTask = async (id, currentText) => {
    const newText = prompt("Edit tugas:", currentText);
    if (newText && newText.trim()) {
      try {
        await updateDoc(doc(db, "tasks", id), { text: newText.trim() });
        fetchTasks();
      } catch (err) {
        console.log("Error editing task:", err);
      }
    }
  };

  const toggleDone = async (id, currentDone) => {
    try {
      await updateDoc(doc(db, "tasks", id), { done: !currentDone });
      fetchTasks();
    } catch (err) {
      console.log("Error toggling done:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (err) {
      console.log("Error logout:", err);
    }
  };

  return (
    <View style={styles.container}>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>To Do List</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Tambah tugas..."
            placeholderTextColor="#888"
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks.sort((a,b)=> (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.rowText, item.done && styles.doneText]}>
                {index + 1}. {item.text}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.edit} onPress={() => editTask(item.id, item.text)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.delete} onPress={() => deleteTask(item.id)}>
                  <Text style={styles.deleteText}>Hapus</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.doneBtn} onPress={() => toggleDone(item.id, item.done)}>
                  <Text style={styles.doneTextBtn}>{item.done ? "Undo" : "Done"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },

  card: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },

  inputGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    backgroundColor: '#121212',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },

  addBtn: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  row: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  rowText: {
    color: 'white',
    fontSize: 16,
  },

  doneText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  edit: {
    backgroundColor: '#facc15',
    padding: 6,
    borderRadius: 6,
  },

  editText: {
    fontWeight: 'bold',
  },

  delete: {
    backgroundColor: '#dc2626',
    padding: 6,
    borderRadius: 6,
  },

  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },

  doneBtn: {
    backgroundColor: '#2563eb',
    padding: 6,
    borderRadius: 6,
  },

  doneTextBtn: {
    color: 'white',
    fontWeight: 'bold',
  },

  logoutBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#dc2626',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 999,
  },

  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});