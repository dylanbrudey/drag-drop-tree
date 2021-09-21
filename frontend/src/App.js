import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
import axios from 'axios';


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
          cityId: 'city_' + store.city.id,
          content: store.brand.name,
      };
        data['columns']['brands'].ids.push('brand_' + store.id);

        data["count"]['count_' + store.id] = {
            id: 'count_' + store.id,
            storeId: store.id,
            cityId: 'city_' + store.city.id,
            content: store.employee_count,
          };
        data['columns']['count'].ids.push('count_' + store.id);
    });
    return data;
  }

  const onDragStart = () => {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2s ease';
  }

  const onDragUpdate = update => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(data['cities']).length
      : 0;
    document.body.style.backgroundColor = `rgba( 153, 141, 217, ${opacity})`;
  };

  const updateColumn = (newData, sourceIndex, destinationIndex, columnId, itemsToMoveCount=1) => {
    const column = data['columns'][columnId];
    const newIds = Array.from(column.ids);
    const itemsToMove = newIds.splice(sourceIndex, itemsToMoveCount);
    console.log('itemsTOMOVE:');
    console.log(itemsToMove);
    console.log('itemsTOMOVECOUNT:');
    console.log(itemsToMoveCount);
    console.log('sourceindex:');
    console.log(sourceIndex);
    console.log('destinationindex:');
    console.log(destinationIndex);
    if (itemsToMoveCount === 1)
      newIds.splice(destinationIndex, 0, itemsToMove[0]);
    else {
      for (let i = 0; i < itemsToMove.length; i++) {
        newIds.splice(destinationIndex + i, 0, itemsToMove[i]);
      }
    }
    const newColumn = {
      ...column,
      ids: newIds,
    };
    newData = {
      ...newData,
      'columns': {
        ...newData['columns'],
        [newColumn.id]: newColumn,
      },
    };
    return newData;
  }

  const updateStore = (newData, sourceIndex, destinationIndex, itemId) => {
    let newSourceIndex = null;
    let draggedCityCount = null;
    const citiesId = newData['columns']['cities'].ids.slice(sourceIndex, destinationIndex);
    const passedCityCount =  getContentCount(newData, citiesId);
    const values = getContentByCity(newData, itemId);
    newSourceIndex = values[0];
    draggedCityCount = values[1];
    const newDestinationIndex = newSourceIndex + passedCityCount;
    newData = updateColumn(newData, newSourceIndex, newDestinationIndex , 'brands', draggedCityCount);
    newData = updateColumn(newData, newSourceIndex, newDestinationIndex , 'count', draggedCityCount);
    return newData;
  }
  const getContentByCity = (newData, cityId) => {
    let lowestIndex = Object.keys(newData['count']).length - 1;
    let draggedCityCount = 0;
    Object.getOwnPropertyNames(newData['count']).map((content) => {
      if (cityId === newData['count'][content].cityId) {
        draggedCityCount++;
        const indexInColumn = newData['columns']['count'].ids.indexOf(content);
        lowestIndex = indexInColumn < lowestIndex ? indexInColumn : lowestIndex;
      }
    });
    return [lowestIndex, draggedCityCount];
  };
  const getContentCount = (newData, cityIds) => {
    let passedCityCount = 0;
    Object.getOwnPropertyNames(newData['count']).map((content) => {
      if (cityIds.includes(newData['count'][content].cityId)) {
        passedCityCount++;
      }
    });
    return passedCityCount;
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
    let newData = {...data};
    switch (source.droppableId) {
      case 'brands':
        column2_Id = 'count';
        break;
      case 'count':
        column2_Id = 'brands';
        break;
      default:
        break;
      }

      newData = updateColumn(newData, source.index, destination.index, source.droppableId)
      if (source.droppableId !== 'cities') {
        newData = updateColumn(newData, source.index, destination.index, column2_Id)
      }
      else {
        newData = updateStore(newData, source.index, destination.index, draggableId);
      }
      setData({...newData});
  };
  return (
    <div className="d-flex">
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
      >
      {data['columnOrder'] && (data['columnOrder'].map(columnId => {
        const column = data['columns'][columnId];
        const cards = data[columnId];
        return <Column key={column.id} column={column} cards={cards} />;
      }))}
    </DragDropContext>
      </div>
  );
}

export default App;
