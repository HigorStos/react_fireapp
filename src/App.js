import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  addDoc,
  getDocs,
  // getDoc,
  updateDoc,
  // setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import "./App.css";

const App = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
          setUser(true);
        } else {
          setUserDetail({});
          setUser(false);
        }
      });
    }

    checkLogin();
  }, []);

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("DADOS REGISTRADO NO BANCO!");
    //   })
    //   .catch((erro) => {
    //     console.log("GEROU ERRO" + erro);
    //   });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("CADASTRADO COM SUCESSO");
        setTitulo("");
        setAutor("");
      })
      .catch((erro) => {
        console.log("ERRO" + erro);
      });
  }

  async function buscarPost() {
    // await getDoc(doc(db, "posts", "12345"))
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch(() => {
    //     console.log("ERRO AO BUSCAR");
    //   });

    await getDocs(collection(db, "posts"))
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })
      .catch(() => {
        console.log("DEU ALGUM ERRO AO BUSCAR");
      });
  }

  async function editarPost() {
    await updateDoc(doc(db, "posts", idPost), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  async function excluirPost(id) {
    await deleteDoc(doc(db, "posts", id))
      .then(() => {
        alert("POST DELETADO COM SUCESSO!");
      })
      .catch(() => {
        console.log("ERRO AO DELETAR POST");
      });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("CADASTRADO COM SUCESSO!");

        setEmail("");
        setSenha("");
      })
      .catch((erro) => {
        if (erro.code === "auth/weak-password") {
          alert("Senha muito fraca.");
        } else if (erro.code === "auth/email-already-in-use") {
          alert("Email já existe!");
        }
      });
  }

  async function logarUsuario() {
    signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USER LOGADO COM SUCESSO");

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch(() => {
        console.log("ERRO AO FAZER O LOGIN");
      });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUserDetail({});
    setUser(false);
  }

  return (
    <div className="App">
      <h1>{`ReactJS + Firebase :)`}</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (você está logado!)</strong> <br />
          <span>
            ID: {userDetail.uid} - E-mail: {userDetail.email}
          </span>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
          <br />
        </div>
      )}

      <div className="container">
        <h2>Usuários</h2>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />{" "}
        <br />
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe sua senha"
        />{" "}
        <br />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>
      </div>

      <br />
      <hr />

      <div className="container">
        <h2>POSTS</h2>
        <label>ID do Post:</label>
        <input
          placeholder="Digite o ID do Post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />{" "}
        <br />
        <label>Título:</label>
        <textarea
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar posts</button> <br />
        <button onClick={editarPost}>Atualizar post</button>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <strong>ID: {post.id}</strong> <br />
              <span>Título: {post.titulo}</span> <br />
              <span>Autor: {post.autor}</span> <br />
              <button onClick={() => excluirPost(post.id)}>Excluir</button>{" "}
              <br /> <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
