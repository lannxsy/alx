import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task === '') return;
    setTasks([...tasks, task]);
    setTask('');
  };

  const deleteTask = (index) => {
    let newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const editTask = (index) => {
    let newText = prompt("Edit tugas:");
    if (newText) {
      let newTasks = [...tasks];
      newTasks[index] = newText;
      setTasks(newTasks);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Do List</Text>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Tambah tugas..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={{ color: 'white' }}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text>{index + 1}. {item}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.edit} onPress={() => editTask(index)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={() => deleteTask(index)}>
                <Text style={{ color: 'white' }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f6f9'
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8
  },
  addBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8
  },
  row: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5
  },
  edit: {
    backgroundColor: 'yellow',
    padding: 5,
    borderRadius: 5
  },
  delete: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5
  }
});