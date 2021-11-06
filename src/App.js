import React, { useRef, useState } from 'react';
import './App.css';

// firebase sdk
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// firebase hooks
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

// Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyBzw0LRON4PdxqZ1Zvl4WeKzcz4-66klew",
  authDomain: "chatapp-songlin.firebaseapp.com",
  projectId: "chatapp-songlin",
  storageBucket: "chatapp-songlin.appspot.com",
  messagingSenderId: "230413036836",
  appId: "1:230413036836:web:2b3e6f2c925433fe53d7b1",
  measurementId: "G-JZW4MP4BNK"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section >
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {

    e.preventDefault()

    const { uid, photoURL } = auth.currentUser
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })

  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} placeholder="say something"/>
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>

    </>
  )

}

function ChatMessage(props) {
  const {text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p> 
    </div>
  )
}

export default App;
