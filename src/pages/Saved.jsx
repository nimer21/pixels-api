import { useState, useEffect } from "react";
import "../components/PixelGrid/./PixelGrid.css";
import { Button, Form, Modal } from "react-bootstrap";
import countries from "./../helpers/countries";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
//************************************************************************************ */
const Saved = ({ rows, cols }) => {
  const localStorageKey = "pixelGridImages";

  const user = useSelector(state => state?.user?.user);

  const fixedCols = 95; // Number of columns    77
  const fixedRows = 75; // Number of rows       65  => 5005
  const [pixelSize, setPixelSize] = useState(0);
  // Load grid from local storage or initialize it
  const initialGrid =
    JSON.parse(localStorage.getItem(localStorageKey)) ||
    Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
  //************************************************************************************
  const createGrid = () => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid.push(
          <div key={`${i}-${j}`} className="pixel">
            {/* <img src="https://picsum.photos/400/300?random=21" alt="login icon" className="" /> */}
          </div>
        );
      }
    }
    return grid;
  };
  //************************************************************************************ */
  // Initialize the grid with an array of objects, each representing a pixel
  const [grid, setGrid] = useState(initialGrid); // default color for each pixel

  const [gridTemp, setGridTemp] = useState(initialGrid); // default color for each pixel

  const [selectedGrid, setSelectedGrid] = useState([]);

  const [selectedPixels, setSelectedPixels] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");

  //************************************************************************************
  const [data, setData] = useState({
    selectedSquares: "",
    advImage: [],
    email: "",
    mobile:"",
    country: "",
    url: "",
    description: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    //setData({ ...data, [e.target.name]: e.target.value });
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    //console.log("data", data);
    const { selectedSquares, advImage, country, url, description } = data;
    if (
      // !selectedSquares ||
      !advImage.length ||
      !email ||
      !mobile ||
      !country ||
      !url ||
      !description
    ) {
      alert("جميع الحقول مطلوبة");
      return;
    }
    /*
    // upload Squares to the server
    //...
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedSquares,
        advImage,
        country,
        url,
        description,
      }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
      // reset form data
      // close modal
      //window.location.reload();
    }

    if (responseData.error) {
      //throw new Error(`HTTP error! status: ${response.status}`);
      toast.error(responseData?.message);
    }

    // clear form data
    setData({
      selectedSquares: "",
      advImage: [],
      country: "",
      url: "",
      description: "",
    });
    onClose();*/
  };
  //************************************************************************************ */
  useEffect(() => {
    //console.log("Selected Pixels changed:", selectedPixels);
    // Perform any actions that depend on the updated selectedPixels here
  }, [selectedPixels]);

  useEffect(() => {
    const calculatePixelSize = () => {
      const screenWidth = window.innerWidth-45;
      const screenHeight = window.innerHeight-45;
      console.log("screenWidth=====", screenWidth);
      console.log("screenHeight=====", screenHeight);

      const calculatedPixelWidth = Math.floor(screenWidth / fixedCols);
      const calculatedPixelHeight = Math.floor(screenHeight / fixedRows);

      const size = Math.min(calculatedPixelWidth, calculatedPixelHeight);
      console.log("Size=====", size);
      setPixelSize(size);

      /*const newGrid = Array(fixedCols * fixedRows).fill({ color: '#ccc', image: null });
    setGrid(newGrid);*/
    };

    calculatePixelSize();
    window.addEventListener("resize", calculatePixelSize);

    return () => window.removeEventListener("resize", calculatePixelSize);
  }, [fixedCols, fixedRows]);
  //************************************************************************************/
  // Function to handle pixel click
  const handlePixelClick = (index) => {
    if (selectedPixels.includes(index)) {
      setSelectedPixels(selectedPixels.filter((i) => i !== index));
    } else {
      //if(selectedPixels[index].color==="#ccc")
      setSelectedPixels([...selectedPixels, index]);
    }

    /**
     * Example Fix with Functional Update:
      If you need to add or remove pixels from selectedPixels based on the current state,
      you can use the functional form of setState:
     */
    /*
    const handlePixelClick = (index) => {
      setSelectedPixels((prevSelectedPixels) => {
        if (prevSelectedPixels.includes(index)) {
          return prevSelectedPixels.filter(i => i !== index);
        } else {
          return [...prevSelectedPixels, index];
        }
      });
    };
    */
    //************************************************************************************/

    /*
    const newGrid = [...grid];
    newGrid[index] = {
      ...newGrid[index],
      color: newGrid[index].color === '#ccc' ? '#000' : '#ccc' // Toggle color
    };
    setGrid(newGrid);*/

    const newGrid = [...gridTemp];
    newGrid[index] = {
      ...newGrid[index],
      color: newGrid[index].color === "#ccc" ? "#000" : "#ccc", // Toggle color
    };
    setGridTemp(newGrid);

    //console.log("selectedPixels index:", selectedPixels); // Log the index of the selected pixel
    //console.log("Selected grid color:", grid[index].color); // Log the index of the selected pixel
    //console.log("Selected gridTemp color:", gridTemp[index].color); // Log the index of the selected pixel

    /*
    // assigning the list to temp variable
    const temp = [...selectedGrid];
    // removing the element using splice
    newGrid.forEach((nGrid, index) => nGrid.color === '#000' ? temp.push(index) : temp.splice(index))
    // updating the list
    setSelectedGrid(temp);
    // logging the list after removing the element
    console.log("list after Updating (Adding/Removing) the element =", temp);
    */
  };
  //************************************************************************************ */
  const handleSubmit = (e) => {
    e.preventDefault();

    const { selectedSquares, advCoName, advImage,email,mobile, country, url, description } = data;

    if (
      // !selectedSquares ||
      !advImage.length ||
      !advCoName ||
      !email ||
      !mobile ||
      !country ||
      !url ||
      !description
    ) {
      alert("جميع الحقول مطلوبة");
      return;
    }

    const newGrid2 = [...gridTemp];

    selectedPixels.forEach((index) => {
      newGrid2[index] = {
        ...newGrid2[index],
        //image: selectedImage,
        //country: selectedCountry,
        advCoName: data.advCoName,
        country: data.country,
        color: "#ff0",
        email: data.email,
        mobile:data.mobile,
        url: data.url,
        //description: desc,
        description: data.description,
        name: user?.name,
        date: new Date().toLocaleString() + "",
      };
    });

    setGrid(newGrid2);
    setGridTemp(newGrid2);
    //localStorage.setItem(localStorageKey, JSON.stringify(grid));

    //setData(null);
    // clear form data
    setData({
      selectedSquares: "",
      advImage: [],
      email:"",
      mobile:"",
      country: "",
      url: "",
      description: "",
    });

    setSelectedImage(null);
    setSelectedCountry("");
    setSelectedPixels([]); // Take Care Nimer

    handleCloseModal();
  };
  //************************************************************************************
  const handleOpenModal = () => {
    if (selectedPixels.length === 0) {
      alert("برجاء إختيار مربع واحد على الأقل.");
      return;
    }
    setShowModal(true);
  };
  //************************************************************************************

  const handleCloseModal = () => {
    setShowModal(false);
    // setSelectedImage(null);
    // setSelectedCountry('');
    // setSelectedPixels([]); // Take Care Nimer
  };
  //************************************************************************************

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);

        setData((prev) => {
          return {
            ...prev,
            advImage: [...prev.advImage, reader.result],
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };

  //************************************************************************************
  const handleReservedPixels = (selectedIndexes) => {
    // Here you can send the selectedIndexes to your server for reservation
    //console.log("Reserved Pixels:", selectedIndexes);
    setShowModal(false);
  };
  //************************************************************************************ */
  const handlePixelReset = (index) => {
    const newGrid = [...grid];
    newGrid[index] = {
      ...newGrid[index],
      image: null,
      advCoName: null,
      email:"",
      mobile:"",
      country: null,
      color: null,
      url: "",
      desc: null,
    };
    setGrid(newGrid);
    // if (selectedPixels.includes(index)) {
    //   setSelectedPixels(selectedPixels.filter(i => i !== index));
    // } else  { //if(selectedPixels[index].color==="#ccc")
    //   setSelectedPixels([...selectedPixels, index]);
    // }
  };
  //************************************************************************************ */

  const handleResetAll = () => {
    setGrid(newGrid2);
    setSelectedGrid([]);
  };
//************************************************************************************
  const fetchData = async () => {
    const response = await fetch(SummaryApi.request_pixels.url, {
      method: SummaryApi.request_pixels.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataResponse = await response.json();
    setData(dataResponse?.data || []);
  };
  //************************************************************************************ */

  useEffect(() => {
    //localStorage.setItem(localStorageKey, JSON.stringify(grid));
    fetchData();
  }, [grid]);
  //************************************************************************************ */

  return (
    <>
      <div className="flex mb-2 mr-5">
        {/* <Button variant="danger" onClick={() => setShowModal(true)}
      className="btn btn-danger flex items-center content-center text-center hover:scale-105 mr-1 mb-1 
      duration-300 py-1 px-8 rounded-full text-wrap
      relative z-10 focus:outline-none focus:ring-4 focus:ring-indigo-600
      focus:ring-opacity-50 transition-all">
      إرسال المربعات
      </Button> */}

        <Button variant="primary" onClick={handleOpenModal}>
          إرسال المربعات المحجوزة
        </Button>
      </div>

      <Modal
        show={showModal}
        //onHide={() => setShowModal(false)}
        onHide={handleCloseModal}
        animation={true}
        size="lg"
        keyboard={false} //Close the modal when escape key is pressed
        scrollable={false}
        restoreFocus={true}
        //dialogClassName="modal-80w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body
         //max-height= {calc('100vh - 210px')}
         //overflow-y= {auto}
         >
          هل أنت متأكد أنك تريد حجز المربعات؟{" "}
 <div className="grid grid-cols-6 border border-solid bg-primary font-bold text-white rounded-sm p-1">
  {selectedPixels.map((number) => <div key={number}>{number}</div>)}</div>

          <Form
            onSubmit={handleSubmit}
            className="grid p-4 gap-2 overflow-y-scroll h-full pb-5">

            <div className="flex">
              <Form.Group controlId="formImageUpload">
                <Form.Label>تحميل صورة الإعلان</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
              <div className="mt-2 w-32 h-32 mx-auto relative overflow-hidden">
                <img
                  src={
                    selectedImage || "https://picsum.photos/400/300?random=21"
                  }
                  alt="Advertising Image"
                  className="object-cover rounded-md hover:scale-105 duration-500"
                />
              </div>
            </div>            
            <Form.Label>إسم الشركة / المنتج: </Form.Label>
              <Form.Control
                type="text"
                placeholder="إسم الشركة / المنتج"
                //onChange={handleUrlChange}
                //value={data.url}
                name="advCoName"
                value={data.advCoName}
                onChange={handleOnChange}
                required
                autoFocus
                className="p-2 bg-slate-100 border rounded"
              >
              </Form.Control>        
              
            <Form.Group controlId="formCountrySelect">
            <div className="flex items-center">
              <Form.Label>الدولة: </Form.Label>
              <Form.Control
                as="select"
                value={data.country}
                name="country"
                //onChange={handleCountryChange}
                onChange={handleOnChange}
              >
                <option value="">إختار الدولة...</option>
                {countries.map((ele, index) => {
                  return (
                    <option key={ele.value + index} value={ele.value}>
                      {ele.name}
                    </option>
                  );
                })}
                {/* Add more countries as needed */}
              </Form.Control>

              <Form.Label>الرابط: </Form.Label>
              <Form.Control
                type="text"
                placeholder="رابط الموقع"
                //onChange={handleUrlChange}
                //value={data.url}
                name="url"
                value={data.url}
                onChange={handleOnChange}
                required
                autoFocus
                className="p-2 bg-slate-100 border rounded"
              >
              </Form.Control>
              </div>
            </Form.Group>

              <Form.Label>الفقرة التعريفية</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="أدخل نبذة عن المنتج / الشركة"
                value={data.description}
                name="description"
                //onChange={handleDescChange}
                onChange={handleOnChange}
                required
                //resize= "none"
                no-resize
                className="p-2 bg-slate-100 border rounded max-h-32"
              />

               <div className="flex items-center">
            <Form.Label>الإيميل:</Form.Label>
              <Form.Control
                type="email"
                placeholder="البريد الإلكتروني"
                //onChange={handleUrlChange}
                //value={data.url}
                name="email"
                value={data.email}
                onChange={handleOnChange}
                required
                autoFocus
                className="p-2 bg-slate-100 border rounded w-3/6"
              >
              </Form.Control>

              <Form.Label>الهاتف:</Form.Label>
              <Form.Control
                type="text"
                placeholder="رقم الهاتف"
                //onChange={handleUrlChange}
                //value={data.url}
                name="mobile"
                value={data.mobile}
                onChange={handleOnChange}
                required
                autoFocus
                className="p-2 bg-slate-100 border rounded w-3/6"
              >
              </Form.Control>
              </div>          

            <Button variant="primary" type="submit" className="mt-3">
              إرسال
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${fixedCols}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${fixedRows}, ${pixelSize}px)`,
          width: `${fixedCols * pixelSize}px`,
          height: `${fixedRows * pixelSize}px`,
          margin: "auto",
        }}
      >
        {gridTemp.map((pixel, index) => (
          <div
            key={index}
            className={`pixel ${
              pixel.color !== "#000" && pixel.color !== "#ccc"
                ? "pointer-events-none"
                : "none"
            }`} //pointer-events-none
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: pixel.image ? "transparent" : pixel.color,
              backgroundImage: pixel.image ? `url(${pixel.image})` : "none",
              backgroundSize: pixel.backgroundSize || "cover",
              backgroundPosition: pixel.backgroundPosition || "center",
              transition:
                "background-size 0.3s ease, background-position 0.3s ease",
            }}
            title={`إعلان ${index}`} // Add the tooltip text here
            onClick={() => handlePixelClick(index)}
            // onContextMenu={(e) => {
            //   e.preventDefault();
            //   handlePixelReset(index);
            // }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default Saved;
