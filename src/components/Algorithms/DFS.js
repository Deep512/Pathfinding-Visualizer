export function dfs(grid, startNode, finishNode) {
	startNode.distance = 0;
	const visitedNodes = [];
	const queue = [];
	queue.push(startNode);
	while (queue.length) {
		const closestNode = queue.shift();
		if (closestNode.isWall) {
			continue;
		}
		if (closestNode.distance === Infinity) {
			return visitedNodes;
		}
		if (closestNode.isVisited) {
			continue;
		}
		closestNode.isVisited = true;
		visitedNodes.push(closestNode);
		if (closestNode === finishNode) {
			return visitedNodes;
		}
		updateUnvisitedNeighbors(grid, closestNode, queue);
	}
	return visitedNodes;
}

function updateUnvisitedNeighbors(grid, node, queue) {
	const unvisitedNeighbors = getUnvisitedNeighbors(grid, node.row, node.col);
	for (let n of unvisitedNeighbors) {
		queue.unshift(n);
		n.distance = node.distance + 1;
		n.parentNode = node;
	}
}

function getUnvisitedNeighbors(grid, row, col) {
	const nodes = [];
	if (col > 0) nodes.push(grid[row][col - 1]);
	if (row > 0) nodes.push(grid[row - 1][col]);
	if (col < grid[0].length - 1) nodes.push(grid[row][col + 1]);
	if (row < grid.length - 1) nodes.push(grid[row + 1][col]);
	return nodes.filter((node) => !node.isVisited && !node.isWall);
}

export function getDFSPath(finishNode) {
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
