import { useCallback, useEffect, useRef, useState } from 'react';
// import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
import axios from 'axios';
import produce, {} from "immer";


function App() {
  const [data, setData] = useState({})
  const url = 'http://127.0.0.1:8000/stores';

  useEffect(() => {
    console.log("useEffect here");
    axios.get(url)
        .then(res => {
          const newData = res.data;
          // console.log(newData);
          setData(sortData(newData))
        });
  }, []);

  const sortData = (initialData) => {
    let data = {
      cities: {},
      brands: {},
      count: {},
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
      if (!data['cities'].hasOwnProperty('city_' + store.city.id)) {
        data["cities"]['city_' + store.city.id] = {
            id: 'city_' + store.city.id,
            content: store.city.name,
          };
        data['columns']['cities'].ids.push('city_' + store.city.id);
      }

      data["brands"]['brand_' + store.id] = {
          id: 'brand_' + store.id,
          storeId: store.id,
          city: store.city.id,
          content: store.brand.name,
      };
        data['columns']['brands'].ids.push('brand_' + store.id);

        data["count"]['count_' + store.id] = {
            id: 'count_' + store.id,
            storeId: store.id,
            city: store.city.id,
            content: store.employee_count,
          };
        data['columns']['count'].ids.push('count_' + store.id);
    });
    // console.log(data);
    return data;
  }

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
  //TODO: Fix this
  const updateColumn = (source, destination, columnId, currentDraggedId) => {
    const column = data['columns'][columnId];
    console.log("column: ");
    console.log(column);
    const newIds = Array.from(column.ids);
    newIds.splice(source.index, 1);
    newIds.splice(destination.index, 0, currentDraggedId);
    const newColumn = {
      ...column,
      ids: newIds,
    };
    const newData = {
      ...data,
      'columns': {
        ...data['columns'],
        [newColumn.id]: newColumn,
      },
    };
    console.log("newData: ");
    console.log("data: ");
    console.log(data);
    setData({...newData});
    console.log("data: ");
    console.log(data);
    //
  }
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
    //Next fix : check here => "taskids and such"
    let column2_Id = null;
    let draggable2_Id = null;
    switch (source.droppableId) {
      case 'brands':
        column2_Id = 'brands';
        draggable2_Id =  'brand_' + draggableId[draggableId.length - 1];
        updateColumn(source, destination, source.droppableId, draggableId)
        updateColumn(source, destination, column2_Id, draggable2_Id)
        break;
      case 'count':
        column2_Id = 'count';
        draggable2_Id =  'count_' + draggableId[draggableId.length - 1];
        updateColumn(source, destination, source.droppableId, draggableId)
        updateColumn(source, destination, column2_Id, draggable2_Id)
        break;
      default:
        break;
    }
  //   const column = data['columns'][source.droppableId];
  //   console.log("column: ");
  //   console.log(column);
  //   const newIds = Array.from(column.ids);
  //   newIds.splice(source.index, 1);
  //   newIds.splice(destination.index, 0, draggableId);
  //   const newColumn = {
  //     ...column,
  //     ids: newIds,
  //   };
  //   const newData = {
  //     ...data,
  //     'columns': {
  //       ...data['columns'],
  //       [newColumn.id]: newColumn,
  //     },
  //   };
  //   console.log("newData: ");
  //   // console.log(newData);
  //   console.log("data: ");
  //   console.log(data);
  //   // setData(prevData => {
  //   //   return {...prevData,
  //   //     'columns': {
  //   //     ...prevData['columns'],
  //   //     [newColumn.id]: newColumn,
  //   //   }}
  //   // });

  //   // setData(prev => (
  //   //   produce(prev, draft => {
  //   //     draft['columns'][newColumn.id].ids = newIds;
  //   //   }
  //   //   )
  //   // ));
  //   setData({...newData});
  //   console.log("data: ");
  //   console.log(data);
  //   // setState(newState);
  };
  // console.log(data);
  // console.log(data['columnOrder']);
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
        // console.log(data['cities']);
        const cards = data[columnId];
        return <Column key={column.id} column={column} cards={cards} />;
      }))}
    </DragDropContext>
      </div>
  );
}

export default App;
