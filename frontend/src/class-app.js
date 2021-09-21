import React from 'react';
import ReactDOM from 'react-dom';
// import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
// import initialData from './initial-data';
import Column from './column';
import axios from 'axios';

const url = 'http://127.0.0.1:8000/stores';
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
    if (!data['cities'].some(city => city.id === 'city_' + store.city.id)) {
      data["cities"].push({
        id: 'city_' + store.city.id,
        content: store.city.name,
      });
      data['columns']['cities'].ids.push('city_' + store.city.id);
    }

      data["brands"].push({
        id: 'brand_' + store.id,
        city: store.city.id,
        content: store.brand.name
      });
      data['columns']['brands'].ids.push('brand_' + store.id);

      data["count"].push({
        id: 'count_' + store.id,
        city: store.city.id,
        content: store.employee_count
      });
      data['columns']['count'].ids.push('count_' + store.id);
  });
  // console.log(data);
  return data;
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      data: {}
    });
  }
  
  componentDidMount() {
    console.log("useEffect here");
    axios.get(url)
        .then(res => {
          const newData = res.data;
          // console.log(newData);
          this.setState({
            data: sortData(newData)
          })
        });
  }

  onDragStart = () => {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2s ease';
  }

  // onDragUpdate = update => {
  //   const { destination } = update;
  //   const opacity = destination
  //     ? destination.index / Object.keys(this.state.tasks).length
  //     : 0;
  //   document.body.style.backgroundColor = `rgba( 153, 141, 217, ${opacity})`;
  // };

  onDragEnd = result => {
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

    console.log("source droppableid: ");
    console.log(source.droppableId);
    const column = this.state.data['columns'][source.droppableId];
    console.log("column: ");
    console.log(column);
    const newIds = Array.from(column.ids);
    newIds.splice(source.index, 1);
    newIds.splice(destination.index, 0, draggableId);
    //Next fix : check here => "taskids and such"
    const newColumn = {
      ...column,
      ids: newIds,
    };
    console.log("newColumn: ");
    console.log(newColumn);
    const newData = {
      ...this.state.data,
      'columns': {
        ...this.state.data['columns'],
        [newColumn.id]: newColumn,
      },
    };
    console.log("newData: ");
    // console.log(newData);
    console.log("data: ");
    console.log(this.state.data);
    // setData(prevData => {
    //   return {...prevData,
    //     'columns': {
    //     ...prevData['columns'],
    //     [newColumn.id]: newColumn,
    //   }}
    // });
    this.setState({
      data: {...newData}
    })
    // setData(prev => (
    //   produce(prev, draft => {
    //     draft['columns'][newColumn.id].ids = newIds;
    //   }
    //   )
    // ));
    // setData({...newData});
    console.log("data: ");
    console.log(this.state.data);
    // setState(newState);
  };

  render() {
    const { data } = this.state; 
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        // onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
      {data['columnOrder'] && (data['columnOrder'].map(columnId => {
        const column = data['columns'][columnId];
        // console.log(data['cities']);
        const cards = data[columnId];
        return <Column key={column.id} column={column} cards={cards} />;
      }))}
      </DragDropContext>
    );
  }
}

// ReactDOM.render(<App />, document.getElementById('root'));
