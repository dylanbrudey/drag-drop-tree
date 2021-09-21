import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`;

export default class Card extends React.Component {
  render() {
    // console.log(this.props.card);
    return (
      <Draggable draggableId={this.props.card.id.toString()} index={this.props.index}>
        {(provided, snapshot) => (
          <div className="text-center"
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
