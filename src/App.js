import { useState, useEffect } from "react";
import { db } from "./firebaseConnection";
import {
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

import "./app.css";

const App = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
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

  return (
    <div className="App">
      <h1>{`ReactJS + Firebase :)`}</h1>

      <div className="container">
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
