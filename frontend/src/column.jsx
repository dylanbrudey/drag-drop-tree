import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Card from './card';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
`;
const Title = styled.h3`
  padding: 8px;
`;
const CardList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
`;

export default class Column extends React.Component {
  render() {
    const { column, cards } = this.props;
    return (
      <div className="m-3">
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <CardList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {cards && column.ids.map((id, index) => (
                <Card key={cards[id].id} card={cards[id]} index={index} />
              ))}
              {provided.placeholder}
            </CardList>
          )}
        </Droppable>
      </div>
    );
  }
}
