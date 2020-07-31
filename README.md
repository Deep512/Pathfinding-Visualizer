# PathFinding Visualizer
I built this application because when I was studying Dijkstra and A* Search algorithms I liked how it worked and wanted to visualize them. So i put up my React and looking up at Google(:p) skills together to build up this Pathfinding visualizer.<br />
Heroku Link: https://desolate-everglades-02998.herokuapp.com/ <br />

![Algorithm Working](/public/greedy.gif)<br />

## Algorithms:
*Weighted*<br />

**Dijkstra:** the father of pathfinding algorithms; guarantees the shortest path.<br />

**A\* Search:** uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm.<br />

**Greedy Best First Search:** a faster, more heuristic-heavy version of A*; does not guarantee the shortest path.<br />

*Unweighted*<br />

**Breadth First Search:** similar to dijkstra but works only for unweighted graphs; guarantees the shortest path<br />

**Depth First Search:** a really bad algorithm for pathfinding, does not guarantee the shortest path<br />

DropDown menu of Algorithms<br />
![Algorithms](/public/algo.png)

## Obstacles:
**Wall:** have a distance of Infinity<br /><br />
**Weighted Nodes:** have a distance of 15 units<br />

DropDown menu of Obstacles<br />
![Obstacles](/public/obstacles.png)

## Basic Controls:
The start node is arrow, finish node is circle, walls are dark blue and weighted nodes are represented using locks.<br />
All other nodes are free nodes with default distance 1.<br />

To change positions of nodes:<br />
  - Start: click and drag on the start node to change its position<br />
  - Finish: click and drag on the finish node to change its position<br /><br />

To create obstacles:<br />
 - Wall: Select option Wall from DropDown List and drag over the grid to create walls<br />
 - Weighted Nodes: Select option Weighted Node from DropDown List and drag over the grid to create weighted nodes<br /><br />

To delete obstacles:<br />
  - same as creation<br />

## Running Instructions:
1. Clone the repository<br />
`git clone https://github.com/Deep512/PathFinding-Visualizer`<br /><br />

2. Install npm<br />
`sudo apt install npm`<br /><br />

3. Install the required dependencies<br />
`npm install`<br /><br />

4. Start the react-scripts<br />
`npm start`<br />

## Have Fun!
*a project by Deep Dhanuka*

