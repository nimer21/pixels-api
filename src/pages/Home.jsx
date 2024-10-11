import { useEffect, useState } from "react";
import "../components/PixelGrid/./PixelGrid.css";
import { Button, Form, Modal } from "react-bootstrap";
/********************************************************************************************************** */
const Home = () => {
  //const localStorageKey = "pixelGridImages";

  const fixedCols = 95; // Number of columns    77
  const fixedRows = 75; // Number of rows       65  => 5005
  const [pixelSize, setPixelSize] = useState(0);

  // Load grid from local storage or initialize it
  const initialGrid =
    //JSON.parse(localStorage.getItem(localStorageKey)) ||
    Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
  const [grid, setGrid] = useState(initialGrid);
  const [loading, setLoading] = useState(true); // State to show loading status

  const [showModalImage, setShowModalImage] = useState(false);
  const [showModalImageLG, setShowModalImageLG] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPixel, setSelectedPixel] = useState();

  /********************************************************************************************************** */

  const handleImageClick = (index) => {
    //console.log("setSelectedPixel=>  ", grid[index].email);
    setSelectedPixel(index);
    //setSelectedImage(image);
    //setShowModalImageLG(true);
    setShowModalImage(true);
    //console.log("image clicked");
  };
  /**********************************************************************************************************/
  const handleCloseModal = () => {
    setShowModalImage(false);
    setShowModalImageLG(false);
    setSelectedImage(null);
    setSelectedPixel(null);
  };
  /********************************************************************************************************** */
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

  /********************************************************************************************************** */
  // Function to convert API response to flat array with pixel number as index
const convertAPIResponseToIndexedArray = (apiResponse, defaultColor = "#ccc", gridSize = 7125) => {
  // Initialize a flat array with default pixel objects
  const flatArray = Array.from({ length: gridSize }, () => ({
      image: null,  // Default image as null
      color: defaultColor,          // Default color for all pixels
  }));

  // Loop through each pixel object in the API response
  apiResponse.forEach((pixelObj) => {
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

// Example API response
const apiResponse = [
  {
    "15": {
      "id": 20,
      "user_id": "8",
      "pixel_number": "15",
      "img": "1.png"
    }
  },
  {
    "70": {
      "id": 20,
      "user_id": "8",
      "pixel_number": "70",
      "img": "1.png"
    }
  },
  {
    "600": {
      "id": 20,
      "user_id": "8",
      "pixel_number": "600",
      "img": "1.png"
    }
  }
];

//const gridSize = 7125; // Adjust this based on your grid's total size
//const localStorageData = convertAPIResponseToIndexedArray(apiResponse, "#ccc", gridSize);
//console.log(localStorageData);

/***************************************************************************************** */
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
          //console.log("data.pixels ",data);
         const localStorageData = convertAPIResponseToIndexedArray(data);
         const approvedGrid = localStorageData || Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
          //console.log(approvedGrid);

          setGrid(localStorageData); // Use the fetched pixel data
          //console.log("data.pixels ",localStorageData); //
        } else {
          // Initialize a new grid with default values if no data is found
          //const newGrid = initializeGrid(10, 10); // For example, 10x10 grid
          const newGrid = Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null }); // For example, 10x10 grid
          setGrid(newGrid);
          //console.log("data ",data[1].data); //
        }

        setLoading(false); // Data loaded
      } catch (error) {
        console.error('Error fetching pixel data:', error);

        // If error occurs, initialize a new grid
        //const newGrid = initializeGrid(10, 10);
        const newGrid = Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
        setGrid(newGrid);
        //console.error('Error fetching pixel data:',JSON.parse(localStorage.getItem(localStorageKey)));

        setLoading(false); // Data loaded
      }
    };

    fetchPixelData();
  }, []); // Empty dependency array ensures it runs once on component mount

  if (loading) {
    return <div className="flex justify-center">جاري التحميل للصفحة...</div>;
  }
  /***************************************************************************************** */
  return (
    <div>
      {/* <p className="mr-7 mb-2 font-semibold text-lg flex justify-center">ربما من الصعب أن نسميه أملاً.. لكنه ليس أقلّ من أن يكون عناداً..</p> */}
      <div className="flex justify-center">
      <p className="mr-7 mb-2 font-semibold text-lg flex justify-center">شبكة المنتجات المحلية</p>
      <p className="mr-7 mb-2 font-semibold text-lg flex justify-center">Local Products Network</p>
      </div>
      {/********************************************************************************************/}
  
      <Modal show={showModalImage} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          {/* <Modal.Title>معاينة الصورة</Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="flex justify-between">
          <div className="w-9/12">
            <p className="uppercase tracking-wide text-lg text-indigo-500 font-extrabold text-center">
              {grid[selectedPixel]?.email}
            </p>
            <Form.Label></Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              //cols={2}
              disabled={true}
              //placeholder="أدخل نبذة عن المنتج / الشركة"
              placeholder={grid[selectedPixel]?.description}
              name="description"
              //resize= "none"
              no-resize
              className="p-2 bg-slate-100 border rounded max-h-32"
            />
            <a href={grid[selectedPixel]?.link} 
            className="flex border border-solid mt-20 content-center items-center justify-center" 
            target="_blank">إضغط&nbsp;
            <p className="text-red-600 inline-block font-semibold">هنـا&nbsp;</p>
            للإنتقال للموقع</a>
          </div>

          {selectedPixel ? (
            <img
              src={"https://pixelsback.localproductsnetwork.com/public/PixelsImages/"+grid[selectedPixel]?.image}
              className="rounded-md object-cover"
              alt="Selected"
              style={{ width: "250px", height: "350px", marginRight:"9px" }}
            />
          ) : (
            "No image selected."
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalImageLG} onHide={handleCloseModal} size="sm">
        <Modal.Header closeButton>
          {/* <Modal.Title>معاينة الصورة</Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="flex justify-between">
        {selectedPixel ? (
            <img
              src={"https://pixelsback.localproductsnetwork.com/public/PixelsImages/"+grid[selectedPixel]?.image}
              alt="Selected"
              className="object-cover rounded-md hover:scale-105 duration-500"
              style={{ width: "55px", height: "50px", marginRight:"9px",  marginLeft:"9px"}}
            />
          ) : (
            "No image selected."
          )}

          <div className="w-9/12 flex flex-col">
            {/* <p className="uppercase tracking-wide text-lg text-indigo-500 font-extrabold text-center">
              {grid[selectedPixel]?.advCoName}
            </p> */}

           <Form.Label className=""></Form.Label>
            <Form.Control
              type="text"
              disabled={true}
              name="advCoName"
              value={grid[selectedPixel]?.email}
              autoFocus
              className="text-primary border rounded font-extrabold text-center mb-4"
            >
            </Form.Control>
           
            

            <a href={grid[selectedPixel]?.link} className="text-center" target="_blank">إضغط&nbsp;
            <p className="text-red-600 inline-block">هنـا</p> للإنتقال للموقع</a>

           
          </div>         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
      {/********************************************************************************************/}
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
        {grid.map((pixel, index) => (
          <div
            key={index}
            className="pixel border-0"
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: pixel.image ? "transparent" : pixel.color,
              backgroundImage: pixel.image ? `url(https://pixelsback.localproductsnetwork.com/public/PartialImages/${pixel.partial_img})` : "none",
              backgroundSize: pixel.backgroundSize || "cover",
              backgroundPosition: pixel.backgroundPosition || "center",
              transition:
                "background-size 0.3s ease, background-position 0.3s ease",
            }}
            title={`خلية رقم ${index}`} // Add the tooltip text here
            onClick={() => pixel.image && handleImageClick(index)} // Open image on click
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Home;
