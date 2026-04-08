import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/lib/firebase';

export default function LoginScreen() {
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

  const onLogin = async () => {
    if (!normalizedEmail || !password) {
      Alert.alert('Validasi', 'Email dan password wajib diisi.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const code = typeof e?.code === 'string' ? e.code : '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        Alert.alert('Gagal login', 'Email atau password salah.');
        return;
      }
      if (code === 'auth/user-not-found') {
        Alert.alert('Akun belum ada', 'Silakan register terlebih dulu.');
        return;
      }
      Alert.alert('Gagal login', e?.message ?? 'Terjadi kesalahan.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>Login</ThemedText>

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

        <Pressable style={styles.button} onPress={onLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </Pressable>

        <Link href="/register">
          <ThemedText style={styles.link}>Belum punya akun? Register</ThemedText>
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
    backgroundColor: '#3b82f6',
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