import React from "react";
import { useState, useEffect } from "react";

const username = "EstefaniaGarza_ToDoList";
const API_URL = "https://playground.4geeks.com/todo";

const Home = () => {
	const [inputValue, setInputValue] = useState("")
	const [tasks, setTasks] = useState([])

	const getTasks = () => {
		fetch(`${API_URL}/users/${username}`)
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
				setTasks(data.todos || []);
			})
			.catch((error) => console.log(error));
	};


	const createUser = () => {
		fetch(`${API_URL}/users/${username}`, {
			method: "POST"
		})
			.then((resp) => {
				console.log(resp.status);
				return resp.json();
			})
			.then((data) => {
				console.log(data);
				getTasks();
			})
			.catch((error) => {
				console.log(error);
				getTasks();
			});

	};

	useEffect(() => {
		createUser();
	}, []);

	const addTask = () => {
		const newTask = {
			label: inputValue.trim(),
			is_done: false
		};

		fetch(`${API_URL}/todos/${username}`, {
			method: "POST",
			body: JSON.stringify(newTask),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
				setInputValue("");
				getTasks();
			})
			.catch((error) => console.log(error));
	};

	const deleteTask = (taskId) => {
		fetch(`${API_URL}/todos/${taskId}`, {
			method: "DELETE"
		})
			.then((resp) => {
				console.log(resp.status);
				getTasks();
			})
			.catch((error) => console.log(error));
	};

	const clearAllTasks = () => {
		Promise.all(
			tasks.map((task) =>
				fetch(`${API_URL}/todos/${task.id}`, {
					method: "DELETE"
				})
			)
		)
			.then(() => getTasks())
			.catch((error) => console.log(error));
	};

	return (
		<div className="todo-page">
			<h1>ToDo's</h1>
			<div className="todo-card">
				<input className="todo-input"
					placeholder={tasks.length === 0 ? "No hay tareas, añadir tareas" : "Añadir tarea"}
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							if (inputValue.trim() !== "") {
								addTask();
							}
						}
					}}
				/>

				<ul className="todo-list">
					{tasks.map((task) => (
						<li className="task-item" key={task.id}>
							{task.label}
							<button className="delete-button" onClick={() => deleteTask(task.id)}>
								×
							</button>
						</li>
					))
					}
				</ul>

				<div className="todo-footer">
					{tasks.length} tareas pendientes
					{tasks.length > 0 && (
						<button className="clear-button" onClick={clearAllTasks}>
							Limpiar todas
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;