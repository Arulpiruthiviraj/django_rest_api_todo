import React, { useState ,useEffect} from "react";
import Modal from "./components/Modal";
import axios from "axios";


function App() {
    const [todoList, setTodoList] = useState([]);
    const [viewCompleted, setViewCompleted] = useState(false);
    const initialFormState = { id: null, title: '', description: '',completed: false};
    const [activeItem, setActiveItem] = useState(initialFormState);
    const [modalOpen,setModalOpen]=useState(false);

    const refreshList = () => {
        axios
          .get("http://localhost:8000/api/todos/")
          .then(res => setTodoList( res.data ))
          .catch(err => console.log(err));
      };

      useEffect(() => {
          refreshList();
          }, []);

      const displayCompleted = status => {
        if (status) {
          setViewCompleted(true);
        }
        setViewCompleted(false);
      };

      const toggle = () => {
          setModalOpen(false)
      };
     const handleSubmit = item => {
         toggle();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/todos/${item.id}/`, item)
            .then(res => refreshList());
          return;
        }
        axios
          .post("http://localhost:8000/api/todos/", item)
          .then(res => refreshList());
      };
     const handleDelete = item => {
        axios
          .delete(`http://localhost:8000/api/todos/${item.id}`)
          .then(res => refreshList());
      };
     const createItem = () => {
        const item = { title: "", description: "", completed: false };
        setActiveItem(item);
        setModalOpen(true);
      };
     const editItem = item => {
          setActiveItem(item);
          setModalOpen(true);
      };

     const renderTabList = () => {
        return (
          <div className="my-5 tab-list">
            <span
              onClick={() => setViewCompleted(true)}
              className={viewCompleted ? "active" : ""}
            >
              complete
            </span>
            <span
              onClick={() => setViewCompleted(false)}
              className={viewCompleted ? "" : "active"}
            >
              Incomplete
            </span>
          </div>
        );
      };

     const renderItems = () => {
        const newItems = todoList.filter(
          item => item.completed === viewCompleted
        );
        return newItems.map(item => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span
              className={`todo-title mr-2 ${
                viewCompleted ? "completed-todo" : ""
              }`}
              title={item.description}
            >
              {item.title}
            </span>
            <span>
              <button
                onClick={() => editItem(item)}
                className="btn btn-secondary mr-2"
              >
                {" "}
                Edit{" "}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </span>
          </li>
        ));
      };

         return (
          <main className="content">
            <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
            <div className="row ">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  <div className="">
                    <button onClick={createItem} className="btn btn-primary">
                      Add task
                    </button>
                  </div>
                  {renderTabList()}
                  <ul className="list-group list-group-flush">
                    {renderItems()}
                  </ul>
                </div>
              </div>
            </div>
            {modalOpen ? (
              <Modal
                activeItem={activeItem}
                toggle={toggle}
                onSave={handleSubmit}
              />
            ) : null}
          </main>
        );

}

export default App;