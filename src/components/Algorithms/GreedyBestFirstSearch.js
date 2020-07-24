export function greedyBFS(grid, startNode, finishNode) {
	var visitedNodes = [];
	var openList = [];
	startNode.f = 0;
	openList.push(startNode);

	while (openList.length > 0) {
		sortNodesByFScore(openList);
		const curr = openList.shift();
		if (curr.isWall === true) {
			continue;
		}
		if (curr.f === Infinity) {
			return visitedNodes;
		}
		curr.isVisited = true;
		visitedNodes.push(curr);
		if (curr === finishNode) {
			return visitedNodes;
		}
		updateUnvisitedNeighbors(grid, curr, openList, finishNode);
	}
	return visitedNodes;
}

function sortNodesByFScore(openNodes) {
	openNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

// Manhattan Distance
function heuristic(nodeA, nodeB) {
	var d1 = Math.abs(nodeA.row - nodeB.row);
	var d2 = Math.abs(nodeA.col - nodeB.col);
	return d1 + d2;
}

function updateUnvisitedNeighbors(grid, curr, openList, finishNode) {
	var neighbors = getOpenNeighbors(grid, curr.row, curr.col);
	for (let neighbor of neighbors) {
		var inOpenList = false;
		var best = false;
		for (let node of openList) {
			if (node === neighbor) {
				inOpenList = true;
				break;
			}
		}
		if (!inOpenList) {
			best = true;
			neighbor.h =
				heuristic(neighbor, finishNode) + (neighbor.isWeighted ? 15 : 0);
			openList.push(neighbor);
		}
		if (best) {
			neighbor.parentNode = curr;
			neighbor.f = neighbor.h;
		}
	}
}

function getOpenNeighbors(grid, row, col) {
	const nodes = [];
	if (row > 0) nodes.push(grid[row - 1][col]);
	if (col > 0) nodes.push(grid[row][col - 1]);
	if (row < grid.length - 1) nodes.push(grid[row + 1][col]);
	if (col < grid[0].length - 1) nodes.push(grid[row][col + 1]);
	// if (row < grid.length - 1 && col < grid[0].length - 1)
	// 	nodes.push(grid[row + 1][col + 1]);
	// if (row > 0 && col < grid[0].length - 1) nodes.push(grid[row - 1][col + 1]);
	// if (row < grid.length - 1 && col > 0) nodes.push(grid[row + 1][col - 1]);
	return nodes.filter((node) => !node.isVisited && !node.isWall);
}

export function getGreedyBFSPath(finishNode) {
	var curr = finishNode;
	var ret = [];
	while (curr.parentNode) {
		ret.push(curr);
		curr = curr.parentNode;
	}
	if (curr !== finishNode) ret.push(curr);
	return ret.reverse();
}
