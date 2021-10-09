import React, { useState, useEffect } from 'react';
import {
  Alert, 
  Button,
  FlatList,
  StyleSheet,
  Text, 
  TextInput,
  TouchableNativeFeedback, 
  View } from 'react-native';

import ENV from './env'
import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length)
  firebase.initializeApp(ENV)

const db = firebase.firestore()

export default function App() {
  const [lembrete, setLembrete] = useState('')
  const [lembretes, setLembretes] = useState([])



  useEffect(() => {
    db.collection('lembretes').onSnapshot((snapshot) => {
      let aux = []
      snapshot.forEach(doc => {
        aux.push({
          data: doc.data().data,
          texto: doc.data().texto,
          chave: doc.id
        })
      })
      setLembretes(aux)
      console.log("Lembretes")
      console.log(lembretes)
    })
  }, [])

  const capturarLembrete = (lembrete) => {
    setLembrete(lembrete)
  }

  const adicionarLembrete = () => {
    db.collection('lembretes').add({
      texto: lembrete,
      data: new Date()
    })
    setLembrete('')
  }

  const removerLembrete = (chave) => {
    Alert.alert(
      "Apagar?",
      "Quer mesmo apagar o seu lembrete?",
      [
        {
          text: 'Cancelar'
        },
        {
          text: 'Confirmar',
          onPress: () => db.collection('lembretes').doc(chave).delete()
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.entrada}
        placeholder="Digite seu lembrete"
        onChangeText={capturarLembrete}
        value={lembrete}
      />
      <View style={styles.botao}>
          <Button 
            title="OK"
            onPress={adicionarLembrete}
          />
      </View>
      <FlatList 
        style={{marginTop: 4}}
        data={lembretes}
        renderItem={lembrete => (
          <TouchableNativeFeedback 
            onLongPress={() => {removerLembrete(lembrete.item.chave)}}>
            <View
              style={styles.itemLista}>
              <Text>{lembrete.item.texto}</Text>
              <Text>{lembrete.item.data.toDate().toLocaleString()}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemLista: {
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 12

  },
  entrada: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    fontSize: 14,
    padding: 12,
    width: '80%',
    marginBottom: 12,
    textAlign: 'center'
  },
  botao: {
    width: '80%'
  }
});
