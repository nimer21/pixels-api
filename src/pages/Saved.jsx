import { useState, useEffect } from "react";
import "../components/PixelGrid/./PixelGrid.css";
import { Button, Form, Modal } from "react-bootstrap";
import countries from "./../helpers/countries";
import axios from "../api/axios";
import SummaryApi from "../common";
//************************************************************************************ */
const Saved = ({ rows, cols }) => {
  const token = sessionStorage.getItem('authTokenJWT');
  //const localStorageKey = "pixelGridImages";


  const fixedCols = 95; // Number of columns    77
  const fixedRows = 75; // Number of rows       65  => 5005
  const [pixelSize, setPixelSize] = useState(0);
  // Load grid from local storage or initialize it
  const initialGrid =
    //JSON.parse(localStorage.getItem(localStorageKey)) ||
    Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
    const [loading, setLoading] = useState(true); // State to show loading status
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
    pixel: [],
    img: [],
    email: "",
    phone:"",
    country: "",
    link: "",
    description: "",
    type: "",
  });

    //************************************************************************************
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
  //************************************************************************************

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        //setSelectedImage(file);

        setData((prev) => {
          return {
            ...prev,
            //img: [...prev.img, reader.result],
            img: [...prev.img, file],
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };
  //************************************************************************************ */
  /*useEffect(() => {
    //console.log("Selected Pixels changed:", selectedPixels);
    // Perform any actions that depend on the updated selectedPixels here
  }, [selectedPixels]);*/
  //************************************************************************************ */

  useEffect(() => {
    const calculatePixelSize = () => {
      const screenWidth = window.innerWidth-45;
      const screenHeight = window.innerHeight-45;
      //console.log("screenWidth=====", screenWidth);
      //console.log("screenHeight=====", screenHeight);

      const calculatedPixelWidth = Math.floor(screenWidth / fixedCols);
      const calculatedPixelHeight = Math.floor(screenHeight / fixedRows);

      const size = Math.min(calculatedPixelWidth, calculatedPixelHeight);
      //console.log("Size=====", size);
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
  // Function to transform the selected pixel array into the backend's format
const transformPixelsToBackendFormat = (pixels, userId = 5) => {
  const formattedData = [];

  pixels?.forEach((pixel, index) => {
    // Build the pixel data object in the required format
    const pixelData = {
      [pixel]: {
        //id: null, // Set to null or provide actual ID if available
        //user_id: userId.toString(),  // Convert user_id to string if needed
        pixel_number: pixel.toString(),  // Use index as pixel number
        img: data.img || null,  // Handle if image is missing
        //reservation_date: null,  // Default to null
        //created_at: new Date().toISOString(),  // Set current timestamp
        //updated_at: new Date().toISOString(),  // Set current timestamp
        //status: pixel.status || "pending",  // Default to "pending" if status missing
        email: data.email || null,  // Default to null if email missing
        phone: data.phone || null,  // Default to null if phone missing
        country: data.country || null,  // Default to null if country missing
        link: data.link || null,  // Default to null if link missing
        description: data.description || null,  // Default to null if description missing
        //unit: pixel.unit || null,  // Default to null if unit missing
        //color: pixel.color || "#ccc",  // Default to "#ccc" if color missing
        type: pixel.type || null,  // Default to null if type missing
        //partial_img: pixel.partial_img || null  // Default to null if partial_img missing
      }
    };

    // Push the transformed pixel data to the array
    formattedData.push(pixelData);
  });

  return formattedData;
};

// Example usage: Transform the selected pixels array into the backend format
//const transformedData = transformPixelsToBackendFormat(selectedPixels);
//console.log(JSON.stringify(transformedData, null, 2));  // Pretty-print the result
  //************************************************************************************ */
  const handleSubmit = (e) => {
    e.preventDefault();

    const { pixel, img, email,phone, country, link, description } = data;

    if (
      // !selectedSquares ||
      !img.length ||
      //!advCoName ||
      !email ||
      !phone ||
      !country ||
      !link ||
      !description
    ) {
      alert("جميع الحقول مطلوبة");
      return;
    }

    const newGrid2 = [...gridTemp];

    selectedPixels?.forEach((index) => {
      newGrid2[index] = {
        ...newGrid2[index],
        //image: selectedImage,
        //country: selectedCountry,
        pixel_number: index.toString(),
        pixel: selectedPixels,
        img:data.img[0],
        email: data.email,
        phone:data.phone,
        country: data.country,
        link: data.link,
        description: data.description,
        type: data.type,
        //advCoName: data.advCoName,
        color: "#ff0",
        //description: desc,
        //name: user?.name,
        //date: new Date().toLocaleString() + "",
      };
    });

    //console.log("selectedPixels",selectedPixels); // (4) [11, 10, 105, 106]
    //console.log("newGrid2",newGrid2);
    //console.log("data",data);
    setGrid(newGrid2);
    setGridTemp(newGrid2);
    //localStorage.setItem(localStorageKey, JSON.stringify(grid));

    // Example usage: Transform the selected pixels array into the backend format
    //const transformedData = transformPixelsToBackendFormat(selectedPixels);
    //console.log(JSON.stringify(transformedData, null, 2));  // Pretty-print the result

    // Here you can send the selectedIndexes to your server for reservation
    sendPixelsToBackend(data, token);

    //setData(null);
    // clear form data
    setData({
      pixel: [],
      img: [],
      email:"",
      phone:"",
      country: "",
      link: "",
      description: "",
      type: "",
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
    setData((prev) => {
      return {
        ...prev,
        //img: [...prev.img, reader.result],
        pixel: [...prev?.pixel, selectedPixels],
      };
    });

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
  // Function to convert API response to flat array with pixel number as index
  const convertAPIResponseToIndexedArray = (apiResponse, defaultColor = "#ccc", gridSize = 7125) => {
    // Initialize a flat array with default pixel objects
    const flatArray = Array.from({ length: gridSize }, () => ({
        image: null,  // Default image as null
        color: defaultColor,          // Default color for all pixels
    }));
  
    // Loop through each pixel object in the API response
    apiResponse?.forEach((pixelObj) => {
      const pixelData = Object.values(pixelObj)[0]; // Extract pixel data object
      const pixelIndex = parseInt(pixelData.pixel_number, 10); // Convert pixel_number to index
  
      // Place the pixel data at the corresponding index in the flat array
      flatArray[pixelIndex] = {
        image: pixelData.img || null,  // Use image from API or null if not provided
        status : "Approved",
        email: pixelData.email,
        phone: pixelData.phone,
        country: pixelData.country,
        link: pixelData.link,
        description: pixelData.description || null,
        unit: pixelData.unit,
        color: defaultColor,          // Default color (or modify if necessary)
        type: pixelData.type,
        partial_img: pixelData.partial_img || null
      };
    });
  
    return flatArray; // Return the flat array with pixels indexed by pixel_number
  };
    
  /***************************************************************************************** */
  // Function to send the selected pixels to the backend
const sendPixelsToBackend = async (pixelData, token) => {
  try {

  const formData = new FormData();
  
  // Add the image
  formData.append('img', pixelData.img[0]); //image_url_or_base64_encoded_image

  // Add other fields
  formData.append('email', pixelData.email);
  formData.append('phone', pixelData.phone);
  formData.append('country', pixelData.country);
  formData.append('link', pixelData.link);
  formData.append('description', pixelData.description);
  formData.append('type', "#ff0");
  formData.append('color', "#ff0");

  // Add each pixel value
  selectedPixels.forEach((pixel, index) => {
    formData.append(`pixel[${index}]`, pixel); // Laravel expects pixel.* notation
  });

    const responseRequest = await axios.post(
      "api/request/pixels",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, //{"message":"Unauthenticated."} | 401 (Unauthorized)
          'Content-Type': 'multipart/form-data'
        },
      }
    );

    /** Network Response from backend
     * {
    "message": "The img field must be a file of type: png, jpg, jpeg, gif, svg, webp.",
    "errors": {
        "img": [
            "The img field must be a file of type: png, jpg, jpeg, gif, svg, webp."
        ]
    }
}
     */

    // if (!responseRequest.ok) {
    //   throw new Error('Failed to send pixel data to backend');
    // }

    //const result = await responseRequest.json();
    console.log('Response from backend:', responseRequest); // resp.data.message =  "message": "a request has been sent to the admin , waiting for admin's approval"
    //{data: {…}, status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}

    //return result;

  } catch (error) {
    console.error('Error sending pixel data:', error);
    console.error('token', token);
  }
};

/** Network Response from backend
 * {
    "message": "The img field is required. (and 4 more errors)",
    "errors": {
        "img": [
            "The img field is required."
        ],
        "email": [
            "The email field is required."
        ],
        "phone": [
            "The phone field is required."
        ],
        "country": [
            "The country field is required."
        ],
        "link": [
            "The link field is required."
        ]
    }
}
 */
  //************************************************************************************ */
// Fetch data from the backend or initialize a new grid
useEffect(() => {
  const fetchPixelData = async () => {
    try {
      // Step 1: Fetch the data from the backend
      const response = await fetch('https://pixelsback.localproductsnetwork.com/api/approved/pixels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Define the expected response type
        },
      });

      // Step 2: Check if response is okay
      if (!response.ok) {
        throw new Error('Failed to fetch pixel data');
      }
      const data = await response.json();

      // Step 3: Set pixel data or initialize if no data is returned
      if (data && data.length > 0) {
        //console.log("data.pixels ",data[0]['1545'].img);
       const localStorageData = convertAPIResponseToIndexedArray(data);
       const approvedGrid = localStorageData || Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
        //console.log(approvedGrid);

        setGrid(localStorageData); // Use the fetched pixel data
        setGridTemp(localStorageData); // Use the fetched pixel data
        //console.log("data.pixels ",localStorageData); //
      } else {
        // Initialize a new grid with default values if no data is found
        //const newGrid = initializeGrid(10, 10); // For example, 10x10 grid
        const newGrid = Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null }); // For example, 10x10 grid
        setGrid(newGrid);
        setGridTemp(newGrid);
        //console.log("data ",data[1].data); //
      }

      setLoading(false); // Data loaded
    } catch (error) {
      console.error('Error fetching pixel data:', error);

      // If error occurs, initialize a new grid
      //const newGrid = initializeGrid(10, 10);
      const newGrid = Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
      setGrid(newGrid);
      setGridTemp (newGrid);
      //console.error('Error fetching pixel data:',JSON.parse(localStorage.getItem(localStorageKey)));

      setLoading(false); // Data loaded
    }
  };

  fetchPixelData();
}, []); // Empty dependency array ensures it runs once on component mount

  //************************************************************************************ */

if (loading) {
  return <div className="flex items-center justify-center">جاري تحميل المربعات &#128512; ...</div>;
}
//************************************************************************************
/*
  useEffect(() => {
    //localStorage.setItem(localStorageKey, JSON.stringify(grid));
    fetchData();
    sendPixelsToBackend(formattedData, "12|H6xcxYvgpCOsZVD2iJ7fYKVc3M1G8L5a91qkDuGrcffd3127");
  }, [grid]);*/
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
  {selectedPixels?.map((number) => <div key={number}>{number}</div>)}</div>

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
                //name="advCoName"
                //value={data.advCoName}
                //onChange={handleOnChange}
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
                name="link"
                value={data.link}
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
                name="phone"
                value={data.phone}
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
              pixel.color !== "#000" && pixel.color !== "#ccc" || pixel.image !== null
                ? "pointer-events-none"
                : "none"
            }`} //pointer-events-none
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: pixel.image ? "transparent" : pixel.color,
              backgroundImage: pixel.partial_img ? `url(https://pixelsback.localproductsnetwork.com/public/PartialImages/${pixel.partial_img})` : "none",
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
