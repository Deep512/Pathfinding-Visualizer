export function bfs(grid, startNode, finishNode) {
	startNode.distance = 0;
	const visitedNodes = [];
	const unVisitedNodes = getAllNodes(grid);
	while (unVisitedNodes.length) {
		sortNodesByDistance(unVisitedNodes);
		const closestNode = unVisitedNodes.shift();
		if (closestNode.isWall) {
			continue;
		}
		if (closestNode.distance === Infinity) {
			return visitedNodes;
		}
		closestNode.isVisited = true;
		visitedNodes.push(closestNode);
		if (closestNode === finishNode) {
			return visitedNodes;
		}
		updateUnvisitedNeighbors(grid, closestNode);
	}
}

function sortNodesByDistance(unvisitedNodes) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(grid, node) {
	const unvisitedNeighbors = getUnvisitedNeighbors(grid, node.row, node.col);
	for (let n of unvisitedNeighbors) {
		n.distance = node.distance + 1;
		n.parentNode = node;
	}
}

function getUnvisitedNeighbors(grid, row, col) {
	const nodes = [];
	if (row > 0) nodes.push(grid[row - 1][col]);
	if (col > 0) nodes.push(grid[row][col - 1]);
	if (row < grid.length - 1) nodes.push(grid[row + 1][col]);
	if (col < grid[0].length - 1) nodes.push(grid[row][col + 1]);
	return nodes.filter((node) => !node.isVisited);
}

function getAllNodes(grid) {
	const nodes = [];
	for (let row of grid) {
		for (let col of row) {
			nodes.push(col);
		}
	}
	return nodes;
}

export function getBFSPath(finishNode) {
	const nodes = [];
	const node = finishNode;
	while (finishNode.parentNode) {
		nodes.push(finishNode);
		finishNode = finishNode.parentNode;
	}
	if (node !== finishNode) nodes.push(finishNode);
	nodes.reverse();
	return nodes;
}
