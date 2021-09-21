import React from 'react';
import { Draggable } from 'react-beautiful-dnd';


export default class Card extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.card.id.toString()} index={this.props.index}>
        {(provided, snapshot) => (
          <div className="text-center border rounded px-3 py-2 my-2 bg-primary text-white"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isdragging={snapshot.isDragging.toString()}
          >
            {this.props.card.content}
          </div>
        )}
      </Draggable>
    );
  }
}
