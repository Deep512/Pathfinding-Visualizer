import React, { Component } from "react";
import Node from "../components/Node/Node";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { dijkstra, getDijkstraPath } from "../components/Algorithms/Dijkstra";
import { astar, getAStarPath } from "../components/Algorithms/AStar";
import {
	greedyBFS,
	getGreedyBFSPath,
} from "../components/Algorithms/GreedyBestFirstSearch";
import { bfs, getBFSPath } from "../components/Algorithms/BFS";
import { dfs, getDFSPath } from "../components/Algorithms/DFS";
import "./PathfindingVisualizer.css";

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			grid: [],
			dragStart: false,
			dragEnd: false,
			mousePressed: false,
			obstacle: "Wall",
			startX: 14,
			startY: 15,
			finishX: 14,
			finishY: 55,
			inProgress: false,
			afterPath: false,
			algo: "",
		};
	}

	componentDidMount() {
		const final = this.getInitialGrid();
		this.setState({ grid: final });
	}

	onMouseDown(row, col) {
		if (this.state.inProgress || this.state.afterPath) {
			return;
		}
		const { grid } = this.state;
		if (grid[row][col].isStart) {
			this.setState({
				mousePressed: true,
				dragStart: true,
			});
			return;
		}
		if (grid[row][col].isFinish) {
			this.setState({
				mousePressed: true,
				dragEnd: true,
			});
			return;
		}
		const newGrid = this.updatedGrid(this.state.grid, row, col);
		this.setState({ grid: newGrid, mousePressed: true });
	}

	onMouseEnter(row, col) {
		const { grid } = this.state;
		if (this.state.inProgress || this.state.afterPath) {
			return;
		}
		if (!this.state.mousePressed) {
			return;
		}
		if (this.state.dragStart) {
			const newGrid = grid;
			newGrid[row][col].isStart = !grid[row][col].isStart;
			newGrid[row][col].isWall = false;
			newGrid[row][col].isWeighted = false;
			this.setState({ grid: newGrid, startX: row, startY: col });
			return;
		}
		if (this.state.dragEnd) {
			const newGrid = grid;
			newGrid[row][col].isWeighted = false;
			newGrid[row][col].isWall = false;
			newGrid[row][col].isFinish = !grid[row][col].isFinish;
			this.setState({
				grid: newGrid,
				finishX: row,
				finishY: col,
			});
			return;
		}
		if (grid[row][col].isStart || grid[row][col].isFinish) {
			return;
		}
		const newGrid = this.updatedGrid(this.state.grid, row, col);
		this.setState({ grid: newGrid });
	}

	onMouseOut(row, col) {
		if (this.state.inProgress || this.state.afterPath) {
			return;
		}
		const { grid } = this.state;
		if (!this.state.mousePressed) {
			return;
		}
		if (this.state.dragStart) {
			const newGrid = grid;
			newGrid[row][col].isStart = !grid[row][col].isStart;
			this.setState({ grid: newGrid, startX: row, startY: col });
			return;
		}
		if (this.state.dragEnd) {
			const newGrid = grid;
			newGrid[row][col].isFinish = !grid[row][col].isFinish;
			this.setState({
				grid: newGrid,
				finishX: row,
				finishY: col,
			});
			return;
		}
	}

	onMouseUp(row, col) {
		if (this.state.inProgress || this.state.afterPath) {
			return;
		}
		this.setState({ dragStart: false, dragEnd: false, mousePressed: false });
	}

	animateNoPath() {
		for (let i = 0; i < 30; i++) {
			for (let j = 0; j < 70; j++) {
				setTimeout(() => {
					if (
						!this.state.grid[i][j].isVisited &&
						!this.state.grid[i][j].isFinish &&
						!this.state.grid[i][j].isStart &&
						!this.state.grid[i][j].isWall &&
						!this.state.grid[i][j].isWeighted
					)
						document.getElementById(`node-${i}-${j}`).className = "node nopath";
				}, 40 * i + 40 * j);
			}
			setTimeout(() => {
				if (i === 29) window.alert("No Path Found :(");
			}, 4500);
		}
	}

	animatePathNodes(nodesInOrder) {
		if (nodesInOrder.length === 0) {
			setTimeout(() => {
				this.animateNoPath();
			}, 2000);
			this.setState({ inProgress: false, afterPath: true });

			return;
		}
		for (let i = 0; i <= nodesInOrder.length; i++) {
			if (i === nodesInOrder.length) {
				setTimeout(() => {
					this.setState({ inProgress: false, afterPath: true });
				}, 30 * i);
				return;
			}
			setTimeout(() => {
				const node = nodesInOrder[i];
				if (!node.isStart && !node.isFinish && !node.isWeighted)
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node inpath";
				else if (node.isStart) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node startSpecial";
				} else if (node.isFinish) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node finishSpecial";
				} else {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node weightSpecial";
				}
			}, 30 * i);
		}
	}

	animateVisitedNodes(visitedNodes, nodesInOrder) {
		for (let i = 0; i <= visitedNodes.length; i++) {
			if (i === visitedNodes.length) {
				setTimeout(() => {
					this.animatePathNodes(nodesInOrder);
				}, 10 * i);
				return;
			}
			setTimeout(() => {
				const node = visitedNodes[i];
				if (!node.isStart && !node.isFinish && !node.isWeighted)
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node visited";
				else if (node.isStart) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node visitedStart";
				} else if (node.isFinish) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node visitedFinish";
				} else {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node visitedWeight";
				}
			}, 10 * i);
		}
	}

	visualizeDijkstra(grid, startNode, finishNode) {
		const visitedNodes = dijkstra(grid, startNode, finishNode);
		const nodesInOrder = getDijkstraPath(finishNode);
		this.animateVisitedNodes(visitedNodes, nodesInOrder);
	}

	visualizeAStar(grid, startNode, finishNode) {
		const visitedNodes = astar(grid, startNode, finishNode);
		const nodesInOrder = getAStarPath(finishNode);
		this.animateVisitedNodes(visitedNodes, nodesInOrder);
	}

	visualizeBFS(grid, startNode, finishNode) {
		const visitedNodes = bfs(grid, startNode, finishNode);
		const nodesInOrder = getBFSPath(finishNode);
		this.animateVisitedNodes(visitedNodes, nodesInOrder);
	}

	visualizeDFS(grid, startNode, finishNode) {
		const visitedNodes = dfs(grid, startNode, finishNode);
		const nodesInOrder = getDFSPath(finishNode);
		this.animateVisitedNodes(visitedNodes, nodesInOrder);
	}

	visualizeGreedy(grid, startNode, finishNode) {
		const visitedNodes = greedyBFS(grid, startNode, finishNode);
		const nodesInOrder = getGreedyBFSPath(finishNode);
		this.animateVisitedNodes(visitedNodes, nodesInOrder);
	}

	visualize = (algorithm) => {
		if (this.state.inProgress) {
			return;
		}
		var a = document.getElementById("info");
		if (algorithm === "Algorithms") {
			a.innerHTML = "Please choose an algorithm to visualize";
			return;
		}
		this.setState({ inProgress: true });
		if (this.state.afterPath) {
			this.clearPath();
		}
		var { grid, startX, startY, finishX, finishY } = this.state;

		var startNode = grid[startX][startY];
		var finishNode = grid[finishX][finishY];
		if (algorithm === "Dijkstra") {
			this.visualizeDijkstra(grid, startNode, finishNode);
		} else if (algorithm === "A*") {
			this.visualizeAStar(grid, startNode, finishNode);
		} else if (algorithm === "Greedy") {
			this.visualizeGreedy(grid, startNode, finishNode);
		} else if (algorithm === "BFS") {
			this.visualizeBFS(grid, startNode, finishNode);
		} else if (algorithm === "DFS") {
			this.visualizeDFS(grid, startNode, finishNode);
		}
	};

	chooseAlgorithm = (algorithm) => {
		var a = document.getElementById("info");
		if (algorithm === "Dijkstra") {
			algorithm = "W";
			a.innerHTML =
				"Dijkstra's Algorithm is <i>weighted</i> and <i>guarantees</i> the shortest path!";
		} else if (algorithm === "A* Search") {
			algorithm = "W";
			a.innerHTML =
				"A* Search is <i>weighted</i> and <i>guarantees</i> the shortest path!";
		} else if (algorithm === "Greedy Best First Search") {
			algorithm = "W";
			a.innerHTML =
				"Greedy Best First Search is <i>weighted</i> and <i>does not guarantee</i> the shortest path!";
		} else if (algorithm === "Breadth First Search (BFS)") {
			algorithm = "U";
			this.clearWeightedNodes();
			a.innerHTML =
				"Breath First Search is <i>unweighted</i> and <i>guarantees</i> the shortest path!";
		} else if (algorithm === "Depth First Search (DFS)") {
			algorithm = "U";
			this.clearWeightedNodes();
			a.innerHTML =
				"Depth First Search is <i>unweighted</i> and <i>does not guarantee</i> the shortest path!";
		}
		this.setState({ algo: algorithm });
	};

	chooseObstacle = (val) => {
		this.setState({ obstacle: val });
	};

	render() {
		const { grid } = this.state;
		return (
			<>
				<NavigationBar
					onVisualizePressed={this.visualize}
					onClearPathPressed={this.clearPath}
					onClearGridPressed={this.clearGrid}
					onChoosingAlgorithm={this.chooseAlgorithm}
					onChoosingObstacle={this.chooseObstacle}
				/>
				<div className="grid" onKeyDown={this.onKeyDown}>
					<h3 id="info">Please choose an algorithm to visualize</h3>
					<table>
						<tbody>
							{grid.map((row, index) => {
								return (
									<tr key={index}>
										{row.map((node, index) => {
											return (
												<Node
													key={index}
													row={node.row}
													col={node.col}
													isStart={node.isStart}
													isFinish={node.isFinish}
													isWall={node.isWall}
													isWeighted={node.isWeighted}
													onMouseDown={(row, col) => this.onMouseDown(row, col)}
													onMouseEnter={(row, col) =>
														this.onMouseEnter(row, col)
													}
													onMouseUp={() => this.onMouseUp()}
													onMouseOut={(row, col) => this.onMouseOut(row, col)}
												></Node>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</>
		);
	}

	getInitialGrid() {
		var final = [];
		const { startX, startY, finishX, finishY } = this.state;
		for (let i = 0; i < 30; i++) {
			var cur = [];
			for (let j = 0; j < 70; j++) {
				const node = {
					row: i,
					col: j,
					isStart: i === startX && j === startY,
					isFinish: i === finishX && j === finishY,
					isWeighted: false,
					distance: Infinity,
					isVisited: false,
					isWall: false,
					parentNode: null,
					f: Infinity,
					g: 0,
					h: Infinity,
				};
				cur.push(node);
			}
			final.push(cur);
		}
		return final;
	}

	clearWeightedNodes() {
		const { grid } = this.state;
		var final = grid;
		for (let row of final) {
			for (let i = 0; i < row.length; i++) {
				const node = row[i];
				if (node.isWeighted) {
					const newNode = {
						...node,
						isWeighted: false,
					};
					if (!newNode.isStart && !newNode.isFinish)
						document.getElementById(`node-${node.row}-${node.col}`).className =
							"node";
					row[i] = newNode;
				}
			}
		}
		this.setState({ grid: final, afterPath: false });
	}

	clearPath = () => {
		if (this.state.inProgress) {
			return;
		}
		const { grid } = this.state;
		var final = grid;
		for (let row of final) {
			for (let i = 0; i < row.length; i++) {
				const node = row[i];
				const newNode = {
					...node,
					distance: Infinity,
					isVisited: false,
					parentNode: null,
					f: Infinity,
					g: 0,
					h: Infinity,
				};
				if (
					!newNode.isStart &&
					!newNode.isFinish &&
					!newNode.isWall &&
					!newNode.isWeighted
				)
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node";
				else if (newNode.isStart) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node start";
				} else if (newNode.isFinish) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node finish";
				} else if (newNode.isWall) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node wall";
				} else {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node weight";
				}
				row[i] = newNode;
			}
		}
		this.setState({ grid: final, afterPath: false });
	};

	clearGrid = () => {
		if (this.state.inProgress) {
			return;
		}
		const { grid } = this.state;
		var final = grid;
		for (let row of final) {
			for (let i = 0; i < row.length; i++) {
				const node = row[i];
				const newNode = {
					...node,
					distance: Infinity,
					isVisited: false,
					isWall: false,
					isWeighted: false,
					parentNode: null,
					f: Infinity,
					g: 0,
					h: Infinity,
				};
				if (!newNode.isStart && !newNode.isFinish)
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node";
				else if (newNode.isStart) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node start";
				} else {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						"node finish";
				}
				row[i] = newNode;
			}
		}
		this.setState({ grid: final, afterPath: false });
	};

	updatedGrid(grid, row, col) {
		const newGrid = grid.slice();
		const node = grid[row][col];
		if (this.state.obstacle === "Wall") {
			if (node.isWeighted) {
				node.isWeighted = false;
			}
			const newNode = {
				...node,
				isWall: !node.isWall,
			};
			newGrid[row][col] = newNode;
			return newGrid;
		} else {
			if (this.state.algo === "U") {
				return grid;
			}
			if (node.isWall) {
				node.isWall = false;
			}
			const newNode = {
				...node,
				isWeighted: !node.isWeighted,
			};
			newGrid[row][col] = newNode;
			return newGrid;
		}
	}
}
