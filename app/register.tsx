import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/lib/firebase';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.replace('/(tabs)');
    });
    return unsubscribe;
  }, [router]);

  const onCreateAccount = async () => {
    if (!normalizedEmail || !password) {
      Alert.alert('Validasi', 'Email dan password wajib diisi.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const code = typeof e?.code === 'string' ? e.code : '';
      if (code === 'auth/email-already-in-use') {
        Alert.alert('Register gagal', 'Email sudah terdaftar. Silakan login.');
        return;
      }
      if (code === 'auth/weak-password') {
        Alert.alert('Register gagal', 'Password terlalu lemah (minimal 6 karakter).');
        return;
      }
      if (code === 'auth/invalid-email') {
        Alert.alert('Register gagal', 'Format email tidak valid.');
        return;
      }
      Alert.alert('Register gagal', e?.message ?? 'Terjadi kesalahan.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>Register</ThemedText>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={onCreateAccount}>
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        </Pressable>

        <Link href="/login">
          <ThemedText style={styles.link}>Sudah punya akun? Login</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 16,
  },
  card: {
    width: '85%',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 10,
    color: 'white',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#60a5fa',
    marginTop: 10,
  },
});