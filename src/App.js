import React from "react";
import "./App.css";
import PathfindingVisualizer from "./containers/PathfindingVisualizer";
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	return (
		<div className="App">
			<link
				href="https://fonts.googleapis.com/css2?family=Merriweather&family=Nanum+Myeongjo:wght@700&family=PT+Serif&display=swap"
				rel="stylesheet"
			></link>
			<link
				href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap"
				rel="stylesheet"
			></link>
			<PathfindingVisualizer />
		</div>
	);
}

export default App;
