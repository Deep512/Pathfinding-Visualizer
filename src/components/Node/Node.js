import React from "react";
import { Component } from "react";
import "./Node.css";
class Node extends Component {
	render() {
		const {
			isStart,
			isFinish,
			row,
			col,
			isWall,
			isWeighted,
			onMouseDown,
			onMouseUp,
			onMouseEnter,
			onMouseOut,
		} = this.props;
		const extraClassName = isFinish
			? "finish"
			: isStart
			? "start"
			: isWall
			? "wall"
			: isWeighted
			? "weight"
			: "";
		return (
			<>
				<td
					id={`node-${row}-${col}`}
					className={`node ${extraClassName} `}
					onMouseDown={() => onMouseDown(row, col)}
					onMouseEnter={() => onMouseEnter(row, col)}
					onMouseOut={() => onMouseOut(row, col)}
					onMouseUp={() => onMouseUp()}
				></td>
			</>
		);
	}
}

export default Node;
