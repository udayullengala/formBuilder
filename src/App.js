import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap'
import { useState } from 'react';

function App() {

  const [displayData, setDisplayData] = useState([])
  const [activeData, setActiveData] = useState(null)

  const DragStarted = (e, dataType) => {
    console.log("Drag Started", e);
    e.dataTransfer.setData("type", dataType);
  };

  const DraggingOver = (e) => {
    e.preventDefault();
  };

  const DragOvered = (e) => {
    console.log("Dropped", e);
    let transferedData = e.dataTransfer.getData("type");
    let jsonData = {
      id: displayData.length,
      type: transferedData,
      label: transferedData,
      class: "",
      option: [
        {
          value: "1", label: "Option 1",
        },
        {
          value: "2", label: "Option 2"
        }
      ]
    }

    setDisplayData([...displayData, jsonData])
    console.log(transferedData);
  };

  console.log(activeData)

  const makActive = (e, curData) => {
    if (e.target.classList.contains('defaultActiveClass')) {
      document.querySelectorAll('.defaultActiveClass').forEach((cur) => {
        cur.classList.remove("border")
      })
      e.target.classList.toggle('border')
      setActiveData(curData)

    }
  }


  const updateData = (e) => {
    console.log(e.target.name)
    console.log(e.target.value)

    setActiveData({...activeData, [e.target.name]: e.target.value})
  
    const index = displayData.findIndex(obj => obj.id === activeData.id);

    setDisplayData(prevDisplayData => {
      const newArray = [...prevDisplayData];
      newArray[index] = {
        ...newArray[index],
        [e.target.name]: e.target.value
      };
      return newArray;
    });
  }

  // const addOption = () => {
  //   setActiveData({...activeData, option: [...activeData?.option, {value: "", label: ""}]})
  // }

  // const removeOption = (data) => {
  //   console.log(data)
  //   setActiveData({...activeData, option: activeData.option.filter((cur) => String(cur.value) !== String(data))})
  // }

  const renderSettings = () => {
    let first, second;

    if (activeData.type === "input" || activeData.type === "image" || activeData.type === "select") {
      first = (
        <>
          <div className='label mb-4'>
            <label htmlFor="label" className="text-capitalize">Label</label>
            <input
              type="text"
              className="form-control"
              name="label"
              defaultValue={activeData.label}
              onChange={(e) => updateData(e)}
            />
          </div>
          <div className='class mb-4'>
            <label htmlFor="class" className="text-capitalize">Class</label>
            <input
              type="text"
              className="form-control"
              name="class"
              defaultValue={activeData.class}
              onChange={(e) => updateData(e)}
            />
          </div>
        </>
        
      );
    }
    if (activeData.type === "select") {
      second = (
        <>
          <div className="option_settings">
            {
              activeData.option?.map((cur, key) => {
                return <div className="option_div d-flex justify-content-center align-items-center gap-3">
                  <div className="value">
                    <label htmlFor={`opt_value_${key}`}>Value</label>
                    <input id={`opt_value_${key}`} className="form-control" type="text" defaultValue={cur.value} />
                  </div>
                  <div className="label">
                    <label htmlFor={`opt_label_${key}`}>Label</label>
                    <input id={`opt_label_${key}`} className="form-control" type="text" defaultValue={cur.label} />
                  </div>
                  
                  {/* <div className="action d-flex justify-content-center align-items-center gap-3">
                    <div className="min" onClick={() => removeOption(cur.value)}>-</div>
                    <div className="plus" onClick={() => addOption()}>+</div>
                  </div> */}
                </div>
              })
            }
          </div>
        </>
      )
    }

    return [first, second];
  }
    
  

  return (
    <div className="App">
      <div className="row m-5">
        <div className="col-4 border">
          Dropable items
          <hr />
          <div className="items d-flex justify-content-start align-items-center gap-3 pb-3">
            <div
              draggable
              className="input p-2 border rounded"
              onDragStart={(e) => DragStarted(e, "input")}
            >
              Input
            </div>
            <div
              draggable
              className="image p-2 border rounded"
              onDragStart={(e) => DragStarted(e, "image")}
            >
              Image
            </div>
            <div
              draggable
              className="image p-2 border rounded"
              onDragStart={(e) => DragStarted(e, "select")}
            >
              Select
            </div>
          </div>
        </div>
        <div className="col-4 border"
          onDragOver={(e) => DraggingOver(e)}
          onDrop={(e) => DragOvered(e)}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>Dropped items</div>
            <button className='btn' onClick={() => {
              setDisplayData([])
              setActiveData(null)
            }}>Clear</button>
          </div>

          <div className="dropedItems mt-4">
            {
              displayData.map((curElem) => {
                switch (curElem.type) {
                  case "input":
                    return <div className='mb-4 defaultActiveClass p-2 rounded' onClick={(e) => makActive(e, curElem)}>
                      <label htmlFor={curElem.id} className='text-capitalize'>{curElem.label}</label>
                      <input className={`w-100 ${curElem.class}`} id={`input_${curElem.id}`} type="text" />
                    </div>;
                  case "image":
                    return <div className='mb-4 defaultActiveClass p-2 rounded' onClick={(e) => makActive(e, curElem)}>
                        <label htmlFor={curElem.id} className='text-capitalize'>{curElem.label}</label>
                        <input className={`w-100 ${curElem.class}`} id={`image_${curElem.id}`} type="file" />
                    </div>;
                  case "select":
                    return <div className='mb-4 defaultActiveClass p-2 rounded' onClick={(e) => makActive(e, curElem)}>
                      <label htmlFor={curElem.id} className='text-capitalize'>{curElem.label}</label>
                      <select className={`w-100 ${curElem.class}`} id={`select_${curElem.id}`}>
                        {
                          curElem.option?.map((cur) => {
                            return <option value={cur.value}>{cur.label}</option>
                          })
                        }
                        
                      </select>
                    </div>;
                  default:
                    return null; // Handle other cases or provide a default action if needed
                }
              })
            }
          </div>
        </div>
        <div className="col-4 border">
          <div className="d-flex justify-content-between align-items-center">
            Customization
            <button className='btn' onClick={() => console.log(displayData)}>Show Json</button>

          </div>
          <hr />
          {

            activeData ? renderSettings() : <div className='text-center'>
              Not Selected
            </div>
            
          }

          
        </div>
        
      </div>
    </div>
  );
}

export default App;
