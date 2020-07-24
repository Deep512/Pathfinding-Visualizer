import React, { Component } from "react";
import { Container, Dropdown, Menu, Button } from "semantic-ui-react";
import "./NavigationBar.css";

export default class NavigationBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fixed: false,
			algorithm: "Algorithms",
		};
	}

	algorithmOptions = [
		{
			key: "Dijkstra",
			text: "Dijkstra",
			value: "Dijkstra",
		},
		{
			key: "A* Search",
			text: "A* Search",
			value: "A* Search",
		},
		{
			key: "Greedy",
			text: "Greedy Best First Search",
			value: "Greedy",
		},
		{
			key: "BFS",
			text: "Breadth First Search (BFS)",
			value: "BFS",
		},
		{
			key: "DFS",
			text: "Depth First Search (DFS)",
			value: "DFS",
		},
	];

	obstacles = [
		{
			key: "Wall",
			text: "Wall",
			value: "Wall",
			image: { src: "/wall.png" },
		},
		{
			key: "Weighted Node",
			text: "Weighted Node",
			value: "Weighted Node",
			image: { src: "/weight.svg" },
		},
	];

	hideFixedMenu = () => this.setState({ fixed: false });
	showFixedMenu = () => this.setState({ fixed: true });

	handleVisualize = (e) => {
		this.props.onVisualizePressed(this.state.algorithm);
	};

	obstacleCatcher = (e) => {
		let val = e.currentTarget.getElementsByTagName("span")[0].innerHTML;
		this.props.onChoosingObstacle(val);
	};

	algorithmCatcher = (e) => {
		let val = e.currentTarget.getElementsByTagName("span")[0].innerHTML;
		this.props.onChoosingAlgorithm(val);
		if (val === "A* Search") {
			val = "A*";
		} else if (val === "Breadth First Search (BFS)") {
			val = "BFS";
		} else if (val === "Depth First Search (DFS)") {
			val = "DFS";
		} else if (val === "Greedy Best First Search") {
			val = "Greedy";
		}
		this.setState({ algorithm: val });
	};
	// #061830
	render() {
		const { onClearPathPressed, onClearGridPressed } = this.props;
		return (
			<>
				<Menu fixed="top" inverted id="navbar">
					<Container>
						<Menu.Item header>
							<Dropdown
								placeholder="Algorithms"
								fluid
								selection
								id="algo"
								onChange={this.algorithmCatcher}
								options={this.algorithmOptions}
							/>
						</Menu.Item>
						<Menu.Item header>
							<Dropdown
								placeholder="Obstacles"
								fluid
								selection
								id="walls"
								onChange={this.obstacleCatcher}
								options={this.obstacles}
							/>
						</Menu.Item>
						<Menu.Item>
							<Button
								id="button-visualize"
								variant="primary"
								onClick={this.handleVisualize}
							>
								{this.state.algorithm === "Algorithms"
									? "Pick An Algorithm"
									: `Visualize ${this.state.algorithm} !`}
							</Button>
							<Button id="button" onClick={() => onClearPathPressed()}>
								Clear Path
							</Button>
							<Button id="button" onClick={() => onClearGridPressed()}>
								Clear Grid
							</Button>
						</Menu.Item>
					</Container>
				</Menu>
			</>
		);
	}
}
