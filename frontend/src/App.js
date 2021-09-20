import { useCallback, useEffect, useRef, useState } from 'react';
// import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
import axios from 'axios';


function App() {
  const [data, setData] = useState({})
  const url = 'http://127.0.0.1:8000/stores';

  useEffect(() => {
      axios.get(url)
          .then(res => {
            const newData = res.data;
            console.log(newData);
            setData(sortData(newData))
          });
  }, []);

  const sortData = (initialData) => {
    let data = {
      cities: [],
      brands: [],
      count: [],
      columns: {
        'cities': {
          id: 'cities',
          title: 'Cities',
          ids: [],
        },
        'brands': {
          id: 'brands',
          title: 'Brands',
          ids: [],
        },
        'count': {
          id: 'count',
          title: 'Count',
          ids: [],
        },
      },
      columnOrder: ['cities', 'brands', 'count']

    };
    initialData.forEach(store => {
      if (!data['cities'].some(city => city.id === store.city.id)) {
        data["cities"].push({
          id: store.city.id,
          content: store.city.name,
        });
        data['columns']['cities'].ids.push(store.city.id);
      }

        data["brands"].push({
          id: store.id,
          city: store.city.id,
          content: store.brand.name
        });
        data['columns']['brands'].ids.push(store.id);

        data["count"].push({
          id: store.id,
          city: store.city.id,
          content: store.employee_count
        });
        data['columns']['count'].ids.push(store.id);
    });
    // console.log(data);
    return data;
  }
  // state = initialData;
  // const [state, setState] = useState(initialData);

  const onDragStart = () => {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2s ease';
  }

  const onDragUpdate = update => {
    const { destination } = update;
    // TODO: changer la condition "data['cities'] et l'élargir à toutes les cartes et types de données"
    const opacity = destination
      ? destination.index / Object.keys(data['cities']).length
      : 0;
    document.body.style.backgroundColor = `rgba( 153, 141, 217, ${opacity})`;
  };

  const onDragEnd = (result) => {
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.index < source.index) {
      return;
    }

    const column = data['columns'][source.droppableId];
    const newTaskIds = Array.from(column.ids);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    };
    setData(newState);
    // setState(newState);
  };
  console.log(data);
  console.log(data['columnOrder']);
  // console.log(typeof(data['columnOrder']));
  return (
    <div className="d-flex">
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
      >
      {data['columnOrder'] && (data['columnOrder'].map(columnId => {
        const column = data['columns'][columnId];
        console.log(data['cities']);
        const cards = data[columnId];
        return <Column key={column.id} column={column} cards={cards} />;
      }))}
    </DragDropContext>
      </div>
  );
}

export default App;
