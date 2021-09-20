import { useCallback, useEffect, useRef, useState } from 'react';
// import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
import axios from 'axios';


function App() {
  const [data, setData] = useStateCallback({});
  const [isUpdated, setIsUpdated] = useState(false);
  const url = 'http://127.0.0.1:8000/stores';
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };
  useEffect(() => {
      // fetch(url, options)
      // .then(response => {
      //   // console.log(response.status);
      //   return response.json()
      // })
      // .then(json => {
      //   // console.log(json);
      //   setData(sortData(json));
      // });
      // async function fetchMyAPI() {
      //   let response = await fetch(url, options)
      //   response = await response.json()
      //   setData(sortData(response))
      // }
      // fetchMyAPI()
      axios.get(url)
      .then(res => {
        const newData = res.data;
        console.log(newData);
        setData(sortData(newData))
      })
  }, []);

  function useStateCallback(initialState) {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // init mutable ref container for callbacks
  
    const setStateCallback = useCallback((state, cb) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(state);
    }, []); // keep object reference stable, exactly like `useState`
  
    useEffect(() => {
      // cb.current is `null` on initial render, 
      // so we only invoke callback on state *updates*
      console.log("nonono");
      if (cbRef.current) {
        console.log("heyyyyoooooo callback mann ");
        cbRef.current(state);
        cbRef.current = null; // reset callback after execution
        setIsUpdated(true);
      }
    }, [state]);
  
    return [state, setStateCallback];
  }

  const sortData = (initialData) => {
    let data = {
      cities: [],
      brand: [],
      count: [],
      columns: {
        'col-1': {
          id: 'col-1',
          title: 'Cities',
          citiesIds: [],
        },
        'col-2': {
          id: 'col-2',
          title: 'Brands',
          brandsIds: [],
        },
        'col-3': {
          id: 'col-3',
          title: 'Count',
          countIds: [],
        },
      },
      columnOrder: ['col-1', 'col-2', 'col-3']

    };
    initialData.forEach(store => {
      if (!data['cities'].some(city => city.id === store.city.id)) {
        data["cities"].push({
          id: store.city.id,
          name: store.city.name,
        });
        data['columns']['col-1'].citiesIds.push(store.city.id);
      }

        data["brand"].push({
          id: store.id,
          city: store.city.id,
          brand: store.brand.name
        });
        data['columns']['col-2'].brandsIds.push(store.id);

        data["count"].push({
          id: store.id,
          city: store.city.id,
          brand: store.employee_count
        });
        data['columns']['col-3'].countIds.push(store.id);
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
    const opacity = destination
      ? destination.index / Object.keys(state.tasks).length
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

    const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
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

    // setState(newState);
  };
  console.log(data);
  console.log(data['columnOrder']);
  console.log(isUpdated);
  // console.log(typeof(data['columnOrder']));
  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      {/* {isUpdated ? (data['columnOrder'].map(columnId => {
        const column = data['columns'][columnId];
        console.log(data['cities']);
        const tasks = data['cities'];
        return <Column key={column.id} column={column} tasks={tasks} />;
      })) : <div></div>} */}
    </DragDropContext>
  );
}

export default App;
